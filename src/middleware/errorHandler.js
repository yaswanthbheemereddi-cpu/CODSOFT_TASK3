class ApiError extends Error {
  constructor(statusCode, message, errors = []) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  if (err.message && err.message.includes('UNIQUE constraint failed')) {
    return res.status(409).json({
      success: false,
      statusCode: 409,
      error: 'Conflict / Duplicate',
      message: 'A user with this email address already exists.'
    });
  }

  res.status(statusCode).json({
    success: false,
    statusCode,
    error: err.name || 'Error',
    message,
    errors: err.errors || []
  });
}

module.exports = {
  ApiError,
  errorHandler
};
