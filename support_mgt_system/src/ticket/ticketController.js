import TicketService from "./ticketService.js";
import {
  TICKET_MESSAGE,
  AGENT_MESSAGE,
  authMessage,
} from "../helper/commanMessage.js";
import { sendResponse } from "../helper/responseHandler.js";
import { STATUS_CODE, TICKET_STATUS } from "../helper/statusCode.js";
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
    const customerId = req.user.id;
    const customerName = req.user.name;
    const payload = {
      ...req.body,
      ticket_number: ticketNo,
      customer_Id: customerId,
    };
    const ticket = await this.service.createTicket(payload);
    try {
      const adminIds = await this.service.getSuperAdminIds();
      const adminDevices = await this.service.getUserDeviceTokens(adminIds);
      const title = "New Ticket Created!";
      const body = `${customerName} has created a new ticket #${ticketNo}.`;
      const dataPayload = {
        ticket_id: ticket.id,
        action: "new_ticket",
      };
      adminDevices.forEach((device) => {
        console.log(`Sending notification to User: ${device.user_id} | Token: ${devicedevice_token}`,
        );
        sendPushNotification(
          device.device_token,
          title,
          body,
          dataPayload,
          device.user_id,
        );
      });
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
      status: TICKET_STATUS.CLOSED,
      close_At: new Date(),
    });
    return sendResponse(res, STATUS_CODE.SUCCESS, TICKET_MESSAGE.TICKET_CLOSE);
  }
  async getTicketByCustomer(req, res) {
    const { id } = req.params;
    const result = await this.service.getTicketByCustomer(id, req.query);
    if (!result) {
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
        tickets: result,
      },
    );
  }
  async getAllTickets(req, res) {
    const result = await this.service.getAllTickets(req.query);
    return sendResponse(res, STATUS_CODE.SUCCESS, TICKET_MESSAGE.ALL_TICKET, {
      tickets: result,
    });
  }
  async assignTicket(req, res) {
    const { id } = req.params;
    const { agent_Id, department_Id } = req.body;
    const ticket = await this.service.getTicketByIdWithCustomer(id);
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
      status: TICKET_STATUS.IN_PROGRESS,
    });
    try {
      const dataPayload = { ticket_id: String(id), action: "ticket_assigned" };
      const customerId = ticket.customer_Id || ticket["customer_Id"];
      if (customerId) {
        const customerDevices =
          await this.service.getUserDeviceTokens(customerId);
        if (customerDevices && customerDevices.length > 0) {
          const customerTitle = "Ticket Assigned";
          const customerBody = `Your ticket #${ticket.ticket_number} has been assigned to an agent.`;

          customerDevices.forEach((device) => {
            sendPushNotification(
              device.device_token,
              customerTitle,
              customerBody,
              dataPayload,
              device.user_id,
            );
          });
        }
      }
      if (agent_Id) {
        const agentDevices = await this.service.getUserDeviceTokens(agent_Id);
        if (agentDevices && agentDevices.length > 0) {
          const agentTitle = "New Ticket Assigned To You!";
          const agentBody = `Ticket #${ticket.ticket_number} ("${ticket.title || "No Title"}") has been assigned to you.`;

          agentDevices.forEach((device) => {
            sendPushNotification(
              device.device_token,
              agentTitle,
              agentBody,
              dataPayload,
              device.user_id,
            );
          });
        }
      }
    } catch (err) {
      console.error("Error in sending assignment notifications:", err);
    }
    return sendResponse(res, STATUS_CODE.SUCCESS, TICKET_MESSAGE.TICKET_ASSIGN);
  }
  async getAgentsList(req, res) {
    const agents = await this.service.getAgentsList(req.query || {});
    if (!agents) {
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
    if (!result) {
      return sendResponse(
        res,
        STATUS_CODE.SUCCESS,
        TICKET_MESSAGE.TICKET_NOT_FOUND,
        {
          tickets: result
        },
      );
    }
    return sendResponse(
      res,
      STATUS_CODE.SUCCESS,
      TICKET_MESSAGE.TICKET_FETCHED,
      {
        tickets: result,
      },
    );
  }
  async agentDashboard(req, res) {
    const { agentId } = req.params;
    if (!agentId) {
      return sendResponse(
        res,
        STATUS_CODE.BAD_REQUEST,
        TICKET_MESSAGE.AGENT_ID,
      );
    }
    const dashboard = await this.service.agentDashboard(agentId);
    return sendResponse(
      res,
      STATUS_CODE.SUCCESS,
      TICKET_MESSAGE.AGENT_DASHBOARD,
      { dashboard },
    );
  }

  async getMyNotifications(req, res) {
    if (!req.user.id) {
      return sendResponse(res, STATUS_CODE.BAD_REQUEST, authMessage.UN_AUTH);
    }
    const userId = req.user.id;
    const result = await this.service.getUserNotifications(userId, req.query);
    if (!result) {
      return sendResponse(
        res,
        STATUS_CODE.SUCCESS,
        TICKET_MESSAGE.NOTIFICATION_NOT_FOUND,
        {
          unreadCount: 0,
          result,
        },
      );
    }
    return sendResponse(
      res,
      STATUS_CODE.SUCCESS,
      TICKET_MESSAGE.NOTIFICATION_FETCH,
      {
        unreadCount: result.unreadCount,
        unreadCount: result,
      },
    );
  }

  async markNotificationAsRead(req, res) {
    const { id } = req.params;
    if (!req.user.id) {
      return sendResponse(res, STATUS_CODE.BAD_REQUEST, authMessage.UN_AUTH);
    }
    const userId = req.user.id;
    if (!id) {
      return sendResponse(
        res,
        STATUS_CODE.BAD_REQUEST,
        TICKET_MESSAGE.NOTIFICATION_ID,
      );
    }
    const result = await this.service.markNotificationAsRead(id, userId);
    const updatedRows = Array.isArray(result) ? result[0] : result;
    if (updatedRows === 0) {
      return sendResponse(
        res,
        STATUS_CODE.BAD_REQUEST,
        TICKET_MESSAGE.NOTIFICATION_NOT_FOUND,
      );
    }
    return sendResponse(
      res,
      STATUS_CODE.SUCCESS,
      TICKET_MESSAGE.NOTIFICATION_SUCCESS,
    );
  }

  async toggleMobileNotification(req, res) {
    let { status } = req.body;
    if (req.user.id) {
      return sendResponse(res, STATUS_CODE.BAD_REQUEST, authMessage.UN_AUTH);
    }
    const userId = req.user.id;
    if (status === undefined || status === null || status === "") {
      return sendResponse(
        res,
        STATUS_CODE.BAD_REQUEST,
        TICKET_MESSAGE.STATUS_REQUIRED,
      );
    }
    if (
      status === "true" ||
      status === 1 ||
      status === "1" ||
      status === true
    ) {
      status = true;
    } else if (
      status === "false" ||
      status === 0 ||
      status === "0" ||
      status === false
    ) {
      status = false;
    } else {
      return sendResponse(
        res,
        STATUS_CODE.BAD_REQUEST,
        TICKET_MESSAGE.INVALID_STATUS,
      );
    }
    const result = await this.service.toggleMobileNotification(userId, status);
    if (!result) {
      return sendResponse(
        res,
        STATUS_CODE.BAD_REQUEST,
        TICKET_MESSAGE.NO_USER_FOUND,
      );
    }
    const responseMessage = status
      ? TICKET_MESSAGE.NOTIFICATION_ENABLED
      : TICKET_MESSAGE.NOTIFICATION_DISABLED;
    return sendResponse(res, STATUS_CODE.SUCCESS, responseMessage);
  }
}
