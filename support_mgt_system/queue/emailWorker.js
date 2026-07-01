import { Worker } from "bullmq";
import { connection } from "./connection.js";
import { sendRegistrationOtp } from "../utility/sendRegistrationOtp.js";
new Worker(
  "emailQueue",
  async (job) => {
    console.log(job.data);
    const { email, otp, name } = job.data;
    await sendRegistrationOtp(email, otp, name);
    console.log("Email Sent");
  },
  {
    connection,
  },
);
