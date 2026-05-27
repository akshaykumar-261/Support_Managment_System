import TicketHistoryService from "./ticketHistoryService.js";
import { TICKET_MESSAGE } from "../helper/commanMessage.js";
import { sendResponse } from "../helper/responseHandler.js";
import { STATUS_CODE } from "../helper/statusCode.js";
import * as commanFunction from "../../utility/commanFunction.js";
export default class ticketController {
  async init(db) {
    this.service = new TicketHistoryService();
    this.Model = db.models;
    await this.service.init(db);
  }
  // Reassign Ticket
  async reAssignTicket(req, res) {
    const { ticket_Id, ticket_number } = req.body;
    let ticket = null;
    if (ticket_number) {
      ticket = await this.Model.TicketModel.findOne({
        where: { ticket_number: ticket_number },
      });
    } else if (ticket_Id) {
      const asNumber = Number(ticket_Id);
      if (!Number.isNaN(asNumber) && String(asNumber) === String(ticket_Id)) {
        // numeric id provided
        ticket = await this.Model.TicketModel.findByPk(asNumber);
      } else {
        // treat ticket_Id as a ticket_number string
        ticket = await this.Model.TicketModel.findOne({
          where: { ticket_number: ticket_Id },
        });
      }
    }
    if (!ticket) {
      return sendResponse(
        res,
        STATUS_CODE.BAD_REQUEST,
        TICKET_MESSAGE.TICKET_NOT_FOUND,
      );
    }
    // ensure ticket_Id numeric is passed to history record
    const payload = { ...req.body, ticket_Id: ticket.id };
    // coerce numeric-like strings to numbers for numeric fields
    [
      "assign_By",
      "assign_To",
      "assign_From",
      "from_Department",
      "to_Department",
    ].forEach((key) => {
      if (payload[key] !== undefined && payload[key] !== null) {
        const n = Number(payload[key]);
        if (!Number.isNaN(n)) payload[key] = n;
      }
    });
    const assign = await this.service.reAssignTicket(payload);
    return sendResponse(
      res,
      STATUS_CODE.SUCCESS,
      TICKET_MESSAGE.RE_ASSIGN_TICKET_ASSIGN,
      { assign },
    );
  }
  async updateTicketHistory(req, res) {
    const { id } = req.params;
    const history = await this.service.getTicketById(id);
    if (!history) {
      return sendResponse(
        res,
        STATUS_CODE.BAD_REQUEST,
        TICKET_MESSAGE.HISTORY_NOT_FOUND,
      );
    }
    await this.service.updateTicketHistory(id, req.body);
    const updatedHistory = await this.service.getTicketById(id);
    return sendResponse(
      res,
      STATUS_CODE.SUCCESS,
      TICKET_MESSAGE.UPDATE_TICKET_HISTORY,
      { updatedHistory },
    );
  }
  async getTicketHistory(req, res) {
    const { ticket_Id } = req.params;
    const ticketId = await this.service.getTicketTimeline(ticket_Id);
    if (!ticketId) {
      return sendResponse(
        res,
        STATUS_CODE.BAD_REQUEST,
        TICKET_MESSAGE.TICKET_NOT_FOUND,
      );
    }
    const history = await this.service.getTicketTimeline(ticket_Id);
    return sendResponse(
      res,
      STATUS_CODE.SUCCESS,
      TICKET_MESSAGE.TICKET_HISTORY_FETCHED,
      { ticketId },
    );
  }
  async getTicketList(req, res) {
    const history = await this.service.getTicketList();
    if (!history) {
      return sendResponse(
        res,
        STATUS_CODE.BAD_REQUEST,
        TICKET_MESSAGE.ALL_TICKET,
      );
    }
    return sendResponse(
      res,
      STATUS_CODE.SUCCESS,
      TICKET_MESSAGE.TICKET_HISTORY_FETCHED,
      { history },
    );
  }
  async deleteHistory(req, res) {
    const { id } = req.params;
    const history = await this.service.getTicketById(id);
    if (!history) {
      return sendResponse(
        res,
        STATUS_CODE.BAD_REQUEST,
        TICKET_MESSAGE.HISTORY_NOT_FOUND,
      );
    }
    await this.service.deleteHistory(id);
    return sendResponse(
      res,
      STATUS_CODE.SUCCESS,
      TICKET_MESSAGE.DELETE_TICKET_HISTORY,
    );
  }
  async getAgentHistory(req, res) {
    const { agentId } = req.params;
    const history = await this.service.getAgentHistory(agentId);
    return sendResponse(
      res,
      STATUS_CODE.SUCCESS,
      TICKET_MESSAGE.AGENT_HISTORY,
      { history },
    );
  }
}
