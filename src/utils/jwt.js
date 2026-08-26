const jwt = require('jsonwebtoken');

const generateTokens = (userId, roleId) => {
  const payload = { userId, roleId };

  const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

  const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: '30d',
  });

  return { accessToken, refreshToken };
};

const verifyToken = (token, secret) => {
  return jwt.verify(token, secret);
};

module.exports = {
  generateTokens,
  verifyToken,
};
