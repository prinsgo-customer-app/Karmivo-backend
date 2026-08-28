const express = require('express');
const { getReferralInfo, applyReferral } = require('../controllers/referralController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.use(authenticate);

router.get('/', getReferralInfo);
router.post('/apply', applyReferral);

module.exports = router;
