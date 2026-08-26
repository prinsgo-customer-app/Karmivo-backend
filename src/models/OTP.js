const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  mobile: String,
  email: String,
  otp: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expires: '5m' }, // Auto delete after 5m
  },
  attempts: {
    type: Number,
    default: 0,
  }
}, { timestamps: true });

module.exports = mongoose.model('OTP', otpSchema);
