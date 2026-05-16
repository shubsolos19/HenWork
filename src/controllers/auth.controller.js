const authService = require('../services/auth.service');
const { success, created } = require('../utils/response');

exports.signUp = async (req, res, next) => {
  try {
    const data = await authService.signUp(req.body);
    return created(res, data);
  } catch (err) { next(err); }
};

exports.signIn = async (req, res, next) => {
  try {
    const data = await authService.signIn(req.body);
    return success(res, data);
  } catch (err) { next(err); }
};

exports.signOut = async (req, res, next) => {
  try {
    await authService.signOut(req.supabase);
    return success(res, { message: 'Signed out successfully' });
  } catch (err) { next(err); }
};

exports.getMe = async (req, res, next) => {
  try {
    const profile = await authService.getProfile(req.supabase, req.user.id);
    return success(res, { user: req.user, profile });
  } catch (err) { next(err); }
};

exports.updateMe = async (req, res, next) => {
  try {
    const profile = await authService.updateProfile(req.supabase, req.user.id, req.body);
    return success(res, profile);
  } catch (err) { next(err); }
};

exports.syncProfile = async (req, res, next) => {
  try {
    // Sync Google profile logic utilizing adminClient
    await authService.syncGoogleProfile(req.user);
    return success(res, { message: 'Profile synced' });
  } catch (err) { next(err); }
};
