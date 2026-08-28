const Banner = require('../models/Banner');
const { successResponse } = require('../utils/response');

const getHome = async (req, res, next) => {
  try {
    const banners = await Banner.find({ active: true }).sort('sortOrder');
    return successResponse(res, 200, 'Home data retrieved', { banners });
  } catch (error) {
    next(error);
  }
};

const getBanners = async (req, res, next) => {
  try {
    const banners = await Banner.find({ active: true }).sort('sortOrder');
    return successResponse(res, 200, 'Banners retrieved', { banners });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getHome,
  getBanners,
};
