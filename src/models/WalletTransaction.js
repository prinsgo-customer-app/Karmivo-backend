const mongoose = require('mongoose');

const walletTransactionSchema = new mongoose.Schema({
  transactionId: {
    type: String,
    required: true,
    unique: true,
  },
  wallet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Wallet',
    required: true,
  },
  type: {
    type: String,
    enum: ['CREDIT', 'DEBIT'],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  referenceId: {
    type: String,
  },
  description: String,
  status: {
    type: String,
    enum: ['PENDING', 'COMPLETED', 'FAILED'],
    default: 'COMPLETED',
  },
}, { timestamps: true });

module.exports = mongoose.model('WalletTransaction', walletTransactionSchema);
