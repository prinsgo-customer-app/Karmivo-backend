const express = require('express');
const { requestOtp, verifyOtpLogin, me, goOnline, goOffline, getNearbyJobs, acceptJob, pickupJob, completeJob, getJobById, getEarnings, getEarningsSummary } = require('../controllers/workerController');
const { authenticate, requireRole } = require('../middleware/auth');

const router = express.Router();

// Worker Auth
router.post('/auth/send-otp', requestOtp);
router.post('/auth/verify-otp', verifyOtpLogin);

// Protected routes
router.use(authenticate);
router.use(requireRole('PARTNER')); // Ensure only workers can access

router.get('/me', me);
router.post('/online', goOnline);
router.post('/offline', goOffline);

router.get('/jobs/nearby', getNearbyJobs);
router.get('/jobs/:id', getJobById);
router.post('/jobs/:id/accept', acceptJob);
router.post('/jobs/:id/pickup', pickupJob);
router.post('/jobs/:id/complete', completeJob);

router.get('/earnings', getEarnings);
router.get('/earnings/summary', getEarningsSummary);

const { getWallet, getTransactions } = require('../controllers/walletController');
router.get('/wallet', getWallet);
router.get('/wallet/transactions', getTransactions);

module.exports = router;
