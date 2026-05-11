import mongoose, { mongo } from "mongoose";

const departmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true },
);
const DepartmentModel = mongoose.model("departments", departmentSchema);
export default DepartmentModel;
