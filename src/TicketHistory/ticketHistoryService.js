import { model } from "mongoose";

export default class TicketHistoryService {
  async init(db) {
    this.Model = db.models;
  }
  async reAssignTicket(payload) {
    return await this.Model.TicketHistoryModel.create(payload);
  }
  updateTicketHistory = async (id, payload) => {
    return this.Model.TicketHistoryModel.update(payload, {
      where: { id: id },
    });
  };
  getTicketById = async (id) => {
    return this.Model.TicketHistoryModel.findOne({
      where: {
        id: id,
      },
    });
  };
  deleteHistory = async (id) => {
    return await this.Model.TicketHistoryModel.destroy({
      where: {
        id,
      },
    });
  };
  getTicketList = async () => {
    return await this.Model.TicketHistoryModel.findAll({
      include: [
        {
          model: this.Model.UserModel,
          as: "assignFrom",
          attributes: ["id", "name", "email"],
        },
        {
          model: this.Model.UserModel,
          as: "assignTo",
          attributes: ["id", "name", "email"],
        },
        {
          model: this.Model.UserModel,
          as: "assignBy",
          attributes: ["id", "name", "email"],
        },
        {
          model: this.Model.DepartmentModel,
          as: "fromDepartment",
          attributes: ["id", "name"],
        },
        {
          model: this.Model.DepartmentModel,
          as: "toDepartment",
          attributes: ["id", "name"],
        },
      ],
    });
  };
  getAgentHistory = async (agentId) => {
    return await this.Model.TicketHistoryModel.findAll({
      where: {
        assign_To: agentId,
      },
      include: [
        {
          model: this.Model.TicketModel,
        },
        {
          model: this.Model.DepartmentModel,
          as: "toDepartment",
          attributes: ["id", "name"],
        },
      ],

      order: [["createdAt", "DESC"]],
    });
  };

  getTicketTimeline = async (ticket_Id) => {
    const check = {};
    check.ticket_Id = ticket_Id;
    const histories = await this.Model.TicketHistoryModel.findAll({
      check,
      include: [
        {
          model: this.Model.UserModel,
          as: "assignFrom",
          attributes: ["id", "name", "email"],
        },
        {
          model: this.Model.UserModel,
          as: "assignTo",
          attributes: ["id", "name", "email", "department_Id"],
        },
        {
          model: this.Model.UserModel,
          as: "assignBy",
          attributes: ["id", "name", "email"],
        },
        {
          model: this.Model.DepartmentModel,
          as: "fromDepartment",
          attributes: ["id", "name"],
        },
        {
          model: this.Model.DepartmentModel,
          as: "toDepartment",
          attributes: ["id", "name"],
        },
      ],
      order: [["createdAt", "ASC"]],
    });

    // Map histories into structured timeline events
    const timeline = histories.map((h) => {
      const event = {
        type: h.action,
        at: h.createdAt,
        assignFrom: h.assignFrom || null,
        assignTo: h.assignTo || null,
        assignBy: h.assignBy || null,
        old_Status: h.old_Status || null,
        new_Status: h.new_Status || null,
        old_Priority: h.old_Priority || null,
        action_By: h.action_By || null,
        from_Department: h.fromDepartment || null,
        to_Department: h.toDepartment || null,
        raw: h,
      };
      return event;
    });
    return timeline;
  };
}
