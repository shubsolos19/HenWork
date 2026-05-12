/**
 * Global error handler middleware.
 *
 * Catches all errors thrown in route handlers and returns a consistent JSON response.
 * In production, stack traces and internal details are hidden.
 */

const config = require('../config/env');
const { AppError } = require('../utils/errors');

// eslint-disable-next-line no-unused-vars
function errorHandler(err, _req, res, _next) {
  // Default values
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let isOperational = err.isOperational || false;

  // Supabase/Postgres errors
  if (err.code && typeof err.code === 'string' && err.code.length === 5) {
    statusCode = 400;
    message = 'Database operation failed';
    isOperational = true;
  }

  // Joi validation errors
  if (err.isJoi) {
    statusCode = 422;
    message = err.details?.map((d) => d.message).join('; ') || 'Validation failed';
    isOperational = true;
  }

  // CORS errors
  if (err.message && err.message.includes('not allowed by CORS')) {
    statusCode = 403;
    isOperational = true;
  }

  // Log non-operational (unexpected) errors
  if (!isOperational) {
    console.error('🔥 UNEXPECTED ERROR:', {
      message: err.message,
      stack: err.stack,
      code: err.code,
    });
  }

  const response = {
    success: false,
    error: message,
    ...(config.isProduction
      ? {}
      : {
          stack: err.stack,
          code: err.code,
        }),
  };

  res.status(statusCode).json(response);
}

module.exports = { errorHandler };
