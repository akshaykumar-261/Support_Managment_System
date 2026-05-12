import { DataTypes } from "sequelize";
import { sequelize } from "../../config/db.js";

const TicketMessageModel = sequelize.define(
  "ticketMessages",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    ticket_Id: {
      type: DataTypes.INTEGER,
    },

    sender_Id: {
      type: DataTypes.INTEGER,
    },

    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    attachment_Url: {
      type: DataTypes.STRING,
    },
  },
  {
    timestamps: true,
  }
);
export default TicketMessageModel;