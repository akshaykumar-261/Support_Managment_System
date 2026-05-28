import TicketService from "./ticketService.js";
import {
  TICKET_MESSAGE,
  AGENT_MESSAGE,
  authMessage,
} from "../helper/commanMessage.js";
import { sendResponse } from "../helper/responseHandler.js";
import { STATUS_CODE } from "../helper/statusCode.js";
import * as commanFunction from "../../utility/commanFunction.js";
export default class ticketController {
  async init(db) {
    this.service = new TicketService();
    this.Model = db.models;
    await this.service.init(db);
  }
  async ticketCreate(req, res) {
    const ticketNo = commanFunction.generateTicketNumber();
    if (!req.user || !(req.user.id || req.user.dataValues?.id)) {
      return sendResponse(res, STATUS_CODE.BAD_REQUEST, authMessage.UN_AUTH);
    }

    const customerId = req.user.id || req.user.dataValues?.id;

    const payload = {
      ...req.body,
      ticket_number: ticketNo,
      customer_Id: customerId,
    };

    const ticket = await this.service.createTicket(payload);
    return sendResponse(
      res,
      STATUS_CODE.SUCCESS,
      TICKET_MESSAGE.TICKET_CREATE,
      { ticket },
    );
  }
  async closeTicket(req, res) {
    const { id } = req.body;
    const ticket = await this.service.getTicketById(id);
    if (!ticket) {
      return sendResponse(
        res,
        STATUS_CODE.BAD_REQUEST,
        TICKET_MESSAGE.TICKET_NOT_FOUND,
      );
    }
    if (ticket.customer_Id !== req.user.id) {
      return sendResponse(
        res,
        STATUS_CODE.BAD_REQUEST,
        TICKET_MESSAGE.ACCESS_DENIED,
      );
    }
    await this.service.updateTicket(id, {
      status: "closed",
      close_At: new Date(),
    });
    return sendResponse(res, STATUS_CODE.SUCCESS, TICKET_MESSAGE.TICKET_CLOSE);
  }
  async getTicketByCustomer(req, res) {
    const { id } = req.params;

    const ticket = await this.service.getTicketByCustomer(id);

    if (!ticket || ticket.length === 0) {
      return sendResponse(
        res,
        STATUS_CODE.BAD_REQUEST,
        TICKET_MESSAGE.TICKET_NOT_FOUND,
      );
    }

    return sendResponse(
      res,
      STATUS_CODE.SUCCESS,
      TICKET_MESSAGE.TICKET_FETCHED,
      {
        ticket,
      },
    );
  }
  async getAllTickets(req, res) {
    const result = await this.service.getAllTickets(req.query);
    // result: { count, rows, page, limit }
    const formatted = commanFunction.paginationsResponse({
      count: result.count,
      rows: result.rows,
      page: result.page,
      limit: result.limit,
    });
    return sendResponse(res, STATUS_CODE.SUCCESS, TICKET_MESSAGE.ALL_TICKET, {
      tickets: formatted,
    });
  }
  async assignTicket(req, res) {
    const { id } = req.params;
    const { agent_Id } = req.body;
    const ticket = await this.service.getTicketById(id);
    if (!ticket) {
      return sendResponse(
        res,
        STATUS_CODE.BAD_REQUEST,
        TICKET_MESSAGE.TICKET_NOT_FOUND,
      );
    }
    await this.service.updateTicket(id, {
      current_Agent: agent_Id,
      status: "in_progress",
    });
    return sendResponse(res, STATUS_CODE.SUCCESS, TICKET_MESSAGE.TICKET_ASSIGN);
  }

  async getAgentsList(req, res) {
    const agents = await this.service.getAgentsList(req.query || {});
    if (!agents || agents.length === 0) {
      return sendResponse(
        res,
        STATUS_CODE.SUCCESS,
        AGENT_MESSAGE.AGENTS_LIST_NOT_FOUND,
        { users: [] },
      );
    }
    return sendResponse(
      res,
      STATUS_CODE.SUCCESS,
      AGENT_MESSAGE.AGENTS_LIST_FETCHED,
      { users: agents },
    );
  }
  async dashboard(req, res) {
    const dashboard = await this.service.dashBoard();
    return sendResponse(res, STATUS_CODE.SUCCESS, TICKET_MESSAGE.DASHBOARD, {
      dashboard,
    });
  }
  async updateStatus(req, res) {
    const { id } = req.params;
    const { status } = req.body;
    await this.service.updateTicket(id, {
      status,
    });
    return sendResponse(res, STATUS_CODE.SUCCESS, TICKET_MESSAGE.STATUS);
  }
  async updatePriority(req, res) {
    const { id } = req.params;
    const { priority } = req.body;
    await this.service.updateTicket(id, {
      priority,
    });
    return sendResponse(res, STATUS_CODE.SUCCESS, TICKET_MESSAGE.PRIORITY);
  }
}







































