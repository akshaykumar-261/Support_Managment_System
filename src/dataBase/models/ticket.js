import mongoose, { mongo } from "mongoose";
const ticketSchema = new mongoose.Schema({
    ticket_number: {
        type: String,
        required: true,
        unique: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ["open", "in_progress", "closed"],
        default: "open",
    },
    priority: {
        type: String,
        enum: ["low", "medium", "high"],
        default: "low",  
    },
    department_Id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "departments",
        autopopulate: true,
    },
    current_Agent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        autopopulate: true,
    },
    resolve_At: {
        type: Date,
    },
    close_At: {
        type: Date,
    },}
, { timestamps: true });

ticketSchema.plugin(require("mongoose-autopopulate"));
const Ticket = mongoose.model("tickets", ticketSchema);
export default Ticket;