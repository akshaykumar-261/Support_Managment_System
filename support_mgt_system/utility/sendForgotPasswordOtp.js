import { sendEmail } from "./emailService.js";
import { forgotPasswordOtpTemplate } from "./forgotPasswordTemplate.js";
export const sendForgotPasswordOtp = async (
  email,
  otp,
  name = "User"
) => {
  return await sendEmail({
    to: {
      email,
      name,
    },
    subject: "Password Reset OTP",
    htmlContent: forgotPasswordOtpTemplate(
      name,
      otp
    ),
  });
};
