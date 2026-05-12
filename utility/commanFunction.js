import crypto from 'crypto';
export const generateSecureOtp = (length = 6) => {
    const digit = '0123456789';
    let otp = '';
    for (let i = 0; i < length; i++){
        const randomeIdex = crypto.randomInt(0, digit.length);
        otp += digit[randomeIdex];
    }
    return otp;
}