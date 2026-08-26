const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  notificationId: {
    type: String,
    required: true,
    unique: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: String,
  body: String,
  type: String,
  read: {
    type: Boolean,
    default: false,
  },
  data: mongoose.Schema.Types.Mixed,
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
