const mongoose = require('mongoose');
const Wallet = require('../models/Wallet');
const WalletTransaction = require('../models/WalletTransaction');
const PaymentTransaction = require('../models/PaymentTransaction');
const SubscriptionPlan = require('../models/SubscriptionPlan');
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

const getWalletTransactions = async (req, res, next) => {
  try {
    const wallet = await Wallet.findOne({ user: req.user._id });
    if (!wallet) return errorResponse(res, 404, 'Wallet not found');

    const transactions = await WalletTransaction.find({ wallet: wallet._id }).sort('-createdAt');
    return successResponse(res, 200, 'Wallet transactions retrieved', { transactions });
  } catch (error) {
    next(error);
  }
};

const processPaymentWebhook = async (req, res, next) => {
  try {
    const { transactionId, status, gatewayReference } = req.body;

    const payment = await PaymentTransaction.findOne({ transactionId });
    if (!payment) return errorResponse(res, 404, 'Payment transaction not found');

    payment.status = status;
    payment.gatewayReference = gatewayReference;
    await payment.save();

    return successResponse(res, 200, 'Payment webhook processed');
  } catch (error) {
    next(error);
  }
};

const getSubscriptions = async (req, res, next) => {
  try {
    const plans = await SubscriptionPlan.find({ active: true });
    return successResponse(res, 200, 'Subscription plans retrieved', { plans });
  } catch (error) {
    next(error);
  }
};

const creditWallet = async (req, res, next) => {
    // Demonstration of MongoDB Transaction
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { amount, description } = req.body;

        let wallet = await Wallet.findOne({ user: req.user._id }).session(session);
        if (!wallet) {
           wallet = await Wallet.create([{ user: req.user._id }], { session });
           wallet = wallet[0];
        }

        const transactionId = await generateId('WTX');
        await WalletTransaction.create([{
            transactionId,
            wallet: wallet._id,
            type: 'CREDIT',
            amount,
            description,
            status: 'COMPLETED'
        }], { session });

        wallet.balance += amount;
        wallet.withdrawableBalance += amount;
        await wallet.save({ session });

        await session.commitTransaction();
        session.endSession();

        return successResponse(res, 200, 'Wallet credited', { wallet });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        next(error);
    }
}

module.exports = {
  getWallet,
  getWalletTransactions,
  processPaymentWebhook,
  getSubscriptions,
  creditWallet,
};
