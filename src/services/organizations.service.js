/**
 * Organizations Service — CRUD operations + member management.
 */

const { adminClient } = require('../config/supabase');
const { AppError, NotFoundError, ConflictError } = require('../utils/errors');
const {
  verifyOrgMembership,
  verifyOrgAdmin,
} = require('../utils/permissions');

/**
 * Create a new organization. Creator automatically becomes admin.
 */
async function createOrganization(supabase, userId, { name, description }) {
  // 1. Create the organization
  const { data: org, error: orgError } = await supabase
    .from('organizations')
    .insert({
      name,
      description: description || null,
      owner_id: userId,
    })
    .select()
    .single();

  if (orgError) {
    throw new AppError(orgError.message, 400);
  }

  return org;
}

/**
 * Get all organizations the current user belongs to.
 */
async function getUserOrganizations(supabase, userId) {
  const { data, error } = await supabase
    .from('organization_members')
    .select(`
      role,
      organization:organizations (
        id, name, description, owner_id, created_at, updated_at
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new AppError(error.message, 400);
  }

  // Flatten the structure
  return (data || []).map((row) => ({
    ...row.organization,
    userRole: row.role,
  }));
}

/**
 * Get organization details + current user's role + member count.
 */
async function getOrganizationDetails(supabase, userId, orgId) {
  // Verify membership (throws if not a member)
  const membership = await verifyOrgMembership(supabase, userId, orgId);

  const { data: org, error } = await supabase
    .from('organizations')
    .select('*')
    .eq('id', orgId)
    .single();

  if (error || !org) {
    throw new NotFoundError('Organization');
  }

  // Get member count
  const { count } = await supabase
    .from('organization_members')
    .select('*', { count: 'exact', head: true })
    .eq('organization_id', orgId);

  return {
    ...org,
    userRole: membership.role,
    memberCount: count || 0,
  };
}

/**
 * Update organization (admin only).
 */
async function updateOrganization(supabase, userId, orgId, updates) {
  await verifyOrgAdmin(supabase, userId, orgId);

  const { data, error } = await supabase
    .from('organizations')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', orgId)
    .select()
    .single();

  if (error) {
    throw new AppError(error.message, 400);
  }

  return data;
}

/**
 * Delete organization (owner only).
 */
async function deleteOrganization(supabase, userId, orgId) {
  // verifyOrgOwner is handled by RLS, but we double-check
  const { data: org } = await supabase
    .from('organizations')
    .select('owner_id')
    .eq('id', orgId)
    .single();

  if (!org) throw new NotFoundError('Organization');
  if (org.owner_id !== userId) {
    throw new AppError('Only the organization owner can delete it', 403);
  }

  const { error } = await supabase
    .from('organizations')
    .delete()
    .eq('id', orgId);

  if (error) {
    throw new AppError(error.message, 400);
  }
}

/**
 * Get all members of an organization.
 */
const { anonymizeProfile } = require('../utils/privacy');

async function getOrganizationMembers(supabase, userId, orgId) {
  const membership = await verifyOrgMembership(supabase, userId, orgId);
  const isAdmin = membership.role === 'admin';

  const { data, error } = await supabase
    .from('organization_members')
    .select('id, role, user_id, created_at')
    .eq('organization_id', orgId)
    .order('created_at', { ascending: true });

  if (error) {
    throw new AppError(error.message, 400);
  }

  const enriched = await Promise.all(
    (data || []).map(async (member) => {
      // Get profile
      const { data: profile } = await adminClient
        .from('profiles')
        .select('id, first_name, last_name, avatar_url')
        .eq('id', member.user_id)
        .single();

      const isSelf = member.user_id === userId;
      const profileResult = anonymizeProfile(profile, member.role, isAdmin, isSelf);

      // Only admins/self can see email
      let email = '***@***.***';
      if (isAdmin || isSelf) {
        const { data: { user: authUser } } = await adminClient.auth.admin.getUserById(member.user_id);
        email = authUser?.email || null;
      }

      return {
        id: member.id,
        userId: member.user_id,
        user_id: member.user_id, // Added for frontend compatibility
        role: member.role,
        createdAt: member.created_at,
        email,
        profile: profileResult, // For components using member.profile.first_name
        ...profileResult, // For components using member.firstName
      };
    })
  );

  return enriched;
}

/**
 * Add a member to the organization by email (admin only).
 */
async function addMember(supabase, userId, orgId, { email, role }) {
  await verifyOrgAdmin(supabase, userId, orgId);

  // Find user by email using admin client
  const { data: users, error: userError } = await adminClient.auth.admin.listUsers();
  if (userError) throw new AppError('Failed to look up user', 500);

  let targetUser = users.users.find((u) => u.email === email);
  
  if (!targetUser) {
    // If user doesn't exist, invite them via Supabase Auth
    const { data: invite, error: inviteError } = await adminClient.auth.admin.inviteUserByEmail(email, {
      redirectTo: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard`,
    });
    
    if (inviteError) throw new AppError(inviteError.message, 400);
    targetUser = invite.user;
  }

  // Check if already a member
  const { data: existing } = await supabase
    .from('organization_members')
    .select('id')
    .eq('organization_id', orgId)
    .eq('user_id', targetUser.id)
    .single();

  if (existing) {
    throw new ConflictError('User is already a member of this organization');
  }

  const { data, error } = await supabase
    .from('organization_members')
    .insert({
      organization_id: orgId,
      user_id: targetUser.id,
      role: role || 'member',
    })
    .select()
    .single();

  if (error) {
    throw new AppError(error.message, 400);
  }

  return data;
}

/**
 * Update a member's role (admin only).
 */
async function updateMemberRole(supabase, userId, orgId, memberId, role) {
  await verifyOrgAdmin(supabase, userId, orgId);

  const { data, error } = await supabase
    .from('organization_members')
    .update({ role })
    .eq('id', memberId)
    .eq('organization_id', orgId)
    .select()
    .single();

  if (error || !data) {
    throw new AppError('Failed to update member role', 400);
  }

  return data;
}

/**
 * Remove a member from the organization (admin only).
 */
async function removeMember(supabase, userId, orgId, memberId) {
  await verifyOrgAdmin(supabase, userId, orgId);

  // Prevent removing the organization owner
  const { data: member } = await supabase
    .from('organization_members')
    .select('user_id')
    .eq('id', memberId)
    .single();

  if (!member) throw new NotFoundError('Member');

  const { data: org } = await supabase
    .from('organizations')
    .select('owner_id')
    .eq('id', orgId)
    .single();

  if (org && member.user_id === org.owner_id) {
    throw new AppError('Cannot remove the organization owner', 400);
  }

  const { error } = await supabase
    .from('organization_members')
    .delete()
    .eq('id', memberId)
    .eq('organization_id', orgId);

  if (error) {
    throw new AppError(error.message, 400);
  }
}

module.exports = {
  createOrganization,
  getUserOrganizations,
  getOrganizationDetails,
  updateOrganization,
  deleteOrganization,
  getOrganizationMembers,
  addMember,
  updateMemberRole,
  removeMember,
};
