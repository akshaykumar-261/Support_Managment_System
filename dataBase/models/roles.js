import { DataTypes } from "sequelize";
import {sequelize} from "../../config/db.js";

const RoleModel = sequelize.define(
  "roles",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      defaultValue: "customer",
    },
  },
  {
    timestamps: true,
  },
);

export default RoleModel;
