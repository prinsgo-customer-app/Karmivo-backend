const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
  offerId: {
    type: String,
    required: true,
    unique: true,
  },
  title: String,
  description: String,
  discountType: {
    type: String,
    enum: ['PERCENTAGE', 'FIXED'],
  },
  discountValue: Number,
  minimumOrderValue: Number,
  maximumDiscount: Number,
  startDate: Date,
  endDate: Date,
  active: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Offer', offerSchema);
