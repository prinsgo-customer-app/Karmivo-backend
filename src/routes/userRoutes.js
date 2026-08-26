const express = require('express');
const { getCustomerProfile, updateCustomerProfile } = require('../controllers/userController');
const { authenticate, requireRole } = require('../middleware/auth');

const router = express.Router();

router.use(authenticate);

router.get('/customer/profile', requireRole('CUSTOMER'), getCustomerProfile);
router.put('/customer/profile', requireRole('CUSTOMER'), updateCustomerProfile);

module.exports = router;
