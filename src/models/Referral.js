const mongoose = require('mongoose');

const referralSchema = new mongoose.Schema({
  referrer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  referee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  referralCode: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['PENDING', 'COMPLETED'],
    default: 'PENDING',
  },
  rewardAmount: {
    type: Number,
    default: 0,
  }
}, { timestamps: true });

module.exports = mongoose.model('Referral', referralSchema);
