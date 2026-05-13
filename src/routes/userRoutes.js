import express from "express";
import uplaod from "../middleweare/uploadImage.js";
import userController from "../User/userController.js";
import { asyncHandler } from "../../utility/commanFunction.js";
import Users from "../../dataBase/models/user.js";
import Roles from "../../dataBase/models/roles.js";
import Departments from "../../dataBase/models/department.js";
import { createUserSchema, userUpdateSchema, validateRequest } from "../User/userValidation.js";
const router = express.Router();
const controller = new userController();

// Initialize controller with DB models so service methods are available
controller.init({ models: { Users, Roles, Departments } });
router.post(
    "/create",
    uplaod.single("profile_Img"),
    validateRequest(createUserSchema),
  asyncHandler(controller.userCreate.bind(controller)),
);
router.put(
  "/update/:id",
   uplaod.single("profile_Img"),
  validateRequest(userUpdateSchema),
  asyncHandler(controller.userUpdate.bind(controller)),
);
export default router;
