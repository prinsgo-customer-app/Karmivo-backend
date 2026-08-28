const Review = require('../models/Review');
const Order = require('../models/Order');
const { successResponse, errorResponse } = require('../utils/response');

const createReview = async (req, res, next) => {
  try {
    const { id } = req.params; // booking id
    const { rating, comment } = req.body;

    const booking = await Order.findOne({ _id: id, customer: req.user._id });
    if (!booking) return errorResponse(res, 404, 'Booking not found');

    if (booking.status !== 'completed') {
        return errorResponse(res, 400, 'Only completed bookings can be reviewed');
    }

    const existingReview = await Review.findOne({ order: booking._id, customer: req.user._id });
    if (existingReview) {
        return errorResponse(res, 400, 'You have already reviewed this booking');
    }

    const review = await Review.create({
      order: booking._id,
      customer: req.user._id,
      partner: booking.partner,
      rating,
      comment
    });

    return successResponse(res, 201, 'Review submitted successfully', { review });
  } catch (error) {
    next(error);
  }
};

const getReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const review = await Review.findOne({ order: id }).populate('customer', 'mobile email');

    if (!review) return errorResponse(res, 404, 'Review not found');

    return successResponse(res, 200, 'Review retrieved', { review });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createReview,
  getReview,
};
