const express = require('express');
const { createReview, getReview } = require('../controllers/reviewController');
const { authenticate } = require('../middleware/auth');

const router = express.Router({ mergeParams: true });

router.use(authenticate);

router.post('/', createReview);
router.get('/', getReview);

module.exports = router;
