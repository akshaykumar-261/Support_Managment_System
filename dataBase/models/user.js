
import { DataTypes } from "sequelize";
import { sequelize } from "../../config/db.js";

const UserModel = sequelize.define(
  "users",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    address: {
      type: DataTypes.STRING,
    },

    phoneNo: {
      type: DataTypes.STRING,
    },

    profile_Img: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    otp: {
      type: DataTypes.INTEGER,
    },

    refreshToken: {
      type: DataTypes.TEXT,
    },

    role_Id: {
      type: DataTypes.INTEGER,
    },

    department_Id: {
      type: DataTypes.INTEGER,
    },

    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },

    default_At: {
      type: DataTypes.DATE,
      defaultValue: null,
    },
  },
  {
    timestamps: true,
  }
);

export default UserModel;