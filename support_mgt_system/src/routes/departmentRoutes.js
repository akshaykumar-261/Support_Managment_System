import express from "express";
import departmentController from "../Department/departmentController.js";
import { asyncHandler } from "../../utility/commanFunction.js";
import DepartmentModel from "../../dataBase/models/department.js";
import authorize from "../middleweare/authmiddleweare.js";

const route = express.Router();
const controller = new departmentController();
controller.init({ models: { DepartmentModel } });

route.get(
  "/getDepartmentList",
  authorize,
  asyncHandler(controller.getDepartmentList.bind(controller)),
);

export default route;
