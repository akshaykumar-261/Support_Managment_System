import express from "express";
import uplaod from "../middleweare/uploadImage.js";
import userController from "../User/userController.js";
import { asyncHandler } from "../../utility/commanFunction.js";
import Users from "../../dataBase/models/user.js";
import Roles from "../../dataBase/models/roles.js";
import Departments from "../../dataBase/models/department.js";
import authorize from "../middleweare/authmiddleweare.js";
import checkRole from "../middleweare/roleBaseMiddleweare.js";
import {
  createUserSchema,
  userUpdateSchema,
  validateRequest,
} from "../User/userValidation.js";
const router = express.Router();
const controller = new userController();
const role = checkRole("Super Admin");
// Initialize controller with DB models so service methods are available
controller.init({ models: { Users, Roles, Departments } });
router.post(
  "/create",
  //authorize,
  //role,
  uplaod.single("profile_Img"),
  validateRequest(createUserSchema),
  asyncHandler(controller.userCreate.bind(controller)),
);
router.put(
  "/update/:id",
  authorize,
  role,
  uplaod.single("profile_Img"),
  validateRequest(userUpdateSchema),
  asyncHandler(controller.userUpdate.bind(controller)),
);
router.delete(
  "/delete/:id",
  role,
  authorize,
  asyncHandler(controller.deleteUser.bind(controller)),
);
router.get(
  "/getUser",
  authorize,
  role,
  asyncHandler(controller.getUserList.bind(controller)),
);
router.post("/login", asyncHandler(controller.login.bind(controller)));
router.post("/refreshToken", asyncHandler(controller.refreshToken.bind(controller)));
router.post("/logout", authorize, asyncHandler(controller.logout.bind(controller)));
export default router;
