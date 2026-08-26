const mongoose = require('mongoose');

const appSettingSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
  },
  value: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  description: String,
  type: {
    type: String,
    enum: ['STRING', 'NUMBER', 'BOOLEAN', 'JSON'],
    default: 'STRING',
  },
  group: {
    type: String,
    default: 'GENERAL',
  }
}, { timestamps: true });

module.exports = mongoose.model('AppSetting', appSettingSchema);
