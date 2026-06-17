import UserModel from "../dataBase/models/user.js";
import RoleModel from "../dataBase/models/roles.js";
import DepartmentModel from "../dataBase/models/department.js";
import TicketModel from "../dataBase/models/ticket.js";
import TicketMessageModel from "../dataBase/models/ticketMessage.js";
import TicketHistoryModel from "../dataBase/models/ticketHistory.js";
import UserDeviceModel from "../dataBase/models/userDevice.js";
import NotificationModel from "../dataBase/models/notificationModel.js"
// User Associations
UserModel.belongsTo(RoleModel, {
  foreignKey: "role_Id",
});
UserModel.belongsTo(DepartmentModel, {
  foreignKey: "department_Id",
});
// Ticket Associations
TicketModel.belongsTo(DepartmentModel, {
  foreignKey: "department_Id",
});
TicketModel.belongsTo(UserModel, {
  foreignKey: "current_Agent",
  as: "agent",
});
TicketModel.belongsTo(UserModel, {
  foreignKey: "customer_Id",
  as: "customer",
});
// Ticket Message Associations
TicketMessageModel.belongsTo(TicketModel, {
  foreignKey: "ticket_Id",
});
TicketMessageModel.belongsTo(UserModel, {
  foreignKey: "sender_Id",
});
// Ticket History Associations
TicketHistoryModel.belongsTo(TicketModel, {
  foreignKey: "ticket_Id",
});
TicketHistoryModel.belongsTo(UserModel, {
  foreignKey: "assign_From",
  as: "assignFrom",
});
TicketHistoryModel.belongsTo(UserModel, {
  foreignKey: "assign_To",
  as: "assignTo",
});
TicketHistoryModel.belongsTo(UserModel, {
  foreignKey: "assign_By",
  as: "assignBy",
});
// TicketHistory Department associations (from/to departments)
TicketHistoryModel.belongsTo(DepartmentModel, {
  foreignKey: "from_Department",
  as: "fromDepartment",
});
TicketHistoryModel.belongsTo(DepartmentModel, {
  foreignKey: "to_Department",
  as: "toDepartment",
});
UserModel.hasMany(TicketMessageModel, {
  foreignKey: "sender_Id"
});
//User --> UserDevice Associations
UserModel.hasMany(UserDeviceModel, {
  foreignKey: "user_id",
  as: "devices",
});
// UserDevice  -->  User Associations
UserDeviceModel.belongsTo(UserModel, {
  foreignKey: "user_id",
  as: "user",
});
UserModel.hasMany(NotificationModel, {
  foreignKey: "user_id",
  as: "notifications",
  onDelete: "CASCADE",
  onUpdate: "CASCADE"
});
NotificationModel.belongsTo(UserModel, {
  foreignKey: "user_id",
  as: "user"
});