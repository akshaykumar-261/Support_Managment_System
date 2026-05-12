// Notification Model
import { DataTypes } from "sequelize";
import { sequelize } from "../../config/db.js";

const NotificationModel = sequelize.define(
  "notifications",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    user_Id: {
      type: DataTypes.INTEGER,
    },

    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  },
);

export default NotificationModel;
