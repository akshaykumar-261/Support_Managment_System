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
  getTicketByCustomer = async (customerId) => {
    return this.Model.TicketModel.findAll({
      where: {
        customer_Id: customerId,
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
  getTicketByAgentId = async (agentId) => {
    return this.Model.TicketModel.findAll({
      where: {
        current_Agent: agentId
      }
    })
  }
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

    if (query.status) {
      where.status = query.status;
    }

    if (query.priority) {
      where.priority = query.priority;
    }

    // ✅ Date filter — ?date=2026-05-28 ya ?date=today
    if (query.date) {
      const inputDate =
        query.date === "today" ? new Date() : new Date(query.date);

      // Us din ka start: 2026-05-28 00:00:00
      const startOfDay = new Date(inputDate);
      startOfDay.setHours(0, 0, 0, 0);

      // Us din ka end: 2026-05-28 23:59:59
      const endOfDay = new Date(inputDate);
      endOfDay.setHours(23, 59, 59, 999);

      where.createdAt = {
        [Op.between]: [startOfDay, endOfDay],
      };
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
    const where = { is_active: true, deletedAt: null };
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
      attributes: ["id", "name", "email", "department_Id", "profile_Img"],
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
  // agar single id hai toh array me convert kar dega
  const ids = Array.isArray(userIds) ? userIds : [userIds];
  const devices = await this.Model.UserDevices.findAll({
    where: {
      user_id: { [Op.in]: ids },
      is_login: true,
      device_token: { [Op.ne]: null }
    },
    attributes: ["device_token"],
    raw: true
  });
  
  return devices.map(d => d.device_token);
}

// Super Admin ki IDs nikalne ke liye method
async getSuperAdminIds() {
  const admins = await this.Model.UserModel.findAll({
    include: [
      {
        model: this.Model.RoleModel,
        where: { name: "Super Admin" },
        attributes: []
      }
    ],
    attributes: ["id"],
    raw: true
  });
  return admins.map(a => a.id);
}
}
