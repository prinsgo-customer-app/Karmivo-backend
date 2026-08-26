const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ServiceCategory',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: String,
  images: [String],
  basePrice: {
    type: Number,
    required: true,
  },
  pricingType: {
    type: String,
    enum: ['FIXED', 'HOURLY', 'VARIABLE'],
    default: 'FIXED',
  },
  durationMinutes: Number,
  active: {
    type: Boolean,
    default: true,
  },
  commissionRules: {
    type: { type: String, enum: ['PERCENTAGE', 'FIXED'] },
    value: Number,
  },
  requiredDocuments: [{
    name: String,
    type: String,
  }],
}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema);
