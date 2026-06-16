import TicketService from "./ticketService.js";
import {
  TICKET_MESSAGE,
  AGENT_MESSAGE,
  authMessage,
} from "../helper/commanMessage.js";
import { sendResponse } from "../helper/responseHandler.js";
import { STATUS_CODE } from "../helper/statusCode.js";
import * as commanFunction from "../../utility/commanFunction.js";
import { sendPushNotification } from "../helper/notificationFunction.js";
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
  const customerName = req.user.name || req.user.dataValues?.name || "A Customer";

  const payload = {
    ...req.body,
    ticket_number: ticketNo,
    customer_Id: customerId,
  };

  const ticket = await this.service.createTicket(payload);
  try {
    const adminIds = await this.service.getSuperAdminIds();
    
    if (adminIds.length > 0) {
     const adminTokens=  await this.service.getUserDeviceTokens(adminIds);
      
      
      if (adminTokens.length > 0) {
        const title = "New Ticket Created!";
        const body = `${customerName} has created a new ticket #${ticketNo}.`;
        const dataPayload = { ticket_id: String(ticket.id), action: "new_ticket" };

        adminTokens.forEach(token => {
          sendPushNotification(token, title, body, dataPayload);
        });
      }
    }
  } catch (err) {
    console.error("Error in sending admin ticket notification:", err);
  }
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
  const { id } = req.params; // Yeh login customer ki ID hai ya params se jo aa rahi hai

  // Service ko req.query pass karein (jisme page, limit, aur search hoga)
  const result = await this.service.getTicketByCustomer(id, req.query);

  if (!result || result.rows.length === 0) {
    return sendResponse(
      res,
      STATUS_CODE.BAD_REQUEST,
      TICKET_MESSAGE.TICKET_NOT_FOUND,
    );
  }
  const formattedResponse = commanFunction.paginationsResponse({
    count: result.count,
    rows: result.rows,
    page: result.page,
    limit: result.limit,
  });

  return sendResponse(
    res,
    STATUS_CODE.SUCCESS,
    TICKET_MESSAGE.TICKET_FETCHED,
    {
      tickets: formattedResponse,
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
  const { agent_Id, department_Id } = req.body;
  const ticket = await this.service.getTicketByIdWithCustomer(id); 
  console.log("Fetched Ticket Data:===============>", ticket);
  if (!ticket) {
    return sendResponse(
      res,
      STATUS_CODE.BAD_REQUEST,
      TICKET_MESSAGE.TICKET_NOT_FOUND,
    );
  }
  await this.service.updateTicket(id, {
    current_Agent: agent_Id,
    department_Id: department_Id,
    status: "in_progress",
  });

  try {
    const customerId = ticket.customer_Id || ticket["customer_Id"];
    console.log("Extracted Customer ID:===============>", customerId);
    if (customerId) {
      const customerTokens = await this.service.getUserDeviceTokens(customerId);
      console.log("Customer Device Tokens:========================>", customerTokens);
      if (customerTokens && customerTokens.length > 0) {
        const title = "Ticket Assigned";
        const body = `Your ticket #${ticket.ticket_number} has been assigned to an agent`;
        const dataPayload = { ticket_id: String(id), action: "ticket_assigned" };
        
        customerTokens.forEach(token => {
          sendPushNotification(token, title, body, dataPayload);
        });
      }
    }
  } catch (err) {
    console.error("Error in sending customer assignment notification:", err);
  }
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
async getTicketByAgent(req, res) {
    const { id } = req.params;
    const result = await this.service.getTicketByAgentId(id, req.query);
    if (!result || !result.rows || result.rows.length === 0) {
      return sendResponse(
        res,
        STATUS_CODE.SUCCESS,
        TICKET_MESSAGE.TICKET_NOT_FOUND,
        { tickets: commanFunction.paginationsResponse({ count: 0, rows: [], page: 1, limit: 10 }) }
      );
    }

    const formattedResponse = commanFunction.paginationsResponse({
      count: result.count,
      rows: result.rows,
      page: result.page,
      limit: result.limit,
    });

  return sendResponse(
    res,
    STATUS_CODE.SUCCESS,
    TICKET_MESSAGE.TICKET_FETCHED,
    {
      tickets: formattedResponse,
    },
  );
}
async agentDashboard(req, res) {
  const { agentId } = req.params;

  if (!agentId) {
    return sendResponse(
      res,
      STATUS_CODE.BAD_REQUEST,
      "Agent Id is required"
    );
  }

  const dashboard = await this.service.agentDashboard(agentId);

  return sendResponse(
    res,
    STATUS_CODE.SUCCESS,
    "Agent Dashboard Fetched Successfully",
    { dashboard }
  );
}
}







































