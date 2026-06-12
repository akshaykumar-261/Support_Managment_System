import express from "express";
import ticketController from "../ticket/ticketController.js";
import { asyncHandler } from "../../utility/commanFunction.js";
import UserModel from "../../dataBase/models/user.js";
import RoleModel from "../../dataBase/models/roles.js";
import TicketModel from "../../dataBase/models/ticket.js";
import DepartmentModel from "../../dataBase/models/department.js";
import UserDevices from "../../dataBase/models/userDevice.js";
import authorize from "../middleweare/authmiddleweare.js";
import checkRole from "../middleweare/roleBaseMiddleweare.js";
import {
  createTicketSchema,
  prioritySchema,
  updateStatusSchema,
  validateRequest,
} from "../ticket/ticketValidation.js";
import router from "./userRoutes.js";
const route = express.Router();
const controller = new ticketController();
const role = checkRole("Customer");
controller.init({
  models: { UserModel, RoleModel, TicketModel, DepartmentModel,UserDevices },
});
route.post(
  "/createTicket",
  authorize,
  role,
  validateRequest(createTicketSchema),
  asyncHandler(controller.ticketCreate.bind(controller)),
);
route.post(
  "/closeTicket",
  authorize,
  role,
  asyncHandler(controller.closeTicket.bind(controller)),
);
route.get(
  "/getTicketByCustomer/:id",
  authorize,
  role,
  asyncHandler(controller.getTicketByCustomer.bind(controller)),
);
route.get(
  "/getTicketListByAdmin",
  authorize,
  checkRole("Super Admin","Agent"),
  asyncHandler(controller.getAllTickets.bind(controller)),
);
route.post(
  "/assignTicket/:id",
  authorize,
  checkRole("Super Admin"),
  asyncHandler(controller.assignTicket.bind(controller)),
);
route.get(
  "/adminDashBoard",
 authorize,
  checkRole("Super Admin"),
  asyncHandler(controller.dashboard.bind(controller)),
);
route.get(
  "/getAgentsList",
  authorize,
  checkRole("Super Admin","Agent"),
  asyncHandler(controller.getAgentsList.bind(controller)),
);
route.get("/agentDashBoard/:agentId",
  asyncHandler(controller.agentDashboard.bind(controller)),
);
route.put(
  "/updateTicketPriority/:id",
  authorize,
  checkRole("Super Admin", "Agent"),
  validateRequest(prioritySchema),
  asyncHandler(controller.updatePriority.bind(controller)),
);
route.put(
  "/updateTicketStatus/:id",
  authorize,
  checkRole("Super Admin", "Agent"),
  validateRequest(updateStatusSchema),
  asyncHandler(controller.updateStatus.bind(controller)),
);
route.get("/getTicketByAgent/:id", asyncHandler(controller.getTicketByAgent.bind(controller)));
export default route;
