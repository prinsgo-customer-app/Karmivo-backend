const mongoose = require('mongoose');

const paymentTransactionSchema = new mongoose.Schema({
  transactionId: {
    type: String,
    required: true,
    unique: true,
  },
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    default: 'INR',
  },
  status: {
    type: String,
    enum: ['PENDING', 'SUCCESS', 'FAILED', 'CANCELLED', 'REFUNDED'],
    default: 'PENDING',
  },
  paymentMethod: String,
  gatewayReference: String,
  gatewayResponse: mongoose.Schema.Types.Mixed,
}, { timestamps: true });

module.exports = mongoose.model('PaymentTransaction', paymentTransactionSchema);
