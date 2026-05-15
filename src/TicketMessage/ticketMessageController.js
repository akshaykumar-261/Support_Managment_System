import TicketMessageService from "./ticketMessageService.js";
import { TICKET_MESSAGE } from "../helper/commanMessage.js";
import { sendResponse } from "../helper/responseHandler.js";
import { STATUS_CODE } from "../helper/statusCode.js";
import * as commanFunction from "../../utility/commanFunction.js";

export default class ticketMessageController {
  async init(db) {
    this.service = new TicketMessageService();
    this.Model = db.models;
    await this.service.init(db);
  }

  async createMessage(req, res) {
    const { ticket_Id } = req.body;
    const ticket = await this.Model.TicketModel.findByPk(ticket_Id);
    if (!ticket) {
      return sendResponse(
        res,
        STATUS_CODE.BAD_REQUEST,
        TICKET_MESSAGE.TICKET_NOT_FOUND,
      );
    }
    const payload = {
      ...req.body,
      sender_Id: req.user
    };
    const message = await this.service.createMessage(payload);
    return sendResponse(
      res,
      STATUS_CODE.CREATED,
      TICKET_MESSAGE.MESSAGE_CREATED,
      { message },
    );
  }

  async getMessagesByTicket(req, res) {
    const { ticket_Id } = req.params;
    const messages = await this.service.getMessagesByTicket(ticket_Id);
    return sendResponse(
      res,
      STATUS_CODE.SUCCESS,
      TICKET_MESSAGE.MESSAGE_FETCHED,
      { messages },
    );
  }

  async getSingleMessage(req, res) {
    const { id } = req.params;
    const message = await this.service.getMessageById(id);
    if (!message)
      return sendResponse(
        res,
        STATUS_CODE.BAD_REQUEST,
        TICKET_MESSAGE.MESSAGE_NOT_FOUND,
      );
    return sendResponse(
      res,
      STATUS_CODE.SUCCESS,
      TICKET_MESSAGE.MESSAGE_FETCHED,
      { message },
    );
  }

  async deleteMessage(req, res) {
    const { id } = req.params;
    const message = await this.service.getMessageById(id);
    if (!message)
      return sendResponse(
        res,
        STATUS_CODE.BAD_REQUEST,
        TICKET_MESSAGE.MESSAGE_NOT_FOUND,
      );
    await this.service.deleteMessage(id);
    return sendResponse(
      res,
      STATUS_CODE.SUCCESS,
      TICKET_MESSAGE.MESSAGE_DELETED,
    );
  }
}
