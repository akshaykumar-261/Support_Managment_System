import jwt from "jsonwebtoken";
import { Op } from "sequelize";
import UserModel from "../dataBase/models/user.js";
import TicketModel from "../dataBase/models/ticket.js";
import UserDevicesModel from "../dataBase/models/userDevice.js";
import { sendPushNotification } from "../src/helper/notificationFunction.js";
import TicketMessageModel from "../dataBase/models/ticketMessage.js";

const socketHandler = (io) => {
  io.use(async (socket, next) => {
    try {
      const authHeader = socket.handshake.headers.token;
      if (!authHeader) return next(new Error("Token Missing"));

      const token = authHeader.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : authHeader;
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await UserModel.findOne({
        where: { id: decoded.id, is_active: 1 },
      });
      if (!user) return next(new Error("User Not Found"));
      socket.user = user;
      next();
    } catch (error) {
      console.log(error.message);
      next(new Error("Invalid Token"));
    }
  });

  // CONNECTION
  io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.user.name}`);

    // JOIN ROOM
    socket.on("join_ticket", async (DATA) => {
      try {
        const ticketId = DATA.ticket_Id;
        socket.join(`ticket_${ticketId}`);
        console.log(`${socket.user.name} joined ticket_${ticketId}`);

        const oldMessages = await TicketMessageModel.findAll({
          where: { ticket_Id: ticketId },
          order: [["createdAt", "ASC"]],
        });
        const formattedMessages = oldMessages.map((msg) => ({
          from:
            msg.sender_Id === socket.user.id
              ? socket.user.name
              : "Customer/Agent",
          sender_Id: msg.sender_Id,
          ticket_Id: msg.ticket_Id,
          message: msg.message,
          createdAt: msg.createdAt,
        }));

        socket.emit("load_chat_history", formattedMessages);
      } catch (error) {
        console.error("Error loading chat history:", error.message);
        socket.emit("message_error", {
          success: false,
          message: "Could not load old chat history",
        });
      }
    });

    socket.on("send_message", async (data) => {
      try {
        console.log("send_message payload:", data);

        const ticketId =
          data && data.ticket_Id ? parseInt(data.ticket_Id, 10) : NaN;
        if (Number.isNaN(ticketId)) {
          socket.emit("message_error", {
            success: false,
            message: "Invalid ticket id",
          });
          return;
        }

        const messageText =
          typeof data.message === "string" ? data.message.trim() : "";
        if (!messageText) {
          socket.emit("message_error", {
            success: false,
            message: "Message cannot be empty",
          });
          return;
        }

        const newMessage = await TicketMessageModel.create({
          ticket_Id: ticketId,
          sender_Id: socket.user.id,
          message: messageText,
        });
        const roomName = `ticket_${ticketId}`;
        const room = io.sockets.adapter.rooms.get(roomName);
        const roomSize = room ? room.size : 0;
        console.log(`Emitting to room ${roomName}, members: ${roomSize}`);
        io.to(roomName).emit("receive_message", {
          from: socket.user.name,
          sender_Id: newMessage.sender_Id,
          ticket_Id: newMessage.ticket_Id,
          message: newMessage.message,
          createdAt: newMessage.createdAt,
        });

        // PUSH NOTIFICATION LOGIC (ALL CONDITIONS HANDLED)
        if (roomSize <= 1) {
          console.log(
            "Receiver is not currently connected to the room. Retrieving details from the database.",
          );
          const ticket = await TicketModel.findOne({ where: { id: ticketId } });

          if (ticket) {
            let receiverIds = [];
            const currentUserId = socket.user.id || socket.user.dataValues?.id;
            if (currentUserId === ticket.customer_Id) {
              if (ticket.current_Agent) {
                // If an agent is assigned, send the notification only to that agent.
                receiverIds.push(ticket.current_Agent);
              } else {
                // If the ticket is unassigned, notify all Super Admins.
                console.log(
                  "The ticket is unassigned. Notifying all Super Admins...",
                );
                const admins = await UserModel.findAll({
                  where: { role_Id: 1, is_active: 1 },
                  attributes: ["id"],
                  raw: true,
                });
                receiverIds = admins.map((admin) => admin.id);
              }
            } else {
              // notification is always send to customer
              receiverIds.push(ticket.customer_Id);
            }

            console.log(
              `Sender ID: ${currentUserId} | Target Receiver IDs:`,
              receiverIds,
            );
            //Fetch Device_token
            if (receiverIds.length > 0) {
              const receiverTokens = await UserDevicesModel.findAll({
                where: {
                  user_id: { [Op.in]: receiverIds },
                  is_login: true,
                  device_token: { [Op.ne]: null },
                },
                include: [
                  {
                    model: UserModel,
                    as: "user",
                    attributes: ["is_mobile_notification_active"],
                  },
                ],
                attributes: ["user_id", "device_token"],
                raw: true,
                nest: true,
              });

              if (receiverTokens && receiverTokens.length > 0) {
                const title = `New message from ${socket.user.name}`;
                const body =
                  messageText.length > 60
                    ? `${messageText.substring(0, 60)}...`
                    : messageText;

                const dataPayload = {
                  screen: "ticketdiscussionscreen", 
                  ticket_id: String(ticketId),
                  ticket_title: ticket
                    ? String(ticket.title)
                    : "Support_Mgt_Ticket",
                  action: "chat_message",
                };

                receiverTokens.forEach((device) => {
                  console.log(
                    `Sending push notification to token: ${device.device_token}`,
                  );
                  const isNotiActive =
                    device.user?.is_mobile_notification_active ??
                    device["user.is_mobile_notification_active"];
                  if (
                    isNotiActive === false ||
                    isNotiActive === 0 ||
                    isNotiActive === "0"
                  ) {
                    console.log(
                      `[Socket]  Push Notification BLOCKED for User ID: ${device.user_id} because setting is OFF.`,
                    );
                    return; // Is loop iteration se bahar (Agle device par jao)
                  }
                  console.log(
                    `[Socket] Sending push notification to token: ${device.device_token} (User ID: ${device.user_id})`,
                  );
                  sendPushNotification(
                    device.device_token,
                    title,
                    body,
                    dataPayload,
                  );
                });
                console.log("Notification sent successfully!");
              } else {
                console.log(
                  "No active device tokens were found for the target users. Notification could not be sent.",
                );
              }
            }
          }
        } else {
          console.log(
            "Both users are currently online in the chat room. Push notification has been skipped.",
          );
        }

        socket.emit("message_sent", {
          success: true,
          message: "Message Delivered",
        });
      } catch (error) {
        console.error("Error in send_message code:", error);
        socket.emit("message_error", {
          success: false,
          message: "Message Failed",
        });
      }
    });

    socket.on("disconnect", () => {
      console.log(`${socket.user.name} disconnected`);
    });
  });
};

export default socketHandler;
