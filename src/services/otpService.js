const OTP = require('../models/OTP');
const { errorResponse } = require('../utils/response');

const sendOTP = async (identifier, type) => {
  // Demo abstraction for OTP generation
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 mins

  const query = type === 'mobile' ? { mobile: identifier } : { email: identifier };

  await OTP.findOneAndUpdate(
    query,
    { otp: otpCode, expiresAt, attempts: 0 },
    { upsert: true, new: true }
  );

  // In production, integrate with Twilio/AWS SNS/SendGrid here
  console.log(`[OTP_SERVICE] Sent OTP ${otpCode} to ${identifier}`);
  return true;
};

const verifyOTP = async (identifier, type, otpCode) => {
  const query = type === 'mobile' ? { mobile: identifier } : { email: identifier };
  const otpRecord = await OTP.findOne(query);

  if (!otpRecord) return { success: false, message: 'OTP not found or expired' };

  if (otpRecord.attempts >= 3) {
    return { success: false, message: 'Too many attempts' };
  }

  if (otpRecord.otp !== otpCode) {
    otpRecord.attempts += 1;
    await otpRecord.save();
    return { success: false, message: 'Invalid OTP' };
  }

  await OTP.deleteOne(query);
  return { success: true };
};

module.exports = {
  sendOTP,
  verifyOTP,
};
