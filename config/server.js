import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import http from "http";
import startServer from "./app.js";
const app = express();
app.use(express.json());
const server = http.createServer(app);
startServer(app);