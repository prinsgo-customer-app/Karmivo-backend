const express = require('express');
const { createOrder, getMyOrders, updateOrderStatus } = require('../controllers/orderController');
const { authenticate, requireRole } = require('../middleware/auth');

const router = express.Router();

router.use(authenticate);

router.post('/', requireRole('CUSTOMER'), createOrder);
router.get('/', getMyOrders);
router.patch('/:orderId/status', updateOrderStatus);

module.exports = router;
