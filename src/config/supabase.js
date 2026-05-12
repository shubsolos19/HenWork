/**
 * Supabase client factory.
 *
 * - adminClient: uses SERVICE_ROLE_KEY, bypasses RLS — for admin lookups (e.g. find user by email).
 * - createUserClient(token): creates a client scoped to a specific user's JWT — RLS enforced.
 */

const { createClient } = require('@supabase/supabase-js');
const config = require('./env');

// ── Admin client (bypasses RLS) ──────────────────────
const adminClient = createClient(config.supabase.url, config.supabase.serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// ── User-scoped client (RLS enforced) ────────────────
function createUserClient(accessToken) {
  return createClient(config.supabase.url, config.supabase.anonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

module.exports = { adminClient, createUserClient };
