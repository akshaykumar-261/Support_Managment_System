import crypto from "crypto";
import fs from "fs";
import jwt from "jsonwebtoken";
// this function will generate a secure OTP of specified length (default is 6)
export const generateSecureOtp = (length = 6) => {
  const digit = "0123456789";
  let otp = "";
  for (let i = 0; i < length; i++) {
    const randomeIdex = crypto.randomInt(0, digit.length);
    otp += digit[randomeIdex];
  }
  return otp;
};
// this function will handle async errors in express routes
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export const deleteFile = (filePath) => {
  if (!filePath) return;
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};
export const generateTicketNumber = () => {
  const random = Math.floor(1000 + Math.random() * 9000);
  return `TKT-${Date.now()}-${random}`;
};
export const generateAccessToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      role_Id: user.role_Id,
      email: user.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "15m",
    },
  );
};
export const generateRefreshToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
    },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: "7d",
    },
  );
};
