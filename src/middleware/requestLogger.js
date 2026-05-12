/**
 * Request logging middleware.
 *
 * - Development: colored concise output (morgan 'dev')
 * - Production:  structured combined format for log aggregation
 */

const morgan = require('morgan');
const config = require('../config/env');

const requestLogger = config.isProduction
  ? morgan('combined')
  : morgan('dev');

module.exports = { requestLogger };
