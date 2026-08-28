const CustomerProfile = require('../models/CustomerProfile');
const PartnerProfile = require('../models/PartnerProfile');
const { successResponse, errorResponse } = require('../utils/response');

const getProfile = async (req, res, next) => {
  try {
    let profile = null;
    if (req.user.role.name === 'CUSTOMER') {
      profile = await CustomerProfile.findOne({ user: req.user._id });
    } else if (req.user.role.name === 'PARTNER') {
      profile = await PartnerProfile.findOne({ user: req.user._id });
    }

    if (!profile) {
      return errorResponse(res, 404, 'Profile not found');
    }

    return successResponse(res, 200, 'Profile retrieved', { profile });
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const updates = req.body;
    let profile = null;
    if (req.user.role.name === 'CUSTOMER') {
      profile = await CustomerProfile.findOneAndUpdate(
        { user: req.user._id },
        { $set: updates },
        { new: true }
      );
    } else if (req.user.role.name === 'PARTNER') {
      profile = await PartnerProfile.findOneAndUpdate(
        { user: req.user._id },
        { $set: updates },
        { new: true }
      );
    }

    if (!profile) {
        return errorResponse(res, 404, 'Profile not found');
    }

    return successResponse(res, 200, 'Profile updated', { profile });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile,
};
