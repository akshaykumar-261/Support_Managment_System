import express from "express";
import uplaod from "../middleweare/uploadImage.js";
import userController from "../User/userController.js";
import { asyncHandler } from "../../utility/commanFunction.js";
import Users from "../../dataBase/models/user.js";
import Roles from "../../dataBase/models/roles.js";
import Departments from "../../dataBase/models/department.js";
import UserDevices from "../../dataBase/models/userDevice.js";
import authorize from "../middleweare/authmiddleweare.js";
import checkRole from "../middleweare/roleBaseMiddleweare.js";
import {
  changePasswordValidation,
  createAgentSchema,
  createUserSchema,
  forgotPasswordSchema,
  resendOtpSchema,
  resetPasswordValidation,
  userUpdateSchema,
  validateRequest,
  verifyOtpSchema,
} from "../User/userValidation.js";
const router = express.Router();
const controller = new userController();
const role = checkRole("Super Admin");
// Initialize controller with DB models so service methods are available
controller.init({ models: { Users, Roles, Departments, UserDevices } });
router.post(
  "/create",
  //authorize,
  //role,
  validateRequest(createUserSchema),
  uplaod.single("profile_Img"),
  asyncHandler(controller.userCreate.bind(controller)),
);
router.post(
  "/create-Agent",
  authorize,
  role,
  validateRequest(createAgentSchema),
  uplaod.single("profile_Img"),
  asyncHandler(controller.agentCreate.bind(controller)),
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
  authorize,
  role,
  asyncHandler(controller.deleteUser.bind(controller)),
);
router.get(
  "/getUser",
  authorize,
  role,
  asyncHandler(controller.getUserList.bind(controller)),
);
router.get(
  "/profile",
  authorize,
  checkRole("Super Admin", "Customer", "Agent"),
  asyncHandler(controller.getProfile.bind(controller)),
);
router.post("/login", asyncHandler(controller.login.bind(controller)));
router.post(
  "/refreshToken",
  asyncHandler(controller.refreshToken.bind(controller)),
);
router.post(
  "/logout",
  authorize,
  asyncHandler(controller.logout.bind(controller)),
);
router.post(
  "/forgot-password",
  validateRequest(forgotPasswordSchema),
  asyncHandler(controller.forgotPassword.bind(controller)),
);
router.post(
  "/verify-otp",
  validateRequest(verifyOtpSchema),
  asyncHandler(controller.verifyOtp.bind(controller)),
);
router.post(
  "/resend-otp",
  validateRequest(resendOtpSchema),
  asyncHandler(controller.resendOtp.bind(controller)),
);
router.post(
  "/reset-password",
  validateRequest(resetPasswordValidation),
  asyncHandler(controller.resetPassword.bind(controller)),
);
router.post(
  "/change-password",
  authorize,
  checkRole("Super Admin", "Agent", "Customer"),
  validateRequest(changePasswordValidation),
  asyncHandler(controller.changePassword.bind(controller)),
);
router.post(
  "/createAgent",
  authorize,
  role,
  uplaod.single("profile_Img"),
  validateRequest(createAgentSchema),
  asyncHandler(controller.agentCreate.bind(controller)),
);
export default router;
