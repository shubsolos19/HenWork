/**
 * Projects Service — CRUD operations for projects within organizations.
 */

const { AppError, NotFoundError } = require('../utils/errors');
const {
  verifyOrgMembership,
  verifyProjectAccess,
} = require('../utils/permissions');

/**
 * Create a project within an organization.
 */
async function createProject(supabase, userId, orgId, { name, description }) {
  await verifyOrgMembership(supabase, userId, orgId);

  const { data, error } = await supabase
    .from('projects')
    .insert({
      organization_id: orgId,
      name,
      description: description || null,
      owner_id: userId,
    })
    .select()
    .single();

  if (error) {
    throw new AppError(error.message, 400);
  }

  return data;
}

/**
 * Get all projects in an organization.
 */
async function getProjectsByOrganization(supabase, userId, orgId) {
  await verifyOrgMembership(supabase, userId, orgId);

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('organization_id', orgId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new AppError(error.message, 400);
  }

  return data || [];
}

/**
 * Get project details.
 */
async function getProjectDetails(supabase, userId, projectId) {
  const { project } = await verifyProjectAccess(supabase, userId, projectId);

  // Get task counts
  const { count: totalTasks } = await supabase
    .from('tasks')
    .select('*', { count: 'exact', head: true })
    .eq('project_id', projectId);

  const { count: completedTasks } = await supabase
    .from('tasks')
    .select('*', { count: 'exact', head: true })
    .eq('project_id', projectId)
    .eq('status', 'completed');

  return {
    ...project,
    totalTasks: totalTasks || 0,
    completedTasks: completedTasks || 0,
  };
}

/**
 * Update project details.
 */
async function updateProject(supabase, userId, projectId, updates) {
  await verifyProjectAccess(supabase, userId, projectId);

  const { data, error } = await supabase
    .from('projects')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', projectId)
    .select()
    .single();

  if (error) {
    throw new AppError(error.message, 400);
  }

  return data;
}

/**
 * Delete a project (owner only).
 */
async function deleteProject(supabase, userId, projectId) {
  const { project } = await verifyProjectAccess(supabase, userId, projectId);

  if (project.owner_id !== userId) {
    throw new AppError('Only the project owner can delete it', 403);
  }

  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', projectId);

  if (error) {
    throw new AppError(error.message, 400);
  }
}

module.exports = {
  createProject,
  getProjectsByOrganization,
  getProjectDetails,
  updateProject,
  deleteProject,
};
