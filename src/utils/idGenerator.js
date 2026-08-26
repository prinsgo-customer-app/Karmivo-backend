const IDSequence = require('../models/IDSequence');

const generateId = async (prefix, sequenceLength = 6) => {
  const counter = await IDSequence.findOneAndUpdate(
    { prefix },
    { $inc: { sequence: 1 } },
    { new: true, upsert: true }
  );

  const paddedNum = counter.sequence.toString().padStart(sequenceLength, '0');
  return `${prefix}-${paddedNum}`;
};

module.exports = {
  generateId,
};
