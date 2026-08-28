const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['HOME', 'WORK', 'OTHER'],
    default: 'OTHER',
  },
  name: String,
  houseNo: String,
  street: String,
  city: String,
  state: String,
  pincode: String,
  landmark: String,
  isDefault: {
    type: Boolean,
    default: false,
  },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true },
  },
}, { timestamps: true });

addressSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Address', addressSchema);
