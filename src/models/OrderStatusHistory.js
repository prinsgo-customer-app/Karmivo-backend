const mongoose = require('mongoose');

const orderStatusHistorySchema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
  },
  oldStatus: String,
  newStatus: {
    type: String,
    required: true,
  },
  actor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  role: String,
  reason: String,
  notes: String,
}, { timestamps: true });

module.exports = mongoose.model('OrderStatusHistory', orderStatusHistorySchema);
