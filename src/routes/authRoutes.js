const express = require('express');
const { register, login, requestOtp, verifyOtpLogin, me } = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/otp/request', requestOtp);
router.post('/otp/verify', verifyOtpLogin);
router.get('/me', authenticate, me);

module.exports = router;
