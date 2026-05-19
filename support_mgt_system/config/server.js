import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import http from "http";
import { Server } from "socket.io";
import socketHandler from "../utility/socketUser.js"
import startServer from "./app.js";
import erroHandler from "../src/middleweare/errorHandler.js";
import userRoutes from "../src/routes/userRoutes.js";
import ticketRoute from "../src/routes/ticketRoutes.js";
import ticketHistoryRoute from "../src/routes/ticketHistoryRoutes.js";
import ticketMessageRoute from "../src/routes/ticketMessageRoutes.js";
import "./association.js";
const app = express();
app.use(express.json());
const server = http.createServer(app);
const io = new Server(server,{
    cors: {
        origin:"*"
    }
})
global.io = io;
app.use("/uploads", express.static("uploads"));
app.use("/api/users", userRoutes);
app.use("/api/ticket", ticketRoute);
app.use("/api/ticketHistory", ticketHistoryRoute);
app.use("/api/ticketMessage", ticketMessageRoute);
app.use(erroHandler);
const PORT = process.env.PORT;
socketHandler(io);
startServer(server,PORT);