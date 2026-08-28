const Wallet = require('../models/Wallet');
const WalletTransaction = require('../models/WalletTransaction');
const { generateId } = require('../utils/idGenerator');
const { successResponse, errorResponse } = require('../utils/response');

const getWallet = async (req, res, next) => {
  try {
    let wallet = await Wallet.findOne({ user: req.user._id });
    if (!wallet) {
      wallet = await Wallet.create({ user: req.user._id });
    }
    return successResponse(res, 200, 'Wallet retrieved', { wallet });
  } catch (error) {
    next(error);
  }
};

const getTransactions = async (req, res, next) => {
  try {
    let wallet = await Wallet.findOne({ user: req.user._id });
    if (!wallet) {
      wallet = await Wallet.create({ user: req.user._id });
    }
    const transactions = await WalletTransaction.find({ wallet: wallet._id }).sort('-createdAt');
    return successResponse(res, 200, 'Transactions retrieved', { transactions });
  } catch (error) {
    next(error);
  }
};

const addMoney = async (req, res, next) => {
  try {
    const { amount, paymentReferenceId } = req.body;
    if (amount <= 0) return errorResponse(res, 400, 'Invalid amount');

    let wallet = await Wallet.findOne({ user: req.user._id });
    if (!wallet) {
      wallet = await Wallet.create({ user: req.user._id });
    }

    const transactionId = await generateId('TXN');

    const transaction = await WalletTransaction.create({
      transactionId,
      wallet: wallet._id,
      type: 'CREDIT',
      amount,
      referenceId: paymentReferenceId,
      description: 'Added money to wallet',
      status: 'COMPLETED'
    });

    wallet.balance += amount;
    await wallet.save();

    return successResponse(res, 200, 'Money added to wallet', { wallet, transaction });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getWallet,
  getTransactions,
  addMoney,
};
