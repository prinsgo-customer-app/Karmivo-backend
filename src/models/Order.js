const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true,
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  partner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: true,
  },
  status: {
    type: String,
    enum: [
      'REQUESTED', 'SEARCHING', 'ASSIGNED', 'ACCEPTED', 'REJECTED',
      'ARRIVING', 'STARTED', 'IN_PROGRESS', 'COMPLETED', 'CANCEL_REQUESTED',
      'CANCELLED', 'PAYMENT_PENDING', 'PAYMENT_SUCCESS', 'PAYMENT_FAILED',
      'REFUND_PENDING', 'REFUNDED', 'DISPUTED', 'FAILED'
    ],
    default: 'REQUESTED',
  },
  serviceAddress: {
    address: String,
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], required: true },
    },
  },
  scheduledDate: Date,
  amounts: {
    servicePrice: Number,
    discount: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    platformFee: { type: Number, default: 0 },
    partnerAmount: { type: Number, default: 0 },
    totalAmount: Number,
  },
  paymentStatus: {
    type: String,
    enum: ['PENDING', 'SUCCESS', 'FAILED', 'REFUNDED'],
    default: 'PENDING',
  },
  paymentMethod: String,
}, { timestamps: true });

orderSchema.index({ 'serviceAddress.location': '2dsphere' });

module.exports = mongoose.model('Order', orderSchema);
