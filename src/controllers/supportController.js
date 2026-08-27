const SupportTicket = require('../models/SupportTicket');
const AppSetting = require('../models/AppSetting');
const { generateId } = require('../utils/idGenerator');
const { successResponse, errorResponse } = require('../utils/response');

const getSupportInfo = async (req, res, next) => {
  try {
    const settings = await AppSetting.find({ key: { $in: ['supportPhone', 'supportEmail'] } });
    const info = { phone: '+1234567890', email: 'support@karmivo.com' };
    settings.forEach(s => {
      if (s.key === 'supportPhone') info.phone = s.value;
      if (s.key === 'supportEmail') info.email = s.value;
    });
    return successResponse(res, 200, 'Support info retrieved', { support: info });
  } catch (error) {
    next(error);
  }
};

const createTicket = async (req, res, next) => {
  try {
    const { subject, description } = req.body;
    const ticketId = await generateId('TKT');
    const ticket = await SupportTicket.create({
      ticketId,
      user: req.user._id,
      subject,
      description
    });
    return successResponse(res, 201, 'Ticket created', { ticket });
  } catch (error) {
    next(error);
  }
};

const getTickets = async (req, res, next) => {
  try {
    const tickets = await SupportTicket.find({ user: req.user._id }).sort('-createdAt');
    return successResponse(res, 200, 'Tickets retrieved', { tickets });
  } catch (error) {
    next(error);
  }
};

const getTicketById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const ticket = await SupportTicket.findOne({ _id: id, user: req.user._id });
    if (!ticket) return errorResponse(res, 404, 'Ticket not found');
    return successResponse(res, 200, 'Ticket retrieved', { ticket });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSupportInfo,
  createTicket,
  getTickets,
  getTicketById,
};
