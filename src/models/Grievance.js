const mongoose = require('mongoose');

const grievanceSchema = new mongoose.Schema({
  grievanceId: {
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
  subject: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['OPEN', 'UNDER_REVIEW', 'WAITING_FOR_USER', 'RESOLVED', 'CLOSED'],
    default: 'OPEN',
  },
  evidenceUrls: [String],
}, { timestamps: true });

module.exports = mongoose.model('Grievance', grievanceSchema);
