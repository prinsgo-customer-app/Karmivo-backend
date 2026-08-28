const express = require('express');
const { getServices, getServiceById, createService } = require('../controllers/serviceController');
const { authenticate, requireRole } = require('../middleware/auth');

const router = express.Router();

router.get('/', getServices);
router.get('/:id', getServiceById);

// Admin only routes
router.post('/', authenticate, requireRole('ADMIN'), createService);

module.exports = router;
