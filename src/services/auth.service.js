/**
 * Auth Service — signup, login, logout, profile operations via Supabase Auth.
 */

const { adminClient } = require('../config/supabase');
const { AppError, NotFoundError } = require('../utils/errors');

/**
 * Register a new user with email + password.
 */
async function signUp({ email, password, firstName, lastName }) {
  const { data, error } = await adminClient.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: firstName,
        last_name: lastName,
      },
    },
  });

  if (error) {
    throw new AppError(error.message, 400);
  }

  return {
    user: data.user,
    session: data.session,
  };
}

/**
 * Sign in with email + password. Returns session with access_token.
 */
async function signIn({ email, password }) {
  const { data, error } = await adminClient.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new AppError(error.message, 401);
  }

  return {
    user: data.user,
    session: data.session,
  };
}

/**
 * Sign out — invalidates the session server-side.
 */
async function signOut(supabase) {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw new AppError(error.message, 500);
  }
}

/**
 * Get current user's profile from the profiles table.
 */
async function getProfile(supabase, userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error || !data) {
    throw new NotFoundError('Profile');
  }

  return data;
}

/**
 * Update current user's profile.
 */
async function updateProfile(supabase, userId, updates) {
  const { data, error } = await supabase
    .from('profiles')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    throw new AppError(error.message, 400);
  }

  return data;
}

module.exports = { signUp, signIn, signOut, getProfile, updateProfile };
