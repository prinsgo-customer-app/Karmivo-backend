const User = require('../models/User');
const Role = require('../models/Role');
const CustomerProfile = require('../models/CustomerProfile');
const PartnerProfile = require('../models/PartnerProfile');
const { generateTokens } = require('../utils/jwt');
const { generateId } = require('../utils/idGenerator');
const { successResponse, errorResponse } = require('../utils/response');
const { sendOTP, verifyOTP } = require('../services/otpService');
const bcrypt = require('bcryptjs');

const requestOtp = async (req, res, next) => {
  try {
    const { mobile, email } = req.body;
    if (!mobile && !email) {
      return errorResponse(res, 400, 'Mobile or email required');
    }

    if (mobile) await sendOTP(mobile, 'mobile');
    if (email) await sendOTP(email, 'email');

    return successResponse(res, 200, 'OTP sent successfully');
  } catch (error) {
    next(error);
  }
};

const verifyOtpLogin = async (req, res, next) => {
  try {
    const { mobile, email, otp } = req.body;

    let result;
    if (mobile) result = await verifyOTP(mobile, 'mobile', otp);
    else if (email) result = await verifyOTP(email, 'email', otp);

    if (!result || !result.success) {
      return errorResponse(res, 400, result ? result.message : 'Invalid request');
    }

    let user;
    if (mobile) user = await User.findOne({ mobile }).populate('role');
    else if (email) user = await User.findOne({ email }).populate('role');

    if (!user) {
      return errorResponse(res, 404, 'User not found. Please register first.');
    }

    user.lastLogin = new Date();
    await user.save();

    const tokens = generateTokens(user._id, user.role._id);

    return successResponse(res, 200, 'Login successful', {
      user: { id: user._id, mobile: user.mobile, email: user.email, role: user.role.name },
      tokens,
    });
  } catch (error) {
    next(error);
  }
};

const register = async (req, res, next) => {
  try {
    const { mobile, email, roleName, firstName, lastName, password } = req.body;

    if (!mobile && !email) {
      return errorResponse(res, 400, 'Mobile or email is required', 'VALIDATION_ERROR');
    }
    if (!password) {
      return errorResponse(res, 400, 'Password is required', 'VALIDATION_ERROR');
    }

    const role = await Role.findOne({ name: roleName.toUpperCase() });
    if (!role) {
      return errorResponse(res, 400, 'Invalid role', 'VALIDATION_ERROR');
    }

    let existingUser = null;
    if (mobile) existingUser = await User.findOne({ mobile });
    if (!existingUser && email) existingUser = await User.findOne({ email });

    if (existingUser) {
      return errorResponse(res, 409, 'User already exists', 'USER_EXISTS');
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      mobile,
      email,
      password: hashedPassword,
      role: role._id,
      status: 'ACTIVE',
    });

    if (role.name === 'CUSTOMER') {
      const customerId = await generateId('CUS');
      await CustomerProfile.create({
        user: user._id,
        customerId,
        firstName,
        lastName,
      });
    } else if (role.name === 'PARTNER') {
      const partnerId = await generateId('PAR');
      await PartnerProfile.create({
        user: user._id,
        partnerId,
        firstName,
        lastName,
      });
    }

    const tokens = generateTokens(user._id, role._id);

    return successResponse(res, 201, 'User registered successfully', {
      user: { id: user._id, mobile, email, role: role.name },
      tokens,
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { mobile, email, password } = req.body;
    if (!password) {
        return errorResponse(res, 400, 'Password is required', 'VALIDATION_ERROR');
    }

    let user;
    if (mobile) user = await User.findOne({ mobile }).select('+password').populate('role');
    else if (email) user = await User.findOne({ email }).select('+password').populate('role');

    if (!user) {
      return errorResponse(res, 404, 'User not found', 'NOT_FOUND');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
       return errorResponse(res, 401, 'Invalid credentials', 'UNAUTHORIZED');
    }

    if (user.status !== 'ACTIVE' && user.status !== 'PENDING') {
      return errorResponse(res, 403, 'Account is not active', 'ACCOUNT_INACTIVE');
    }

    user.lastLogin = new Date();
    await user.save();

    const tokens = generateTokens(user._id, user.role._id);

    return successResponse(res, 200, 'Login successful', {
      user: { id: user._id, mobile: user.mobile, email: user.email, role: user.role.name },
      tokens,
    });
  } catch (error) {
    next(error);
  }
};

const me = async (req, res, next) => {
  try {
    const user = req.user;
    let profile = null;

    if (user.role.name === 'CUSTOMER') {
      profile = await CustomerProfile.findOne({ user: user._id });
    } else if (user.role.name === 'PARTNER') {
      profile = await PartnerProfile.findOne({ user: user._id });
    }

    return successResponse(res, 200, 'User profile retrieved', { user, profile });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  requestOtp,
  verifyOtpLogin,
  me,
};
