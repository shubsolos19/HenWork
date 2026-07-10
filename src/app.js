/**
 * Express application setup.
 * Configures middleware stack and mounts API routes.
 * Last restart trigger: anon key fix
 */
const express = require('express');
const helmet = require('helmet');
const corsMiddleware = require('./config/cors');
const { globalLimiter } = require('./middleware/rateLimiter');
const { requestLogger } = require('./middleware/requestLogger');
const { errorHandler } = require('./middleware/errorHandler');
const routes = require('./routes');

const app = express();

// ── Trust Proxy ──────────────────────────────────────
// Required for express-rate-limit to see real client IPs behind Render's load balancer
app.set('trust proxy', 1);

// ── Security headers ─────────────────────────────────
app.use(helmet());

// ── CORS ─────────────────────────────────────────────
app.use(corsMiddleware);

// ── Body parsers ─────────────────────────────────────
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// ── Request logging ──────────────────────────────────
app.use(requestLogger);

// ── Health check ─────────────────────────────────────
// Must be above rate limiter so uptime monitors don't trigger/exhaust it
app.get('/api/health', (_req, res) => {
  res.status(200).json({
    success: true,
    data: {
      status: 'healthy',
      timestamp: new Date().toISOString(),
    },
  });
});

// ── Rate limiting ────────────────────────────────────
app.use('/api', globalLimiter);

// ── API routes ───────────────────────────────────────
app.use('/api', routes);

// ── 404 handler ──────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
  });
});

// ── Global error handler ─────────────────────────────
app.use(errorHandler);

module.exports = app;
