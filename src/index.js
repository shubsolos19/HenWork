/**
 * Server entry point.
 * Loads environment, creates the Express app, and starts listening.
 */
const config = require('./config/env');
const app = require('./app');

const server = app.listen(config.port, () => {
  console.log(`
  ┌─────────────────────────────────────────────────┐
  │                                                 │
  │   🚀 Team Task Manager API                      │
  │                                                 │
  │   Environment : ${config.nodeEnv.padEnd(30)}│
  │   Port        : ${String(config.port).padEnd(30)}│
  │   Health      : http://localhost:${config.port}/api/health   │
  │                                                 │
  └─────────────────────────────────────────────────┘
  `);
});

// Graceful shutdown
function shutdown(signal) {
  console.log(`\n⏹  ${signal} received. Shutting down gracefully...`);
  server.close(() => {
    console.log('   Server closed.');
    process.exit(0);
  });
  // Force exit after 10s
  setTimeout(() => {
    console.error('   Forced shutdown after 10s timeout.');
    process.exit(1);
  }, 10000);
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('unhandledRejection', (err) => {
  console.error('🔥 Unhandled Rejection:', err);
  shutdown('unhandledRejection');
});
