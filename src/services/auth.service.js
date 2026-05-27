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

  // Map avatar_url to profile_picture_url for frontend
  return {
    ...data,
    profile_picture_url: data.avatar_url,
  };
}

/**
 * Update current user's profile.
 */
async function updateProfile(supabase, userId, updates) {
  // Map profile_picture_url to avatar_url if provided
  const dbUpdates = { ...updates };
  if ('profile_picture_url' in dbUpdates) {
    dbUpdates.avatar_url = dbUpdates.profile_picture_url;
    delete dbUpdates.profile_picture_url;
  }

  const { data, error } = await supabase
    .from('profiles')
    .update({
      ...dbUpdates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    throw new AppError(error.message, 400);
  }

  return {
    ...data,
    profile_picture_url: data.avatar_url,
  };
}

/**
 * Sync Google profile picture after OAuth.
 */
async function syncGoogleProfile(user) {
  const metadata = user.user_metadata || {};
  const googlePic = metadata.picture || metadata.avatar_url;
  
  if (!googlePic) {
    return; // No google picture to sync
  }

  // Try to get existing profile
  const { data: profile } = await adminClient
    .from('profiles')
    .select('id, avatar_url')
    .eq('id', user.id)
    .single();

  const fullName = metadata.full_name || metadata.name || '';
  const firstName = metadata.first_name || fullName.split(' ')[0] || 'Member';
  const lastName = metadata.last_name || fullName.split(' ').slice(1).join(' ') || '';

  if (!profile) {
    // New user profile creation using adminClient
    await adminClient.from('profiles').insert({
      id: user.id,
      first_name: firstName,
      last_name: lastName,
      avatar_url: googlePic,
      updated_at: new Date().toISOString()
    });
  } else {
    // Existing user
    // We only update if they don't have an avatar or if their current avatar is from Google.
    // This prevents overwriting a custom uploaded avatar (which would be a Supabase storage URL).
    const isGooglePhoto = profile.avatar_url?.includes('googleusercontent.com');
    const hasNoPhoto = !profile.avatar_url;

    if ((hasNoPhoto || isGooglePhoto) && profile.avatar_url !== googlePic) {
      await adminClient.from('profiles').update({
        avatar_url: googlePic,
        updated_at: new Date().toISOString()
      }).eq('id', user.id);
    }
  }
}

module.exports = { signUp, signIn, signOut, getProfile, updateProfile, syncGoogleProfile };
