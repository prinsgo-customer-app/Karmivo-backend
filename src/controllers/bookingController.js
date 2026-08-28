const Order = require('../models/Order');
const Service = require('../models/Service');
const OrderStatusHistory = require('../models/OrderStatusHistory');
const { generateId } = require('../utils/idGenerator');
const { successResponse, errorResponse } = require('../utils/response');

const createBooking = async (req, res, next) => {
  try {
    const { serviceId, scheduledDate, pickupAddressId, destinationAddressId, paymentMethod } = req.body;

    const service = await Service.findById(serviceId);
    if (!service) return errorResponse(res, 404, 'Service not found');

    const totalAmount = service.basePrice;
    let partnerAmount = totalAmount;
    let platformFee = 0;

    const orderId = await generateId('BKG');

    const booking = await Order.create({
      orderId,
      customer: req.user._id,
      service: service._id,
      scheduledDate,
      pickupAddress: pickupAddressId,
      destinationAddress: destinationAddressId,
      amounts: {
        servicePrice: service.basePrice,
        platformFee,
        partnerAmount,
        totalAmount,
      },
      paymentMethod,
      status: 'pending'
    });

    await OrderStatusHistory.create({
      order: booking._id,
      newStatus: 'pending',
      actor: req.user._id,
      role: req.user.role.name,
      notes: 'Booking created',
    });

    return successResponse(res, 201, 'Booking created successfully', { booking });
  } catch (error) {
    next(error);
  }
};

const getBookings = async (req, res, next) => {
  try {
    const bookings = await Order.find({ customer: req.user._id })
      .populate('service pickupAddress destinationAddress partner')
      .sort('-createdAt');
    return successResponse(res, 200, 'Bookings retrieved', { bookings });
  } catch (error) {
    next(error);
  }
};

const getBookingById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const booking = await Order.findOne({ _id: id, customer: req.user._id })
      .populate('service pickupAddress destinationAddress partner');
    if (!booking) return errorResponse(res, 404, 'Booking not found');

    return successResponse(res, 200, 'Booking retrieved', { booking });
  } catch (error) {
    next(error);
  }
};

const cancelBooking = async (req, res, next) => {
  try {
    const { id } = req.params;
    const booking = await Order.findOne({ _id: id, customer: req.user._id });
    if (!booking) return errorResponse(res, 404, 'Booking not found');

    if (booking.status === 'completed' || booking.status === 'cancelled') {
        return errorResponse(res, 400, 'Cannot cancel this booking');
    }

    const oldStatus = booking.status;
    booking.status = 'cancelled';
    await booking.save();

    await OrderStatusHistory.create({
      order: booking._id,
      oldStatus,
      newStatus: 'cancelled',
      actor: req.user._id,
      role: req.user.role.name,
      notes: 'Cancelled by customer',
    });

    return successResponse(res, 200, 'Booking cancelled', { booking });
  } catch (error) {
    next(error);
  }
};

const reorderBooking = async (req, res, next) => {
  try {
    const { id } = req.params;
    const oldBooking = await Order.findOne({ _id: id, customer: req.user._id });
    if (!oldBooking) return errorResponse(res, 404, 'Booking not found');

    const orderId = await generateId('BKG');

    const newBooking = await Order.create({
      orderId,
      customer: req.user._id,
      service: oldBooking.service,
      scheduledDate: new Date(),
      pickupAddress: oldBooking.pickupAddress,
      destinationAddress: oldBooking.destinationAddress,
      amounts: oldBooking.amounts,
      paymentMethod: oldBooking.paymentMethod,
      status: 'pending'
    });

    await OrderStatusHistory.create({
      order: newBooking._id,
      newStatus: 'pending',
      actor: req.user._id,
      role: req.user.role.name,
      notes: 'Reordered',
    });

    return successResponse(res, 201, 'Booking reordered', { booking: newBooking });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBooking,
  getBookings,
  getBookingById,
  cancelBooking,
  reorderBooking,
};
