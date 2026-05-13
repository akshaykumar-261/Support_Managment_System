import userService from "./userService.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import fs from "fs";
import { authMessage, userMessage } from "../helper/commanMessage.js";
import { sendResponse } from "../helper/responseHandler.js";
import { STATUS_CODE } from "../helper/statusCode.js";
import * as commanFunction from "../../utility/commanFunction.js";
export default class userController {
  async init(db) {
    this.service = new userService();
    this.Models = db.models;
    await this.service.init(db);
  }

  async userCreate(req, res) {
    const { name, email, password, address, phone, role, department } =
      req.body;
    if (!name || !email || !password) {
      return sendResponse(
        res,
        STATUS_CODE.BAD_REQUEST,
        userMessage.REQUIRED_FIELDS,
      );
    }
    const exitingUser = await this.service.getByEmail(email);
    if (exitingUser) {
      if (req.file) {
        commanFunction.deleteFile(req.file.path);
      }
      return sendResponse(res, STATUS_CODE.BAD_REQUEST, userMessage.USER_EXIST);
    }
    const hashPassword = await bcrypt.hash(password, 10);
    let profileImage = null;
    if (req.file) {
      profileImage = req.file.path;
    }
    const user = await this.service.createUser({
      name,
      email,
      password: hashPassword,
      address,
      phone,
      role,
      department,
      profile_Img: profileImage,
    });
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
    const { page = 1, limit = 10, role_id, name, email, is_active } = req.query;
    const offset = (page - 1) * limit;
    const users = await this.service.getUserList({
      offset: Number(offset),
      limit: Number(limit),
      role_id,
      name,
      email,
      is_active,
    });
    return sendResponse(
      res,
      STATUS_CODE.SUCCESS,
      userMessage.USER_FETCHED,
      users,
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
    const { email, password } = req.body;
    const userInDb = await this.service.getByEmail(email);
    if (!userInDb) {
      return sendResponse(
        res,
        STATUS_CODE.BAD_REQUEST,
        userMessage.USER_NOT_FOUND,
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
    const accessToken = jwt.sign(
      {
        id: userInDb.id,
        role_Id: userInDb.role_Id,
        email: userInDb.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "10m" },
    );
    const refreshToken = jwt.sign(
      { id: userInDb.id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" },
    );
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
    if (user.refreshToken !== refreshToken) {
      return sendResponse(
        res,
        STATUS_CODE.BAD_REQUEST,
        userMessage.INVALID_TOKEN,
      );
    }
    const newAccessToken = jwt.sign(
      {
        id: user.id,
        role_Id: user.role_Id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "15m",
      },
    );
    return sendResponse(res, STATUS_CODE.SUCCESS, userMessage.NEW_TOKEN, {
      newAccessToken,
    });
  }
}
