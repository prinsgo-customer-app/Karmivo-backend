const express = require('express');
const { getCategories, getServices, createCategory, createService } = require('../controllers/serviceController');
const { authenticate, requireRole } = require('../middleware/auth');

const router = express.Router();

router.get('/categories', getCategories);
router.get('/', getServices);

// Admin only routes
router.post('/categories', authenticate, requireRole('ADMIN'), createCategory);
router.post('/', authenticate, requireRole('ADMIN'), createService);

module.exports = router;
