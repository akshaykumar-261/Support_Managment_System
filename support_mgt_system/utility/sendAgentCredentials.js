import { sendEmail } from "./emailService.js"

export const sendAgentCredentials = async (
  email,
  name,
  password
) => {
  const htmlContent = `
    <h2>Welcome to Support Management System</h2>

    <p>Hello ${name},</p>

    <p>You have been added as an Agent in Support Management System.</p>

    <p><strong>Login Credentials:</strong></p>

    <ul>
      <li><strong>Email:</strong> ${email}</li>
      <li><strong>Password:</strong> ${password}</li>
    </ul>

    <p>Please login and change your password after first login.</p>

    <br>

    <p>Regards,</p>
    <p>Support Management Team</p>
  `;

  await sendEmail({
    to: {
      email,
      name,
    },
    subject: "Welcome to Support Management System",
    htmlContent,
  });
};