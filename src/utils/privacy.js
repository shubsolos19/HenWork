/**
 * Privacy Utility — Anonymize user profiles based on roles.
 */

/**
 * Anonymize a profile based on user role and requester's status.
 * @param {Object} profile - The profile data from 'profiles' table
 * @param {string} userRole - The role of the user being viewed ('admin' or 'member')
 * @param {boolean} requesterIsAdmin - Whether the requesting user is an organization admin
 * @param {boolean} isSelf - Whether the profile belongs to the requesting user
 * @returns {Object} Anonymized profile
 */
function anonymizeProfile(profile, userRole, requesterIsAdmin, isSelf) {
  const base = {
    id: profile?.id,
    role: userRole,
    isAnonymized: !(requesterIsAdmin || isSelf),
  };

  if (requesterIsAdmin || isSelf) {
    return {
      ...base,
      firstName: profile?.first_name || null,
      first_name: profile?.first_name || null,
      lastName: profile?.last_name || null,
      last_name: profile?.last_name || null,
      avatarUrl: profile?.avatar_url || null,
      avatar_url: profile?.avatar_url || null,
      profile_picture_url: profile?.avatar_url || null,
    };
  }

  // Restricted view: Use role as name, hide avatar
  const roleName = userRole ? (userRole.charAt(0).toUpperCase() + userRole.slice(1)) : 'Member';
  return {
    ...base,
    firstName: roleName,
    first_name: roleName,
    lastName: '',
    last_name: '',
    avatarUrl: null,
    avatar_url: null,
    profile_picture_url: null,
  };
}

module.exports = { anonymizeProfile };
