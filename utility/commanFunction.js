import crypto from 'crypto';
import fs from 'fs';
// this function will generate a secure OTP of specified length (default is 6)
export const generateSecureOtp = (length = 6) => {
    const digit = '0123456789';
    let otp = '';
    for (let i = 0; i < length; i++){
        const randomeIdex = crypto.randomInt(0, digit.length);
        otp += digit[randomeIdex];
    }
    return otp;
}
// this function will handle async errors in express routes
export const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    }
}

export const deleteFile = (filePath) => {
  if (!filePath) return;
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
}