/**
 * JWT Authentication Middleware.
 *
 * Extracts Bearer token from the Authorization header, verifies it via
 * Supabase Auth, and attaches `req.user` and `req.supabase` (user-scoped client).
 */

const { adminClient, createUserClient } = require('../config/supabase');
const { AppError } = require('../utils/errors');

async function authenticate(req, _res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('Missing or malformed Authorization header. Expected: Bearer <token>', 401);
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new AppError('No token provided', 401);
    }

    // Verify the JWT using Supabase Admin client
    const { data: { user }, error } = await adminClient.auth.getUser(token);

    if (error || !user) {
      throw new AppError('Invalid or expired token', 401);
    }

    // Attach user info and a user-scoped Supabase client to the request
    req.user = {
      id: user.id,
      email: user.email,
      firstName: user.user_metadata?.first_name || null,
      lastName: user.user_metadata?.last_name || null,
    };
    req.token = token;
    req.supabase = createUserClient(token);

    next();
  } catch (err) {
    if (err instanceof AppError) return next(err);
    next(new AppError('Authentication failed', 401));
  }
}

module.exports = { authenticate };
