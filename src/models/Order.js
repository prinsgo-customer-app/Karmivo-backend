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
      'pending', 'searching', 'accepted', 'arriving', 'picked_up', 'in_progress', 'completed', 'cancelled'
    ],
    default: 'pending',
  },
  pickupAddress: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Address',
  },
  destinationAddress: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Address',
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


module.exports = mongoose.model('Order', orderSchema);
