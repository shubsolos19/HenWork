/**
 * Express application setup.
 * Configures middleware stack and mounts API routes.
 */
const express = require('express');
const helmet = require('helmet');
const corsMiddleware = require('./config/cors');
const { globalLimiter } = require('./middleware/rateLimiter');
const { requestLogger } = require('./middleware/requestLogger');
const { errorHandler } = require('./middleware/errorHandler');
const routes = require('./routes');

const app = express();

// ── Security headers ─────────────────────────────────
app.use(helmet());

// ── CORS ─────────────────────────────────────────────
app.use(corsMiddleware);

// ── Body parsers ─────────────────────────────────────
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// ── Request logging ──────────────────────────────────
app.use(requestLogger);

// ── Rate limiting ────────────────────────────────────
app.use('/api', globalLimiter);

// ── Health check ─────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.status(200).json({
    success: true,
    data: {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    },
  });
});

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
