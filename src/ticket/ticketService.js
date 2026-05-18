import { Op, where } from "sequelize";
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
  getTicketById = async (id) => {
    return this.Model.TicketModel.findOne({
      where: {
        id: id,
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

    return await this.Model.TicketModel.findAll({
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
}
