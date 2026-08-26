const mongoose = require('mongoose');

const withdrawalSchema = new mongoose.Schema({
  withdrawalId: {
    type: String,
    required: true,
    unique: true,
  },
  partner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['PENDING', 'APPROVED', 'REJECTED', 'PROCESSING', 'COMPLETED', 'FAILED'],
    default: 'PENDING',
  },
  bankDetails: mongoose.Schema.Types.Mixed,
  processedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  transactionReference: String,
}, { timestamps: true });

module.exports = mongoose.model('Withdrawal', withdrawalSchema);
