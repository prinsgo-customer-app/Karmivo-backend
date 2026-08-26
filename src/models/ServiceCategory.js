const mongoose = require('mongoose');

const serviceCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: String,
  icon: String,
  image: String,
  active: {
    type: Boolean,
    default: true,
  },
  sortOrder: {
    type: Number,
    default: 0,
  },
  parentCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ServiceCategory',
  },
}, { timestamps: true });

module.exports = mongoose.model('ServiceCategory', serviceCategorySchema);
