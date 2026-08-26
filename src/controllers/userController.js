const CustomerProfile = require('../models/CustomerProfile');
const PartnerProfile = require('../models/PartnerProfile');
const { successResponse, errorResponse } = require('../utils/response');

const getCustomerProfile = async (req, res, next) => {
  try {
    const profile = await CustomerProfile.findOne({ user: req.user._id });
    if (!profile) return errorResponse(res, 404, 'Profile not found');
    return successResponse(res, 200, 'Profile retrieved', { profile });
  } catch (error) {
    next(error);
  }
};

const updateCustomerProfile = async (req, res, next) => {
  try {
    const updates = req.body;
    const profile = await CustomerProfile.findOneAndUpdate(
      { user: req.user._id },
      { $set: updates },
      { new: true }
    );
    return successResponse(res, 200, 'Profile updated', { profile });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCustomerProfile,
  updateCustomerProfile,
};
