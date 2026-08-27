const express = require('express');
const { getWallet, getTransactions, addMoney } = require('../controllers/walletController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.use(authenticate);

router.get('/', getWallet);
router.get('/transactions', getTransactions);
router.post('/add-money', addMoney);

module.exports = router;
