const express = require('express');
const { getSettings, updateSetting, getBanners, createBanner } = require('../controllers/adminController');
const { authenticate, requireRole } = require('../middleware/auth');

const router = express.Router();

router.get('/settings', getSettings);
router.get('/banners', getBanners);

// Admin only routes
router.use(authenticate);
router.use(requireRole('ADMIN'));

router.put('/settings/:key', updateSetting);
router.post('/banners', createBanner);

module.exports = router;
