const { verifyToken } = require('../utils/jwt');
const User = require('../models/User');
const Role = require('../models/Role');
const { errorResponse } = require('../utils/response');

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse(res, 401, 'Authentication failed', 'UNAUTHORIZED');
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId).populate('role');
    if (!user) {
      return errorResponse(res, 401, 'User not found', 'UNAUTHORIZED');
    }

    if (user.status !== 'ACTIVE' && user.status !== 'PENDING') {
       return errorResponse(res, 403, 'Account is not active', 'ACCOUNT_INACTIVE');
    }

    req.user = user;
    next();
  } catch (error) {
    return errorResponse(res, 401, 'Invalid or expired token', 'UNAUTHORIZED');
  }
};

const requireRole = (roleNames) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return errorResponse(res, 403, 'Access denied', 'FORBIDDEN');
    }

    const roleArray = Array.isArray(roleNames) ? roleNames : [roleNames];
    if (!roleArray.includes(req.user.role.name)) {
      return errorResponse(res, 403, 'Insufficient permissions', 'FORBIDDEN');
    }

    next();
  };
};

module.exports = {
  authenticate,
  requireRole,
};
