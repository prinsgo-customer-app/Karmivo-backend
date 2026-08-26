const mongoose = require('mongoose');

const idSequenceSchema = new mongoose.Schema({
  prefix: {
    type: String,
    required: true,
    unique: true,
  },
  sequence: {
    type: Number,
    default: 0,
  }
});

module.exports = mongoose.model('IDSequence', idSequenceSchema);
