const mongoose = require('mongoose');

const customerProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  customerId: {
    type: String,
    unique: true,
  },
  firstName: String,
  lastName: String,
  gender: String,
  dateOfBirth: Date,
  profilePhoto: String,
  address: {
    country: String,
    state: String,
    district: String,
    city: String,
    pincode: String,
    permanentAddress: String,
    currentAddress: String,
  },
  savedLocations: [{
    label: String,
    country: String,
    state: String,
    district: String,
    city: String,
    pincode: String,
    address: String,
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], default: [0, 0] },
    },
  }],
  emergencyContact: {
    name: String,
    mobile: String,
    relation: String,
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

customerProfileSchema.index({ 'savedLocations.location': '2dsphere' });

module.exports = mongoose.model('CustomerProfile', customerProfileSchema);
