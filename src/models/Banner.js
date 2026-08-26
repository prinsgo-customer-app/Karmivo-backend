const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
  title: String,
  subtitle: String,
  image: {
    type: String,
    required: true,
  },
  videoUrl: String,
  ctaText: String,
  ctaAction: String,
  targetScreen: String,
  active: {
    type: Boolean,
    default: true,
  },
  sortOrder: {
    type: Number,
    default: 0,
  },
  startDate: Date,
  endDate: Date,
}, { timestamps: true });

module.exports = mongoose.model('Banner', bannerSchema);
