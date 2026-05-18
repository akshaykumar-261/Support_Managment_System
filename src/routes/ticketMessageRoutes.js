import express from "express";
import ticketMessageController from "../TicketMessage/ticketMessageController.js";
import { asyncHandler } from "../../utility/commanFunction.js";
import UserModel from "../../dataBase/models/user.js";
import RoleModel from "../../dataBase/models/roles.js";
import TicketMessageModel from "../../dataBase/models/ticketMessage.js";
import TicketModel from "../../dataBase/models/ticket.js";
import authorize from "../middleweare/authmiddleweare.js";
import checkRole from "../middleweare/roleBaseMiddleweare.js";
import {
  createMessageSchema,
  updateMessageSchema,
  validateRequest,
} from "../TicketMessage/ticketMessageValidation.js";
import {
  validateParams,
  idParamSchema,
  ticketIdParamSchema,
} from "../TicketHistory/ticketHistoryValidation.js";

const route = express.Router();
const controller = new ticketMessageController();
controller.init({
  models: { UserModel, RoleModel, TicketMessageModel, TicketModel },
});

route.post(
  "/sendMessage/:ticket_Id",
  authorize,
  checkRole("Customer", "Agent","Super Admin"),
  validateRequest(createMessageSchema),
  asyncHandler(controller.createMessage.bind(controller)),
);

route.get(
  "/getMessages/:ticket_Id",
  authorize,
  checkRole("Customer", "Agent", "Super Admin"),
  validateParams(ticketIdParamSchema),
  asyncHandler(controller.getMessagesByTicket.bind(controller)),
);

route.get(
  "/getMessage/:id",
  authorize,
  checkRole("Customer", "Agent", "Super Admin"),
  validateParams(idParamSchema),
  asyncHandler(controller.getSingleMessage.bind(controller)),
);

route.delete(
  "/deleteMessage/:id",
  authorize,
  checkRole("Super Admin"),
  validateParams(idParamSchema),
  asyncHandler(controller.deleteMessage.bind(controller)),
);

export default route;
