const express = require('express');
const { getCategories, createCategory } = require('../controllers/serviceController');
const { authenticate, requireRole } = require('../middleware/auth');

const router = express.Router();

router.get('/', getCategories);
router.post('/', authenticate, requireRole('ADMIN'), createCategory);

module.exports = router;
