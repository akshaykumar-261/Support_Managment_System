// Ticket Model
import { DataTypes } from "sequelize";
import { sequelize } from "../../config/db.js";

const TicketModel = sequelize.define(
  "tickets",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    ticket_number: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    status: {
      type: DataTypes.ENUM("open", "in_progress", "closed"),
      defaultValue: "open",
    },

    priority: {
      type: DataTypes.ENUM("low", "medium", "high"),
      defaultValue: "low",
    },

    department_Id: {
      type: DataTypes.INTEGER,
    },

    current_Agent: {
      type: DataTypes.INTEGER,
    },
    customer_Id: {
      type: DataTypes.INTEGER,
    },
    resolve_At: {
      type: DataTypes.DATE,
    },

    close_At: {
      type: DataTypes.DATE,
    },
  },
  {
    timestamps: true,
  },
);

export default TicketModel;
