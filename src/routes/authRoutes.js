const express = require('express');
const { register, login, requestOtp, verifyOtpLogin, me } = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/send-otp', requestOtp);
router.post('/verify-otp', verifyOtpLogin);
router.get('/me', authenticate, me);

module.exports = router;
