const Grievance = require('../models/Grievance');
const Withdrawal = require('../models/Withdrawal');
const Offer = require('../models/Offer');
const Document = require('../models/Document');
const { generateId } = require('../utils/idGenerator');
const { successResponse, errorResponse } = require('../utils/response');

const createGrievance = async (req, res, next) => {
  try {
    const { subject, description, orderId } = req.body;
    const grievanceId = await generateId('GRV');
    const grievance = await Grievance.create({
      grievanceId,
      user: req.user._id,
      order: orderId,
      subject,
      description,
    });
    return successResponse(res, 201, 'Grievance created', { grievance });
  } catch (error) {
    next(error);
  }
};

const getGrievances = async (req, res, next) => {
  try {
    const grievances = await Grievance.find({ user: req.user._id });
    return successResponse(res, 200, 'Grievances retrieved', { grievances });
  } catch (error) {
    next(error);
  }
};

const requestWithdrawal = async (req, res, next) => {
  try {
    const { amount } = req.body;
    if (req.user.role.name !== 'PARTNER') {
        return errorResponse(res, 403, 'Only partners can request withdrawal');
    }
    const withdrawalId = await generateId('WDL');
    const withdrawal = await Withdrawal.create({
      withdrawalId,
      partner: req.user._id,
      amount,
    });
    return successResponse(res, 201, 'Withdrawal requested', { withdrawal });
  } catch (error) {
    next(error);
  }
};

const getOffers = async (req, res, next) => {
  try {
    const offers = await Offer.find({ active: true, endDate: { $gt: new Date() } });
    return successResponse(res, 200, 'Offers retrieved', { offers });
  } catch (error) {
    next(error);
  }
};

const uploadDocument = async (req, res, next) => {
    try {
      const { type } = req.body;

      if (!req.file) {
          return errorResponse(res, 400, 'File is required');
      }

      const fileUrl = `/uploads/${req.file.filename}`; // Real path in production (S3/GCS)

      const documentId = await generateId('DOC');
      const document = await Document.create({
        documentId,
        user: req.user._id,
        type,
        fileUrl,
      });
      return successResponse(res, 201, 'Document uploaded', { document });
    } catch (error) {
      next(error);
    }
};

module.exports = {
  createGrievance,
  getGrievances,
  requestWithdrawal,
  getOffers,
  uploadDocument,
};
