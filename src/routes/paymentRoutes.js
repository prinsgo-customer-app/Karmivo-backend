const express = require('express');
const { getWallet, getWalletTransactions, processPaymentWebhook, getSubscriptions, creditWallet } = require('../controllers/paymentController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.get('/wallet', authenticate, getWallet);
router.get('/wallet/transactions', authenticate, getWalletTransactions);
router.post('/webhook', processPaymentWebhook);
router.get('/subscriptions', getSubscriptions);
router.post('/wallet/credit', authenticate, creditWallet);

module.exports = router;
