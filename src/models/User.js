const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  loginId: {
    type: String,
    unique: true,
    sparse: true,
  },
  mobile: {
    type: String,
    unique: true,
    sparse: true,
  },
  email: {
    type: String,
    unique: true,
    sparse: true,
  },
  password: {
    type: String,
    select: false,
  },
  googleId: String,
  facebookId: String,
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role',
    required: true,
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'PENDING', 'VERIFICATION_REQUIRED', 'SUSPENDED', 'BLOCKED', 'DEACTIVATED', 'DELETED'],
    default: 'PENDING',
  },
  lastLogin: Date,
  fcmToken: String,
  language: {
    type: String,
    default: 'English',
  },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
