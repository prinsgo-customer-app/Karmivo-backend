const PartnerProfile = require('../models/PartnerProfile');
const { requestOtp, verifyOtpLogin, me } = require('./authController');
const { successResponse, errorResponse } = require('../utils/response');

const toggleStatus = async (req, res, next, status) => {
  try {
    const profile = await PartnerProfile.findOneAndUpdate(
      { user: req.user._id },
      { onlineStatus: status },
      { new: true }
    );
    if (!profile) return errorResponse(res, 404, 'Worker profile not found');
    return successResponse(res, 200, `Worker is now ${status}`, { profile });
  } catch (error) {
    next(error);
  }
};

const goOnline = (req, res, next) => toggleStatus(req, res, next, 'ONLINE');
const goOffline = (req, res, next) => toggleStatus(req, res, next, 'OFFLINE');

const Order = require('../models/Order');
const OrderStatusHistory = require('../models/OrderStatusHistory');

const getNearbyJobs = async (req, res, next) => {
  try {
    const jobs = await Order.find({ status: 'pending' })
      .populate('service pickupAddress destinationAddress')
      .sort('-createdAt');
    return successResponse(res, 200, 'Nearby jobs retrieved', { jobs });
  } catch (error) {
    next(error);
  }
};

const getJobById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const job = await Order.findOne({ _id: id })
      .populate('service pickupAddress destinationAddress customer');
    if (!job) return errorResponse(res, 404, 'Job not found');
    return successResponse(res, 200, 'Job retrieved', { job });
  } catch (error) {
    next(error);
  }
};

const acceptJob = async (req, res, next) => {
  try {
    const { id } = req.params;
    const job = await Order.findOneAndUpdate(
      { _id: id, status: 'pending' },
      { status: 'accepted', partner: req.user._id },
      { new: true }
    );
    if (!job) return errorResponse(res, 404, 'Job not available or not found');

    await OrderStatusHistory.create({
      order: job._id,
      oldStatus: 'pending',
      newStatus: 'accepted',
      actor: req.user._id,
      role: req.user.role.name,
      notes: 'Accepted by partner',
    });

    return successResponse(res, 200, 'Job accepted', { job });
  } catch (error) {
    next(error);
  }
};

const pickupJob = async (req, res, next) => {
  try {
    const { id } = req.params;
    const job = await Order.findOneAndUpdate(
      { _id: id, partner: req.user._id, status: 'accepted' },
      { status: 'picked_up' },
      { new: true }
    );
    if (!job) return errorResponse(res, 404, 'Job not found or invalid status');

    await OrderStatusHistory.create({
      order: job._id,
      oldStatus: 'accepted',
      newStatus: 'picked_up',
      actor: req.user._id,
      role: req.user.role.name,
      notes: 'Partner picked up',
    });

    return successResponse(res, 200, 'Job picked up', { job });
  } catch (error) {
    next(error);
  }
};

const completeJob = async (req, res, next) => {
  try {
    const { id } = req.params;
    const job = await Order.findOne({ _id: id, partner: req.user._id });
    if (!job || !['picked_up', 'in_progress'].includes(job.status)) {
        return errorResponse(res, 404, 'Job not found or invalid status');
    }

    const oldStatus = job.status;
    job.status = 'completed';
    await job.save();

    await OrderStatusHistory.create({
      order: job._id,
      oldStatus,
      newStatus: 'completed',
      actor: req.user._id,
      role: req.user.role.name,
      notes: 'Completed by partner',
    });

    return successResponse(res, 200, 'Job completed', { job });
  } catch (error) {
    next(error);
  }
};

const getEarnings = async (req, res, next) => {
  try {
    const jobs = await Order.find({ partner: req.user._id, status: 'completed' })
      .select('amounts createdAt')
      .sort('-createdAt');
    return successResponse(res, 200, 'Earnings retrieved', { earnings: jobs });
  } catch (error) {
    next(error);
  }
};

const getEarningsSummary = async (req, res, next) => {
  try {
    const jobs = await Order.find({ partner: req.user._id, status: 'completed' });
    const totalEarnings = jobs.reduce((sum, job) => sum + (job.amounts.partnerAmount || 0), 0);
    const totalJobs = jobs.length;

    return successResponse(res, 200, 'Earnings summary retrieved', {
      summary: { totalEarnings, totalJobs }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  requestOtp,
  verifyOtpLogin,
  me,
  goOnline,
  goOffline,
  getNearbyJobs,
  getJobById,
  acceptJob,
  pickupJob,
  completeJob,
  getEarnings,
  getEarningsSummary,
};
