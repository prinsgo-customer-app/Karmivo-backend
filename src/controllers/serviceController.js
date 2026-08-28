const ServiceCategory = require('../models/ServiceCategory');
const Service = require('../models/Service');
const { successResponse, errorResponse } = require('../utils/response');

const getCategories = async (req, res, next) => {
  try {
    const categories = await ServiceCategory.find({ active: true }).sort('sortOrder');
    return successResponse(res, 200, 'Categories retrieved', { categories });
  } catch (error) {
    next(error);
  }
};

const getServiceById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const service = await Service.findById(id).populate('category');
    if (!service) {
        return errorResponse(res, 404, 'Service not found');
    }
    return successResponse(res, 200, 'Service retrieved', { service });
  } catch (error) {
    next(error);
  }
};

const getServices = async (req, res, next) => {
  try {
    const { categoryId } = req.query;
    const filter = { active: true };
    if (categoryId) {
      filter.category = categoryId;
    }
    const services = await Service.find(filter).populate('category');
    return successResponse(res, 200, 'Services retrieved', { services });
  } catch (error) {
    next(error);
  }
};

const createCategory = async (req, res, next) => {
  try {
    const category = await ServiceCategory.create(req.body);
    return successResponse(res, 201, 'Category created', { category });
  } catch (error) {
    next(error);
  }
};

const createService = async (req, res, next) => {
  try {
    const service = await Service.create(req.body);
    return successResponse(res, 201, 'Service created', { service });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCategories,
  getServices,
  getServiceById,
  createCategory,
  createService,
};
