import SibApiV3Sdk from "sib-api-v3-sdk";
import { brevoApiInstance } from "./brevoClient.js";

export const sendEmail = async ({ to, subject, htmlContent }) => {
  const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

  sendSmtpEmail.subject = subject;
  sendSmtpEmail.htmlContent = htmlContent;

  sendSmtpEmail.sender = {
    name: "Support Managment System",
    email: process.env.EMAIL_FROM,
  };

  sendSmtpEmail.to = [{ email: to.email, name: to.name }];

  try {
    const response = await brevoApiInstance.sendTransacEmail(sendSmtpEmail);
    return response;
  } catch (error) {
    throw new Error(error.response?.body || error.message);
  }
};
