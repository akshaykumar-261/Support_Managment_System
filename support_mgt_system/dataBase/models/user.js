import { DataTypes } from "sequelize";
import { sequelize } from "../../config/db.js";
import bcrypt from "bcrypt";
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
    otp_expire: {
      type: DataTypes.DATE,
    },
    is_verified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    otp_type: {
      type: DataTypes.ENUM("EMAIL_VERIFICATION", "FORGOT_PASSWORD"),
      allowNull: true,
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
    is_mobile_notification_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    deletedAt: {
      type: DataTypes.DATE,
      defaultValue: null,
    },
  },
  {
    timestamps: true,
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      },
    },
  },
);

export default UserModel;
