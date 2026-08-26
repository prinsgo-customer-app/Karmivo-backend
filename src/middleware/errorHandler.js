const { errorResponse } = require('../utils/response');

const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  const errorCode = err.errorCode || 'INTERNAL_ERROR';

  // Do not expose stack traces in production
  const details = process.env.NODE_ENV === 'development' ? err.stack : undefined;

  return errorResponse(res, statusCode, message, errorCode, details);
};

module.exports = errorHandler;
