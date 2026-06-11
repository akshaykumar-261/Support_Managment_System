export const forgotPasswordOtpTemplate = (
  name,
  otp
) => {
  return `
    <h2>Hello ${name},</h2>

    <p>
      We received a request to reset your password.
    </p>
    <p>Your OTP is:</p>

    <h1 style="color:#2563eb;">
      ${otp}
    </h1>

    <p>
      This OTP will expire in 5 minutes.
    </p>
    <p>
      If you did not request this OTP,
      please ignore this email.
    </p>
    <br />
    <p>
      Regards,<br />
      Support Management System
    </p>
  `;
};