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
    const user = await this.service.createUser({
      ...req.body,
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
    const { page = 1, limit = 10, role, name, email, is_active } = req.query;
    const pagignation = commanFunction.getPagination(page, limit);
    const users = await this.service.getUserList({
      offset: pagignation.offset,
      limit: pagignation.limit,
      role,
      name,
      email,
      is_active,
    });
    const response = commanFunction.paginationsResponse({
      count: users.count,
      rows: users.rows,
      page: pagignation.page,
      limit: pagignation.limit,
    });
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
    const accessToken = commanFunction.generateAccessToken(userInDb);
    const refreshToken = commanFunction.generateRefreshToken(userInDb);
    await this.service.updateUser(userInDb.id, {
      refreshToken,
    });
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
    const newAccessToken = commanFunction.generateAccessToken(user);
    return sendResponse(res, STATUS_CODE.SUCCESS, userMessage.NEW_TOKEN, {
      newAccessToken,
    });
  }
  async logout(req, res) {
    try {
      const user = req.user;
      if (!user || !user.id) {
        return sendResponse(res, STATUS_CODE.BAD_REQUEST, authMessage.UN_AUTH);
      }
      await this.service.clearRefreshToken(user.id);
      return sendResponse(res, STATUS_CODE.SUCCESS, userMessage.LOGOUT_SUCCESS);
    } catch (error) {
      return sendResponse(res, STATUS_CODE.SERVER_ERROR, authMessage.INVALID);
    }
  }
}
