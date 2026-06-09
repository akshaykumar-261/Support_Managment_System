import { DataTypes } from "sequelize";
import { sequelize } from "../../config/db.js";

const UserDeviceModel = sequelize.define(
  "user_devices",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    device_id: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    device_token: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    device_type: {
      type: DataTypes.SMALLINT,
      allowNull: true,
      defaultValue: 1,
      comment: "1 = android, 2 = ios, 3 = web",
    },

    is_login: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },

    login_time: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },

    logout_time: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    timestamps: true,
  }
);

export default UserDeviceModel;