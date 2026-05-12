// Ticket History Model
import { DataTypes } from "sequelize";
import { sequelize } from "../../config/db.js";

const TicketHistoryModel = sequelize.define(
  "ticketHistories",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    ticket_Id: {
      type: DataTypes.INTEGER,
    },

    assign_From: {
      type: DataTypes.INTEGER,
    },

    assign_To: {
      type: DataTypes.INTEGER,
    },

    assign_By: {
      type: DataTypes.INTEGER,
    },
  },
  {
    timestamps: true,
  }
);

export default TicketHistoryModel;