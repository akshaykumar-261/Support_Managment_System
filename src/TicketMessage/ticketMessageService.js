export default class TicketMessageService {
  async init(db) {
    this.Model = db.models;
  }

  async createMessage(payload) {
    return await this.Model.TicketMessageModel.create(payload);
  }

  async getMessagesByTicket(ticket_Id) {
    return await this.Model.TicketMessageModel.findAll({
      where: { ticket_Id },
      include: [
        {
          model: this.Model.UserModel,
          attributes: ["id", "name", "email"],
        },
      ],
      order: [["createdAt", "ASC"]],
    });
  }

  getMessageById = async (id) => {
    return this.Model.TicketMessageModel.findOne({ where: { id } });
  };

  deleteMessage = async (id) => {
    return await this.Model.TicketMessageModel.destroy({ where: { id } });
  };
}
