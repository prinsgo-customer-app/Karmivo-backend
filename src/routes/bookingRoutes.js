const express = require('express');
const { createBooking, getBookings, getBookingById, cancelBooking, reorderBooking } = require('../controllers/bookingController');
const { authenticate } = require('../middleware/auth');
const reviewRoutes = require('./reviewRoutes');

const router = express.Router();

router.use(authenticate);

router.post('/', createBooking);
router.get('/', getBookings);
router.get('/:id', getBookingById);
router.post('/:id/cancel', cancelBooking);
router.post('/:id/reorder', reorderBooking);

router.use('/:id/review', reviewRoutes);

module.exports = router;
