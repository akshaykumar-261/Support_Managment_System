import jwt from "jsonwebtoken";
import UserModel from "../dataBase/models/user.js";
import TicketMessageModel from "../dataBase/models/ticketMessage.js";

const socketHandler = (io) => {
  // AUTHENTICATION
  io.use(async (socket, next) => {
    try {
      // TOKEN FROM HEADERS
      const authHeader = socket.handshake.headers.token;

      if (!authHeader) {
        return next(new Error("Token Missing"));
      }

      // REMOVE BEARER
      const token = authHeader.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : authHeader;

      // VERIFY TOKEN
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // FIND USER
      const user = await UserModel.findOne({
        where: {
          id: decoded.id,
          is_active: 1,
        },
      });

      if (!user) {
        return next(new Error("User Not Found"));
      }

      // STORE USER
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

    // JOIN ROOM & LOAD HISTORY
    socket.on("join_ticket", async (DATA) => {
      try {
        const ticketId = DATA.ticket_Id;
        socket.join(`ticket_${ticketId}`);
        console.log(`${socket.user.name} joined ticket_${ticketId}`);

        // --- CHANGES HERE: Fetching Old Chat History From Database ---
        const oldMessages = await TicketMessageModel.findAll({
          where: { ticket_Id: ticketId },
          order: [["createdAt", "ASC"]], // Pehle wale messages upar, naye niche
        });

        // Messages ko proper format me convert karein
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

        // Sirf request karne wale user ko history send karein
        socket.emit("load_chat_history", formattedMessages);
      } catch (error) {
        console.error("Error loading chat history:", error.message);
        socket.emit("message_error", {
          success: false,
          message: "Could not load old chat history",
        });
      }
    });

    // SEND MESSAGE
    socket.on("send_message", async (data) => {
      try {
        console.log("send_message payload:", data);
        console.log("Socket ID =>", socket.id);
        console.log("ROOMS =>", [...socket.rooms]);

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
            // FIXED: Bhejne wale ko hi error jaye, pure server ko nahi
            success: false,
            message: "Message cannot be empty",
          });
          return;
        }

        // DB SAVE
        const newMessage = await TicketMessageModel.create({
          ticket_Id: ticketId,
          sender_Id: socket.user.id,
          message: messageText,
        });

        const roomName = `ticket_${ticketId}`;
        const room = io.sockets.adapter.rooms.get(roomName);
        const roomSize = room ? room.size : 0;
        console.log(`Emitting to room ${roomName}, members: ${roomSize}`);

        // SEND TO ROOM (Isme sender aur receiver dono ko real-time message mil jayega)
        io.to(roomName).emit("receive_message", {
          from: socket.user.name,
          sender_Id: newMessage.sender_Id,
          ticket_Id: newMessage.ticket_Id,
          message: newMessage.message,
          createdAt: newMessage.createdAt,
        });

        // NOTE: Purane duplicate socket.emit("receive_message") ko hata diya hai taaki double print na ho.

        // ACKNOWLEDGEMENT
        socket.emit("message_sent", {
          success: true,
          message: "Message Delivered",
        });
      } catch (error) {
        console.log(error);
        socket.emit("message_error", {
          success: false,
          message: "Message Failed",
        });
      }
    });

    // DISCONNECT
    socket.on("disconnect", () => {
      console.log(`${socket.user.name} disconnected`);
    });
  });
};

export default socketHandler;
