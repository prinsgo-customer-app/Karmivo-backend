const Order = require('../models/Order');
const OrderStatusHistory = require('../models/OrderStatusHistory');
const Service = require('../models/Service');
const { generateId } = require('../utils/idGenerator');
const { successResponse, errorResponse } = require('../utils/response');

const createOrder = async (req, res, next) => {
  try {
    const { serviceId, scheduledDate, serviceAddress, paymentMethod } = req.body;

    const service = await Service.findById(serviceId);
    if (!service) return errorResponse(res, 404, 'Service not found');

    const totalAmount = service.basePrice;
    let partnerAmount = totalAmount;
    let platformFee = 0;

    if (service.commissionRules) {
        if (service.commissionRules.type === 'PERCENTAGE') {
            platformFee = (totalAmount * service.commissionRules.value) / 100;
        } else if (service.commissionRules.type === 'FIXED') {
            platformFee = service.commissionRules.value;
        }
        partnerAmount = totalAmount - platformFee;
    }

    const orderId = await generateId('ORD');

    const order = await Order.create({
      orderId,
      customer: req.user._id,
      service: service._id,
      scheduledDate,
      serviceAddress,
      amounts: {
        servicePrice: service.basePrice,
        platformFee,
        partnerAmount,
        totalAmount,
      },
      paymentMethod,
    });

    await OrderStatusHistory.create({
      order: order._id,
      newStatus: 'REQUESTED',
      actor: req.user._id,
      role: req.user.role.name,
      notes: 'Order created',
    });

    return successResponse(res, 201, 'Order created successfully', { order });
  } catch (error) {
    next(error);
  }
};

const getMyOrders = async (req, res, next) => {
  try {
    const isCustomer = req.user.role.name === 'CUSTOMER';
    const filter = isCustomer ? { customer: req.user._id } : { partner: req.user._id };

    const orders = await Order.find(filter).populate('service').sort('-createdAt');
    return successResponse(res, 200, 'Orders retrieved', { orders });
  } catch (error) {
    next(error);
  }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { newStatus, reason, notes } = req.body;

    const order = await Order.findById(orderId);
    if (!order) return errorResponse(res, 404, 'Order not found');

    const oldStatus = order.status;
    order.status = newStatus;
    await order.save();

    await OrderStatusHistory.create({
      order: order._id,
      oldStatus,
      newStatus,
      actor: req.user._id,
      role: req.user.role.name,
      reason,
      notes,
    });

    return successResponse(res, 200, 'Order status updated', { order });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  updateOrderStatus,
};
