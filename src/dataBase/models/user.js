import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    address: {
      type: String,
    },
    phoneNo: {
      type: String,
    },
    profile_Img: {
      type: String,
    },
    otp: {
      type: Number,
    },
    refreshToken: {
      type: String,
    },
    role_Id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "roles",
      autopopulate: true,
    },
    department_Id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "departments",
      autopopulate: true,
    },
    is_active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);
userSchema.plugin(require("mongoose-autopopulate"));
const UserModel = mongoose.model("users", userSchema);
export default UserModel;
