import DepartmentService from "./departmentService.js";
import { DEPARTMENT_MESSAGE } from "../helper/commanMessage.js";
import { sendResponse } from "../helper/responseHandler.js";
import { STATUS_CODE } from "../helper/statusCode.js";

export default class departmentController {
  async init(db) {
    this.service = new DepartmentService();
    this.Model = db.models;
    await this.service.init(db);
  }

  async getDepartmentList(req, res) {
    const departments = await this.service.getDepartmentList(req.query || {});
    if (!departments || departments.length === 0) {
      return sendResponse(
        res,
        STATUS_CODE.SUCCESS,
        DEPARTMENT_MESSAGE.DEPARTMENTS_NOT_FOUND,
        { departments: [] },
      );
    }
    return sendResponse(
      res,
      STATUS_CODE.SUCCESS,
      DEPARTMENT_MESSAGE.DEPARTMENTS_FETCHED,
      { departments },
    );
  }
}
