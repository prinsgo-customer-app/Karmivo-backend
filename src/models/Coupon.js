const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
  },
  offer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Offer',
    required: true,
  },
  usageLimit: Number,
  usedCount: {
    type: Number,
    default: 0,
  },
  perUserLimit: {
    type: Number,
    default: 1,
  },
  active: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Coupon', couponSchema);
