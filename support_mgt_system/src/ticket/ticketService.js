import { Op, where } from "sequelize";
import { getPagination } from "../../utility/commanFunction.js";
export default class TicketService {
  async init(db) {
    this.Model = db.models;
  }
  getByEmail = async (email) => {
    if (!email) return null;
    return await this.Model.UserModel.findOne({
      where: {
        email: email.toLowerCase().trim(),
      },
    });
  };
  getTicketByPk = async (id) => {
    if (!id) return null;
    return await this.Model.TicketModel.findOne({
      where: {
        id: id,
      },
      raw: true,
    });
  };
  getByTicketNumber = async (ticket_number) => {
    if (!ticket_number) return null;
    return await this.Model.TicketModel.findOne({
      where: {
        ticket_number: ticket_number.trim(),
        deletedAt: null,
      },
      raw: true,
    });
  };

  getTicketByIdWithCustomer = async (ticketId) => {
    if (!ticketId) return null;
    return await this.Model.TicketModel.findOne({
      where: {
        id: ticketId,
      },
      include: [
        {
          model: this.Model.UserModel,
          as: "customer",
          attributes: ["id", "name", "email"],
        },
      ],
      raw: true,
    });
  };
  getTicketByCustomer = async (customerId, query = {}) => {
    if (!customerId) return null;
    const whereCondition = {
      customer_Id: customerId,
    };

    if (query.search) {
      whereCondition[Op.or] = [
        { title: { [Op.substring]: query.search.trim() } },
        { ticket_number: { [Op.substring]: query.search.trim() } },
        { description: { [Op.substring]: query.search.trim() } },
        { status: { [Op.substring]: query.search.trim() } },
        { priority: { [Op.substring]: query.search.trim() } },
      ];
    }

    // 2. Pagination Setup (Using your existing getPagination helper)
    const { page, limit, offset } = getPagination(query.page, query.limit);
    const result = await this.Model.TicketModel.findAndCountAll({
      where: whereCondition,
      order: [["id", "DESC"]],
      limit,
      offset,
      raw: true,
      attributes: {
        exclude: [
          "close_At",
          "department_Id",
          "current_Agent",
          "customer_Id",
          "resolve_At",
          "createdAt",
          "updatedAt",
        ],
      },
    });

    // Controller ke paginationsResponse function ke liye format return karein
    return {
      count: result.count,
      rows: result.rows,
      page,
      limit,
    };
  };
  getTicketByAgentId = async (agentId, query = {}) => {
    if (!agentId) return null;
    const whereCondition = {
      current_Agent: agentId,
    };
    if (query.search) {
      const searchKeyword = query.search.trim();
      whereCondition[Op.or] = [
        { title: { [Op.substring]: searchKeyword } },
        { ticket_number: { [Op.substring]: searchKeyword } },
        { description: { [Op.substring]: searchKeyword } },
        { status: { [Op.substring]: searchKeyword } },
        { priority: { [Op.substring]: searchKeyword } },
      ];
    }
    const { page, limit, offset } = getPagination(query.page, query.limit);
    const result = await this.Model.TicketModel.findAndCountAll({
      where: whereCondition,
      include: [
        {
          model: this.Model.UserModel,
          as: "customer",
          attributes: ["id", "name", "email"],
        },
      ],
      order: [["id", "DESC"]],
      limit,
      offset,
    });
    return {
      count: result.count,
      rows: result.rows,
      page,
      limit,
    };
  };
  async createTicket(payload) {
    const ticket = await this.Model.TicketModel.create(payload);
    return ticket;
  }
  updateTicket = async (id, payload) => {
    return this.Model.TicketModel.update(payload, { where: { id: id } });
  };
  async deleteTicketById(id) {
    const payload = { deletedAt: new Date() };
    return this.Model.TicketModel.update(payload, { where: { id: id } });
  }
  async getAllTickets(query) {
    const where = {};
    const customerWhere = {};
    if (query.status) {
      where.status = query.status;
    }

    if (query.priority) {
      where.priority = query.priority;
    }
    if (query.search) {
      const searchKeyword = query.search.trim();
      where[Op.or] = [
        { title: { [Op.substring]: searchKeyword } },
        { ticket_number: { [Op.substring]: searchKeyword } },
        { description: { [Op.substring]: searchKeyword } },
        { status: { [Op.substring]: searchKeyword } },
        { priority: { [Op.substring]: searchKeyword } },
      ];
      customerWhere[Op.or] = [
        { name: { [Op.substring]: searchKeyword } },
        { email: { [Op.substring]: searchKeyword } },
      ];
    }
    const { page, limit, offset } = getPagination(query.page, query.limit);

    const result = await this.Model.TicketModel.findAndCountAll({
      where,
      include: [
        {
          model: this.Model.UserModel,
          as: "customer",
          attributes: ["id", "name", "email"],
        },
        {
          model: this.Model.UserModel,
          as: "agent",
          attributes: ["id", "name"],
        },
      ],
      order: [["id", "DESC"]],
      limit,
      offset,
    });
    return { count: result.count, rows: result.rows, page, limit };
  }
  async getAgentsList(filter = {}) {
    const where = { is_active: true, is_verified: true, deletedAt: null };
    // allow optional department filter
    if (filter.department_Id) {
      where.department_Id = filter.department_Id;
    }
    return await this.Model.UserModel.findAll({
      where,
      include: [
        {
          model: this.Model.RoleModel,
          where: { name: "Agent" },
          attributes: ["id", "name"],
        },
      ],
      attributes: [
        "id",
        "name",
        "email",
        "department_Id",
        "profile_Img",
        "is_verified",
      ],
      order: [["id", "DESC"]],
    });
  }
  async dashBoard() {
    const totalTicket = await this.Model.TicketModel.count();
    const openTickets = await this.Model.TicketModel.count({
      where: {
        status: "open",
      },
    });
    const closeTickets = await this.Model.TicketModel.count({
      where: {
        status: "closed",
      },
    });
    const inProgressTickets = await this.Model.TicketModel.count({
      where: {
        status: "in_progress",
      },
    });
    return {
      totalTicket,
      openTickets,
      closeTickets,
      inProgressTickets,
    };
  }

    async getUserDeviceTokens(userIds) {
    const ids = Array.isArray(userIds) ? userIds : [userIds];
    const devices = await this.Model.UserDevices.findAll({
      where: {
        user_id: { [Op.in]: ids },
        is_login: true,
        device_token: { [Op.ne]: null },
      },
      include: [
        {
          model: this.Model.UserModel,
          as: "user",
          attributes: ["is_mobile_notification_active"],
        },
      ],
      attributes: ["user_id", "device_token", "device_type"],
      raw: true,
      nest: true,
    });
    const filteredDevices = devices.filter((device) => {
      const isNotiActive =
        device.user?.is_mobile_notification_active ??
        device["user.is_mobile_notification_active"];
      if (
        isNotiActive === false ||
        isNotiActive === 0 ||
        isNotiActive === "0"
      ) {
        console.log(
          `Notification BLOCKED for User ID: ${device.user_id} because setting is OFF.`,
        );
        return false;
      }
      return true;
    });
    return filteredDevices;
  }
  async toggleMobileNotification(userId, status) {
    if (!userId) return null;
    return await this.Model.UserModel.update(
      { is_mobile_notification_active: status },
      {
        where: {
          id: userId,
        },
      },
    );
  }
  async getSuperAdminIds() {
    const admins = await this.Model.UserModel.findAll({
      include: [
        {
          model: this.Model.RoleModel,
          where: { id: 1 },
          attributes: [],
        },
      ],
      attributes: ["id"],
      raw: true,
    });
    return admins.map((a) => a.id);
  }

  async agentDashboard(agentId) {
    const totalTicket = await this.Model.TicketModel.count({
      where: {
        current_Agent: agentId,
      },
    });

    const openTickets = await this.Model.TicketModel.count({
      where: {
        current_Agent: agentId,
        status: "open",
      },
    });

    const closeTickets = await this.Model.TicketModel.count({
      where: {
        current_Agent: agentId,
        status: "closed",
      },
    });

    const inProgressTickets = await this.Model.TicketModel.count({
      where: {
        current_Agent: agentId,
        status: "in_progress",
      },
    });

    return {
      totalTicket,
      openTickets,
      closeTickets,
      inProgressTickets,
    };
  }

  async getUserNotifications(userId, query = {}) {
    if (!userId) return null;
    const { page, limit, offset } = getPagination(query.page, query.limit);
    const result = await this.Model.NotificationModel.findAndCountAll({
      where: {
        user_id: userId,
      },
      order: [["id", "DESC"]],
      limit,
      offset,
      raw: true,
    });
    const unreadCount = await this.Model.NotificationModel.count({
      where: {
        user_id: userId,
        is_read: 0,
      },
    });
    return {
      count: result.count,
      unreadCount: unreadCount,
      rows: result.rows,
      page,
      limit,
    };
  }
  async markNotificationAsRead(notificationId, userId) {
    if (!notificationId || !userId) return null;
    return await this.Model.NotificationModel.update(
      { is_read: 1 },
      {
        where: {
          id: notificationId,
          user_id: userId,
        },
      },
    );
  }
}
