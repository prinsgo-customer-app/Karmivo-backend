const Referral = require('../models/Referral');
const User = require('../models/User');
const CustomerProfile = require('../models/CustomerProfile');
const { successResponse, errorResponse } = require('../utils/response');

const getReferralInfo = async (req, res, next) => {
  try {
    const profile = await CustomerProfile.findOne({ user: req.user._id });
    if (!profile) return errorResponse(res, 404, 'Profile not found');

    let code = profile.referralCode;
    if (!code) {
        code = Math.random().toString(36).substring(2, 8).toUpperCase();
        profile.referralCode = code;
        await profile.save();
    }

    const referrals = await Referral.find({ referrer: req.user._id }).populate('referee', 'mobile email');

    return successResponse(res, 200, 'Referral info retrieved', {
        code,
        referrals,
        totalRewards: referrals.reduce((sum, ref) => sum + (ref.rewardAmount || 0), 0)
    });
  } catch (error) {
    next(error);
  }
};

const applyReferral = async (req, res, next) => {
  try {
    const { code } = req.body;
    if (!code) return errorResponse(res, 400, 'Referral code is required');

    const referrerProfile = await CustomerProfile.findOne({ referralCode: code });
    if (!referrerProfile) return errorResponse(res, 404, 'Invalid referral code');
    if (referrerProfile.user.toString() === req.user._id.toString()) {
        return errorResponse(res, 400, 'Cannot use your own referral code');
    }

    const existingReferral = await Referral.findOne({ referee: req.user._id });
    if (existingReferral) {
        return errorResponse(res, 400, 'You have already used a referral code');
    }

    const referral = await Referral.create({
      referrer: referrerProfile.user,
      referee: req.user._id,
      referralCode: code,
      status: 'COMPLETED',
      rewardAmount: 50
    });

    return successResponse(res, 200, 'Referral applied successfully', { referral });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getReferralInfo,
  applyReferral,
};
