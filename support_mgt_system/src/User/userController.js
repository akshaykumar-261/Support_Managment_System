import userService from "./userService.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import fs from "fs";
import { authMessage, userMessage } from "../helper/commanMessage.js";
import { sendResponse } from "../helper/responseHandler.js";
import { OTP_TYPE, STATUS_CODE } from "../helper/statusCode.js";
import * as commanFunction from "../../utility/commanFunction.js";
import { ROLE } from "../helper/roleBase.js";
import { sendForgotPasswordOtp } from "../../utility/sendForgotPasswordOtp.js";
import { sendRegistrationOtp } from "../../utility/sendRegistrationOtp.js";
import { sendAgentCredentials } from "../../utility/sendAgentCredentials.js";
import { getFirebaseAdmin } from "../helper/fireBaseAdmin.js";
import { OAuth2Client } from "google-auth-library";
import { sendPhoneOtp, verifyPhoneOtp } from "../../utility/twilioService.js";
import { v4 as uuid4 } from "uuid";
import { emailQueue } from "../../queue/emailQueue.js";
export default class userController {
  async init(db) {
    this.service = new userService();
    this.Models = db.models;
    await this.service.init(db);
  }
  async userCreate(req, res) {
    const { email } = req.body;
    const exitingUser = await this.service.getByEmail(email);
    if (exitingUser) {
      if (req.file) {
        commanFunction.deleteFile(req.file.path);
      }
      return sendResponse(res, STATUS_CODE.BAD_REQUEST, userMessage.USER_EXIST);
    }
    let profileImage = null;
    if (req.file) {
      profileImage = req.file.path;
    }
    const otp = commanFunction.generateSecureOtp(6);
    const user = await this.service.createUser({
      ...req.body,
      profile_Img: profileImage,
      role_Id: ROLE.CUSTOMER,
      otp,
      otp_type: OTP_TYPE.VERIFY_EMAIL,
      is_verified: false,
      otp_expire: new Date(Date.now() + 10 * 60 * 1000),
    });
    await emailQueue.add("registration",{
      email: user.email,
      otp,
      name: user.name,
    });
    return sendResponse(res, STATUS_CODE.CREATED, userMessage.USER_CREATED, {
      user,
    });
  }
  async agentCreate(req, res) {
    const { email, password, name } = req.body;
    const exitingUser = await this.service.getByEmail(email);
    if (exitingUser) {
      if (req.file) {
        commanFunction.deleteFile(req.file.path);
      }
      return sendResponse(res, STATUS_CODE.BAD_REQUEST, userMessage.USER_EXIST);
    }
    let profileImage = null;
    if (req.file) {
      profileImage = req.file.path;
    }
    const user = await this.service.createUser({
      ...req.body,
      profile_Img: profileImage,
      role_Id: ROLE.AGENT,
    });
    await sendAgentCredentials(user.email, user.name, password);
    return sendResponse(res, STATUS_CODE.CREATED, userMessage.USER_CREATED, {
      user,
    });
  }
  async userUpdate(req, res) {
    const { id } = req.params;
    const existingUser = await this.service.getUserById(id);

    if (!existingUser) {
      return sendResponse(
        res,
        STATUS_CODE.BAD_REQUEST,
        userMessage.USER_NOT_FOUND,
      );
    }
    let profileImage = existingUser.profile_Img;
    // new image uploaded
    if (req.file) {
      // delete old image
      if (existingUser.profile_Img) {
        commanFunction.deleteFile(existingUser.profile_Img);
      }
      profileImage = req.file.path;
    }

    const payload = {
      ...req.body,
      profile_Img: profileImage,
    };
    await this.service.updateUser(id, payload);
    const updatedUser = await this.service.getUserById(id);
    return sendResponse(
      res,
      STATUS_CODE.SUCCESS,
      userMessage.USER_UPDATED,
      updatedUser,
    );
  }
  async getUserList(req, res) {
    const {
      page = 1,
      limit = 10,
      role,
      name,
      email,
      is_active,
      search,
    } = req.query;
    const pagignation = commanFunction.getPagination(page, limit);
    const users = await this.service.getUserList({
      offset: pagignation.offset,
      limit: pagignation.limit,
      role,
      name,
      email,
      is_active,
      search,
    });
    const response = commanFunction.paginationsResponse(users);
    return sendResponse(
      res,
      STATUS_CODE.SUCCESS,
      userMessage.USER_FETCHED,
      response,
    );
  }
  async deleteUser(req, res) {
    const { id } = req.params;
    const existingUser = await this.service.getUserById(id);
    if (!existingUser) {
      return sendResponse(
        res,
        STATUS_CODE.BAD_REQUEST,
        userMessage.USER_NOT_FOUND,
      );
    }
    // delete profile image
    if (existingUser.profile_Img) {
      commanFunction.deleteFile(existingUser.profile_Img);
    }
    await this.service.deleteUserById(id);
    return sendResponse(res, STATUS_CODE.SUCCESS, userMessage.USER_DELETED);
  }
  async login(req, res) {
    const sessionId = uuid4();
    console.log("===", sessionId);
    const { email, password, device_token, device_type, device_id } = req.body;

    const userInDb = await this.service.getByEmail(email);
    if (!userInDb) {
      return sendResponse(
        res,
        STATUS_CODE.BAD_REQUEST,
        userMessage.USER_NOT_FOUND,
      );
    }
    if (!userInDb.is_verified) {
      return sendResponse(
        res,
        STATUS_CODE.BAD_REQUEST,
        userMessage.VERIFY_EMAIL,
      );
    }
    const isMatch = await bcrypt.compare(password, userInDb.password);
    if (!isMatch) {
      return sendResponse(
        res,
        STATUS_CODE.BAD_REQUEST,
        userMessage.INVALID_CREDENTIALS,
      );
    }
    const accessToken = commanFunction.generateAccessToken(userInDb, sessionId);
    const refreshToken = commanFunction.generateRefreshToken(
      userInDb,
      sessionId,
    );
    // await this.service.updateUser(userInDb.id, {
    //   refreshToken,
    // });
    if (device_token && device_id) {
      const existingDevice = await this.Models.UserDevices.findOne({
        where: {
          user_id: userInDb.id,
          device_id: device_id,
        },
      });
      if (existingDevice) {
        const abc = await existingDevice.update({
          device_token,
          device_type: device_type,
          is_login: true,
          login_time: new Date(),
          logout_time: null,
          session_id: sessionId,
        });
      } else {
        const a = await this.Models.UserDevices.create({
          user_id: userInDb.id,
          device_token,
          device_type: device_type,
          device_id,
          is_login: true,
          login_time: new Date(),
          session_id: sessionId,
        });
      }
    }
    return sendResponse(res, STATUS_CODE.SUCCESS, userMessage.LOGIN_SUCCESS, {
      accessToken,
      refreshToken,
    });
  }
  async refreshToken(req, res) {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return sendResponse(
        res,
        STATUS_CODE.BAD_REQUEST,
        userMessage.REQUIRED_TOKEN,
      );
    }
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await this.service.getUserById(decoded.id);
    if (!user) {
      return sendResponse(
        res,
        STATUS_CODE.BAD_REQUEST,
        userMessage.USER_NOT_FOUND,
      );
    }
    const activeDevice = await this.Models.UserDevices.findOne({
      where: {
        user_id: user.id,
        session_id: decoded.sessionId,
        is_login: true,
      },
    });
    if (!activeDevice) {
      return sendResponse(
        res,
        STATUS_CODE.BAD_REQUEST,
        userMessage.INVALID_SESSION,
      );
    }
    const newAccessToken = commanFunction.generateAccessToken(
      user,
      decoded.sessionId,
    );
    return sendResponse(res, STATUS_CODE.SUCCESS, userMessage.NEW_TOKEN, {
      accessToken: newAccessToken,
    });
  }
  async logout(req, res) {
    const user = req.user;
    const { device_id } = req.body;
    if (!user || !user.id) {
      return sendResponse(res, STATUS_CODE.BAD_REQUEST, authMessage.UN_AUTH);
    }
    await this.service.clearRefreshToken(user.id);
    await this.Models.UserDevices.update(
      {
        is_login: false,
        logout_time: new Date(),
      },
      {
        where: {
          user_id: user.id,
          device_id,
        },
      },
    );
    return sendResponse(res, STATUS_CODE.SUCCESS, userMessage.LOGOUT_SUCCESS);
  }
  async getProfile(req, res) {
    try {
      const userId = req.user.id;

      const user = await this.service.getProfile(userId);

      if (!user) {
        return sendResponse(
          res,
          STATUS_CODE.BAD_REQUEST,
          userMessage.USER_NOT_FOUND,
        );
      }
      const responseData = {
        ...user.toJSON(),
        appIcon: "default",
      };

      return sendResponse(
        res,
        STATUS_CODE.SUCCESS,
        userMessage.FETCH_PROFILE,
        responseData,
        //user,
      );
    } catch (error) {
      return sendResponse(res, STATUS_CODE.SERVER_ERROR, error.message);
    }
  }
  async forgotPassword(req, res) {
    const { email } = req.body;
    const user = await this.service.getByEmail(email);
    if (!user) {
      return sendResponse(
        res,
        STATUS_CODE.BAD_REQUEST,
        userMessage.USER_NOT_FOUND,
      );
    }
    const otp = commanFunction.generateSecureOtp(6);
    const otpType = OTP_TYPE.FORGOT_PASSWORD;
    await this.service.saveOtp(user.id, otp, otpType);
    await sendForgotPasswordOtp(user.email, otp, user.name);
    return sendResponse(res, STATUS_CODE.SUCCESS, userMessage.OTP_SENT);
  }
  async verifyOtp(req, res) {
    const { email, otp, type } = req.body;
    const user = await this.service.getByEmail(email);
    if (!user) {
      return sendResponse(
        res,
        STATUS_CODE.BAD_REQUEST,
        userMessage.USER_NOT_FOUND,
      );
    }
    if (!user.otp) {
      return sendResponse(
        res,
        STATUS_CODE.BAD_REQUEST,
        userMessage.OTP_NOT_FOUND,
      );
    }
    if (!user.otp || user.otp.toString() !== otp.toString()) {
      return sendResponse(
        res,
        STATUS_CODE.BAD_REQUEST,
        userMessage.INVALID_OTP,
      );
    }

    if (new Date() > new Date(user.otp_expire)) {
      return sendResponse(
        res,
        STATUS_CODE.BAD_REQUEST,
        userMessage.OTP_EXPIRED,
      );
    }
    if (user.otp_type !== type) {
      return sendResponse(
        res,
        STATUS_CODE.BAD_REQUEST,
        userMessage.INVALID_TYPE,
      );
    }

    const payload = {
      otp: null,
      otp_expire: null,
      otp_type: null,
    };

    if (type === OTP_TYPE.VERIFY_EMAIL) {
      payload.is_verified = true;
    }

    await this.service.updateUser(user.id, payload);

    return sendResponse(res, STATUS_CODE.SUCCESS, userMessage.OTP_VERIFIED);
  }
  async resendOtp(req, res) {
    const { email, type } = req.body;
    const user = await this.service.getByEmail(email);
    if (!user) {
      return sendResponse(
        res,
        STATUS_CODE.BAD_REQUEST,
        userMessage.USER_NOT_FOUND,
      );
    }
    const otp = commanFunction.generateSecureOtp(6);
    await this.service.saveOtp(user.id, otp, type);
    if (type === OTP_TYPE.VERIFY_EMAIL) {
      await sendRegistrationOtp(user.email, otp, user.name);
    } else {
      await sendForgotPasswordOtp(user.email, otp, user.name);
    }
    return sendResponse(res, STATUS_CODE.SUCCESS, userMessage.OTP_SENT);
  }
  async resetPassword(req, res) {
    const { email, newPassword } = req.body;
    const user = await this.service.getByEmail(email);
    if (!user) {
      return sendResponse(
        res,
        STATUS_CODE.BAD_REQUEST,
        userMessage.USER_NOT_FOUND,
      );
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.service.updateUser(user.id, { password: hashedPassword });
    return sendResponse(
      res,
      STATUS_CODE.SUCCESS,
      userMessage.PASSWORD_RESET_SUCCESS,
    );
  }
  async changePassword(req, res) {
    try {
      const userId = req.user.id;

      const { oldPassword, newPassword } = req.body;

      const user = await this.service.getUserById(userId);

      if (!user) {
        return sendResponse(
          res,
          STATUS_CODE.BAD_REQUEST,
          userMessage.USER_NOT_FOUND,
        );
      }

      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        return sendResponse(
          res,
          STATUS_CODE.BAD_REQUEST,
          userMessage.INCORRECT_PASSWORD,
        );
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await this.service.updateUser(userId, {
        password: hashedPassword,
      });

      return sendResponse(
        res,
        STATUS_CODE.SUCCESS,
        userMessage.CHANGE_PASSWORD,
      );
    } catch (error) {
      return sendResponse(res, STATUS_CODE.SERVER_ERROR, error.message);
    }
  }
  async logout(req, res) {
    const user = req.user;
    const { device_id } = req.body;
    if (!user || !user.id) {
      return sendResponse(res, STATUS_CODE.BAD_REQUEST, authMessage.UN_AUTH);
    }
    await this.service.clearRefreshToken(user.id);
    await this.Models.UserDevices.update(
      {
        is_login: false,
        logout_time: new Date(),
      },
      {
        where: {
          user_id: user.id,
          device_id,
        },
      },
    );
    return sendResponse(res, STATUS_CODE.SUCCESS, userMessage.LOGOUT_SUCCESS);
  }
  async socialLogin(req, res) {
    const { idToken, provider, device_token, device_type, device_id } =
      req.body;
    if (!idToken || !provider) {
      return sendResponse(res, STATUS_CODE.BAD_REQUEST, userMessage.REQUIRED);
    }
    const upperCaseProvider = provider.toUpperCase();
    let email, name, socialId;
    if (upperCaseProvider === "GOOGLE") {
      const targetClientId = process.env.CLIENT_ID_SOCIAL_LOGIN;
      const client = new OAuth2Client(targetClientId);
      const ticket = await client.verifyIdToken({
        idToken: idToken,
        audience: targetClientId,
      });
      const payload = ticket.getPayload();
      email = payload.email;
      name = payload.name || payload.email.split("@")[0];
      socialId = payload.sub;
    } else {
      return sendResponse(
        res,
        STATUS_CODE.BAD_REQUEST,
        userMessage.PROVIDER_NOT_SUPPORT,
      );
    }
    if (!socialId || !email) {
      return sendResponse(
        res,
        STATUS_CODE.BAD_REQUEST,
        userMessage.SOCIAL_AUTH_FAIL,
      );
    }
    const userInDb = await this.service.findCreateSocialUser(
      name,
      email,
      upperCaseProvider,
      socialId,
    );
    if (!userInDb.is_active) {
      return sendResponse(res, STATUS_CODE.BAD_REQUEST, userMessage.DEACTIVATE);
    }
    const accessToken = commanFunction.generateAccessToken(userInDb);
    const refreshToken = commanFunction.generateRefreshToken(userInDb);
    await this.service.updateUser(userInDb.id, { refreshToken });
    if (device_token && device_id) {
      const existingDevice = await this.Models.UserDevices.findOne({
        where: {
          user_id: userInDb.id,
          device_id: device_id,
        },
      });
      if (existingDevice) {
        await existingDevice.update({
          device_token,
          device_type: device_type,
          is_login: true,
          login_time: new Date(),
          logout_time: null,
        });
      } else {
        await this.Models.UserDevices.create({
          user_id: userInDb.id,
          device_token,
          device_type: device_type,
          device_id,
          is_login: true,
          login_time: new Date(),
        });
      }
    }
    const userResponse = userInDb.toJSON ? userInDb.toJSON() : userInDb;
    delete userResponse.password;
    delete userResponse.refreshToken;
    delete userResponse.otp;
    delete userResponse.otp_expire;
    delete userResponse.otp_type;
    delete userResponse.department_Id;
    return sendResponse(
      res,
      STATUS_CODE.SUCCESS,
      userMessage.SOCIAL_LOGIN_SUCEES,
      {
        accessToken,
        refreshToken,
        user: userResponse,
      },
    );
  }

  async sendMobileOtp(req, res) {
    const { phoneNo } = req.body;
    const user = await this.Models.Users.findOne({
      where: { phoneNo },
    });
    console.log("=======================>", user);
    if (!user) {
      return sendResponse(
        res,
        STATUS_CODE.BAD_REQUEST,
        userMessage.USER_NOT_FOUND,
      );
    }
    await sendPhoneOtp(phoneNo);
    return sendResponse(res, STATUS_CODE.SUCCESS, "OTP sent successfully");
  }

  async verifyMobileOtp(req, res) {
    const { phoneNo, otp } = req.body;
    const result = await verifyPhoneOtp(phoneNo, otp);
    if (result.status !== "approved") {
      return sendResponse(res, STATUS_CODE.BAD_REQUEST, "Invalid OTP");
    }
    await this.Models.Users.update(
      { is_verified: true },
      { where: { phoneNo } },
    );
    return sendResponse(res, STATUS_CODE.SUCCESS, "OTP verified successfully");
  }
}
