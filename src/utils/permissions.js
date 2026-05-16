/**
 * Permission & membership verification utilities.
 *
 * Every function either returns the relevant record or throws a ForbiddenError / NotFoundError.
 * Uses the user-scoped Supabase client (req.supabase) so RLS is also enforced at the DB level.
 */

const { ForbiddenError, NotFoundError } = require('./errors');

// ── Organization membership ────────────────────────────

/**
 * Verify user is a member of the organization. Returns the membership record.
 */
async function verifyOrgMembership(supabase, userId, orgId) {
  const { data, error } = await supabase
    .from('organization_members')
    .select('*')
    .eq('organization_id', orgId)
    .eq('user_id', userId)
    .single();

  if (error || !data) {
    throw new ForbiddenError('You are not a member of this organization');
  }

  return data;
}

/**
 * Verify user is an admin of the organization. Returns the membership record.
 */
async function verifyOrgAdmin(supabase, userId, orgId) {
  const membership = await verifyOrgMembership(supabase, userId, orgId);

  if (membership.role !== 'admin') {
    throw new ForbiddenError('Admin privileges required for this action');
  }

  return membership;
}

/**
 * Verify user is the owner of the organization.
 */
async function verifyOrgOwner(supabase, userId, orgId) {
  const { data, error } = await supabase
    .from('organizations')
    .select('*')
    .eq('id', orgId)
    .eq('owner_id', userId)
    .single();

  if (error || !data) {
    throw new ForbiddenError('Only the organization owner can perform this action');
  }

  return data;
}

// ── Project access ─────────────────────────────────────

/**
 * Verify user has access to the project (is member of the project's organization).
 * Returns { project, membership }.
 */
async function verifyProjectAccess(supabase, userId, projectId) {
  const { data: project, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', projectId)
    .single();

  if (error || !project) {
    throw new NotFoundError('Project');
  }

  const membership = await verifyOrgMembership(supabase, userId, project.organization_id);

  return { project, membership };
}

// ── Task access ────────────────────────────────────────

/**
 * Verify user has access to the task (member of the task's project's organization).
 * Returns { task, project, membership }.
 */
async function verifyTaskAccess(supabase, userId, taskId) {
  const { data: task, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('id', taskId)
    .single();

  if (error || !task) {
    throw new NotFoundError('Task');
  }

  const { project, membership } = await verifyProjectAccess(supabase, userId, task.project_id);

  return { task, project, membership };
}

/**
 * Verify user is the creator of the task.
 */
async function verifyTaskCreator(supabase, userId, taskId) {
  const { task, project, membership } = await verifyTaskAccess(supabase, userId, taskId);

  if (task.created_by_id !== userId) {
    throw new ForbiddenError('Only the task creator can perform this action');
  }

  return { task, project, membership };
}

// ── Comment access ─────────────────────────────────────

/**
 * Verify user is the author of the comment.
 */
async function verifyCommentAuthor(supabase, userId, commentId) {
  const { data: comment, error } = await supabase
    .from('task_comments')
    .select('*')
    .eq('id', commentId)
    .single();

  if (error || !comment) {
    throw new NotFoundError('Comment');
  }

  if (comment.user_id !== userId) {
    throw new ForbiddenError('Only the comment author can perform this action');
  }

  return comment;
}

/**
 * Verify user can manage task assignments (creator or org admin).
 */
async function verifyTaskAssignmentManager(supabase, userId, taskId) {
  const { task, project, membership } = await verifyTaskAccess(supabase, userId, taskId);

  const isCreator = task.created_by_id === userId;
  const isAdmin = membership.role === 'admin';

  if (!isCreator && !isAdmin) {
    throw new ForbiddenError('Only the task creator or an organization admin can manage assignments');
  }

  return { task, project, membership };
}

module.exports = {
  verifyOrgMembership,
  verifyOrgAdmin,
  verifyOrgOwner,
  verifyProjectAccess,
  verifyTaskAccess,
  verifyTaskCreator,
  verifyTaskAssignmentManager,
  verifyCommentAuthor,
};
