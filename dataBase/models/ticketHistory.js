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
    action: {
      type: DataTypes.ENUM(
        "created",
        "assigned",
        "reassigned",
        "status_changed",
        "priority_changed",
        "resolved",
        "closed",
        "reopened",
      ),
      allowNull: false,
    },
    new_Status: {
      type: DataTypes.STRING,
    },
    new_Status: {
      type: DataTypes.STRING,
    },
    old_Priority: {
      type: DataTypes.STRING,
    },
    new_Priority: {
      type: DataTypes.STRING,
    },
    from_Department: {
      type: DataTypes.INTEGER,
    },
    to_Department: {
      type: DataTypes.INTEGER,
    },
  },
  {
    timestamps: true,
  },
);
export default TicketHistoryModel;
