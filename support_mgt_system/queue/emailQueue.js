import { Queue } from "bullmq";
import { connection } from "./connection.js";
export const emailQueue = new Queue("emailQueue",{
    connection,
});
console.log("==>",emailQueue);