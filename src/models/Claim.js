const mongoose = require('mongoose');

const claimSchema = new mongoose.Schema({
  claimId: {
    type: String,
    required: true,
    unique: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
  },
  amount: Number,
  reason: String,
  status: {
    type: String,
    enum: ['PENDING', 'APPROVED', 'REJECTED', 'PARTIALLY_APPROVED'],
    default: 'PENDING',
  },
  approvedAmount: Number,
}, { timestamps: true });

module.exports = mongoose.model('Claim', claimSchema);
