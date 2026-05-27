import express from "express";
import ticketHistoryController from "../TicketHistory/ticketHistoryController.js";
import { asyncHandler } from "../../utility/commanFunction.js";
import UserModel from "../../dataBase/models/user.js";
import RoleModel from "../../dataBase/models/roles.js";
import TicketHistoryModel from "../../dataBase/models/ticketHistory.js";
import TicketModel from "../../dataBase/models/ticket.js";
import authorize from "../middleweare/authmiddleweare.js";
import checkRole from "../middleweare/roleBaseMiddleweare.js";
import DepartmentModel from "../../dataBase/models/department.js";
import {
  reAssignSchema,
  updateHistorySchema,
  validateRequest,
} from "../TicketHistory/ticketHistoryValidation.js";
import { reAssignSchemaValidated } from "../TicketHistory/ticketHistoryValidation.js";
import {
  validateParams,
  idParamSchema,
  agentIdParamSchema,
} from "../TicketHistory/ticketHistoryValidation.js";
import { ticketIdParamSchema } from "../TicketHistory/ticketHistoryValidation.js";

const route = express.Router();
const role = checkRole("Super Admin");
const controller = new ticketHistoryController();
controller.init({
  models: { UserModel, RoleModel,DepartmentModel ,TicketHistoryModel, TicketModel },
});
route.post(
  "/reAssignTicket", // assign ticket to another agent
  authorize,
  role,
  validateRequest(reAssignSchemaValidated),
  asyncHandler(controller.reAssignTicket.bind(controller)),
);
route.put(
  "/updateTicketHistory/:id", // update to assign ticket
  authorize,
  role,
  validateParams(ticketIdParamSchema),
  validateRequest(updateHistorySchema),
  asyncHandler(controller.updateTicketHistory.bind(controller)),
);
route.get(
  "/getTicketHistoryList/:id", // get  ticket's  details  
  authorize,
  role,
  asyncHandler(controller.getTicketHistory.bind(controller)),
);
route.get(
  "/getTicketList", 
  authorize,
  checkRole("Super Admin","Agent"),
  asyncHandler(controller.getTicketList.bind(controller)),
);
route.delete(
  "/deleteHistory/:id", // delete ticket history
  authorize,
  role,
  validateParams(idParamSchema),
  asyncHandler(controller.deleteHistory.bind(controller)),
);
route.get(
  "/getAgentHistory/:agentId", // get ticket by using agent_Id
  authorize,
  checkRole("Super Admin", "Agent"),
  validateParams(agentIdParamSchema),
  asyncHandler(controller.getAgentHistory.bind(controller)),
);
export default route;
