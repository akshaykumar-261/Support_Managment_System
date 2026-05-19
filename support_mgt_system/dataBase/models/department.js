import { DataTypes } from "sequelize";
import { sequelize } from "../../config/db.js";
const DepartmentModel = sequelize.define(
  "departments",
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
    },
  },
  {
    timestamps: true,
  },
);

export default DepartmentModel;
