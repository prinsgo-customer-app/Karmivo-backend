const express = require('express');
const { createGrievance, getGrievances, requestWithdrawal, getOffers, uploadDocument } = require('../controllers/interactionController');
const { authenticate, requireRole } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

router.use(authenticate);

router.post('/grievances', createGrievance);
router.get('/grievances', getGrievances);

router.post('/withdrawals', requireRole('PARTNER'), requestWithdrawal);

router.get('/offers', getOffers);

// Use multer for actual file uploading
router.post('/documents', upload.single('document'), uploadDocument);

module.exports = router;
