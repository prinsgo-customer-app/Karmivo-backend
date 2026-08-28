const AppSetting = require('../models/AppSetting');
const { successResponse } = require('../utils/response');

const getConfig = async (req, res, next) => {
  try {
    const settings = await AppSetting.find();
    const config = {};
    settings.forEach(setting => {
      config[setting.key] = setting.value;
    });

    const defaultConfig = {
      branding: config.branding || {},
      logo: config.logo || 'https://via.placeholder.com/150',
      primaryColor: config.primaryColor || '#000000',
      secondaryColor: config.secondaryColor || '#ffffff',
      appName: config.appName || 'Karmivo',
      maintenanceMode: config.maintenanceMode || false,
      supportPhone: config.supportPhone || '+1234567890',
      supportEmail: config.supportEmail || 'support@karmivo.com',
      customerSettings: config.customerSettings || {},
      enabledServices: config.enabledServices || [],
      languageSettings: config.languageSettings || {},
      referralConfiguration: config.referralConfiguration || {},
      walletConfiguration: config.walletConfiguration || {},
      featureFlags: config.featureFlags || {}
    };

    return successResponse(res, 200, 'Config retrieved', { ...defaultConfig, ...config });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getConfig,
};
