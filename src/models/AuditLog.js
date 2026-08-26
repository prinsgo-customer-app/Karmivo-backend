const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  actor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  role: String,
  action: {
    type: String,
    required: true,
  },
  module: {
    type: String,
    required: true,
  },
  targetId: String,
  beforeData: mongoose.Schema.Types.Mixed,
  afterData: mongoose.Schema.Types.Mixed,
  ip: String,
  userAgent: String,
}, { timestamps: true });

module.exports = mongoose.model('AuditLog', auditLogSchema);
