import mongoose from "mongoose";

const roleSchema = new mongoose.Schema({
    name: {
        type: String,
        default: "customer",
        required: true,
        unique: true,
    }
}, { timestamps: true }
);
const RoleModel = mongoose.model("roles", roleSchema);
export default RoleModel;