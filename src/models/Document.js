const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  documentId: {
    type: String,
    required: true,
    unique: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  fileUrl: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['PENDING', 'UPLOADED', 'UNDER_REVIEW', 'VERIFIED', 'REJECTED', 'EXPIRED'],
    default: 'UPLOADED',
  },
  rejectionReason: String,
  expiryDate: Date,
}, { timestamps: true });

module.exports = mongoose.model('Document', documentSchema);
