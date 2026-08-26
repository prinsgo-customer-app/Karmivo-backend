const successResponse = (res, statusCode, message, data = {}) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

const errorResponse = (res, statusCode, message, errorCode = 'ERROR', details = null) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errorCode,
    details,
  });
};

module.exports = {
  successResponse,
  errorResponse,
};
