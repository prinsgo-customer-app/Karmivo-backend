const AppSetting = require('../models/AppSetting');
const Banner = require('../models/Banner');
const AuditLog = require('../models/AuditLog');
const { successResponse, errorResponse } = require('../utils/response');

const getSettings = async (req, res, next) => {
  try {
    const settings = await AppSetting.find();
    return successResponse(res, 200, 'Settings retrieved', { settings });
  } catch (error) {
    next(error);
  }
};

const updateSetting = async (req, res, next) => {
  try {
    const { key } = req.params;
    const { value } = req.body;

    const setting = await AppSetting.findOneAndUpdate(
      { key },
      { value },
      { new: true, upsert: true }
    );

    // Create Audit Log
    if (req.user) {
       await AuditLog.create({
         actor: req.user._id,
         role: req.user.role.name,
         action: 'UPDATE_SETTING',
         module: 'SETTINGS',
         targetId: setting._id,
         afterData: { key, value },
       });
    }

    return successResponse(res, 200, 'Setting updated', { setting });
  } catch (error) {
    next(error);
  }
};

const getBanners = async (req, res, next) => {
  try {
    const filter = { active: true };
    const now = new Date();
    // Simplified active banner logic
    const banners = await Banner.find(filter).sort('sortOrder');
    return successResponse(res, 200, 'Banners retrieved', { banners });
  } catch (error) {
    next(error);
  }
};

const createBanner = async (req, res, next) => {
  try {
    const banner = await Banner.create(req.body);
    return successResponse(res, 201, 'Banner created', { banner });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSettings,
  updateSetting,
  getBanners,
  createBanner,
};
