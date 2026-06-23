import twilio from "twilio";
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);
const serviceSid = process.env.TWILIO_VERIFY_SERVICE_SID;
export const sendPhoneOtp = async (phoneNo) => {
  return await client.verify.v2
    .services(serviceSid)
    .verifications.create({
      to: phoneNo,
      channel: "sms",
    });
};
export const verifyPhoneOtp = async (phoneNo, otp) => {
  return await client.verify.v2
    .services(serviceSid)
    .verificationChecks.create({
      to: phoneNo,
      code: otp,
    });
};