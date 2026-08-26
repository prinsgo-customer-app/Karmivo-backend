const mongoose = require('mongoose');

const partnerProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  partnerId: {
    type: String,
    unique: true,
  },
  firstName: String,
  lastName: String,
  gender: String,
  profilePhoto: String,
  address: {
    country: String,
    state: String,
    district: String,
    city: String,
    pincode: String,
    permanentAddress: String,
    workAddress: String,
  },
  serviceCategories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ServiceCategory',
  }],
  skills: [String],
  experienceYears: Number,
  serviceArea: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] },
  },
  workingRadiusKm: {
    type: Number,
    default: 10,
  },
  onlineStatus: {
    type: String,
    enum: ['ONLINE', 'OFFLINE', 'BUSY', 'SUSPENDED'],
    default: 'OFFLINE',
  },
  availability: {
    type: Boolean,
    default: true,
  },
  bankDetails: {
    accountName: String,
    accountNumber: String,
    ifscCode: String,
    bankName: String,
    branch: String,
  },
  upiId: String,
  verificationStatus: {
    type: String,
    enum: ['PENDING', 'UNDER_REVIEW', 'VERIFIED', 'REJECTED'],
    default: 'PENDING',
  },
  documents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Document',
  }],
  rating: {
    type: Number,
    default: 0,
  },
  reviewCount: {
    type: Number,
    default: 0,
  },
  referralCode: {
    type: String,
    unique: true,
    sparse: true,
  },
  referredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, { timestamps: true });

partnerProfileSchema.index({ serviceArea: '2dsphere' });

module.exports = mongoose.model('PartnerProfile', partnerProfileSchema);
