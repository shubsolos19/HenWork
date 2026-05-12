/**
 * Dashboard Service — aggregated stats and recent activity.
 */
const { AppError } = require('../utils/errors');

async function getStats(supabase, userId) {
  // Get all user's org memberships
  const { data: memberships } = await supabase
    .from('organization_members')
    .select('organization_id')
    .eq('user_id', userId);
  const orgIds = (memberships || []).map((m) => m.organization_id);
  if (orgIds.length === 0) {
    return { totalOrgs: 0, totalProjects: 0, totalTasks: 0, inProgress: 0, completed: 0, overdue: 0 };
  }

  const { count: totalProjects } = await supabase
    .from('projects').select('*', { count: 'exact', head: true })
    .in('organization_id', orgIds);

  const { data: projects } = await supabase
    .from('projects').select('id').in('organization_id', orgIds);
  const projectIds = (projects || []).map((p) => p.id);

  if (projectIds.length === 0) {
    return { totalOrgs: orgIds.length, totalProjects: 0, totalTasks: 0, inProgress: 0, completed: 0, overdue: 0 };
  }

  const { count: totalTasks } = await supabase
    .from('tasks').select('*', { count: 'exact', head: true })
    .in('project_id', projectIds);
  const { count: inProgress } = await supabase
    .from('tasks').select('*', { count: 'exact', head: true })
    .in('project_id', projectIds).eq('status', 'in_progress');
  const { count: completed } = await supabase
    .from('tasks').select('*', { count: 'exact', head: true })
    .in('project_id', projectIds).eq('status', 'completed');
  const { count: overdue } = await supabase
    .from('tasks').select('*', { count: 'exact', head: true })
    .in('project_id', projectIds).neq('status', 'completed')
    .lt('due_date', new Date().toISOString());

  return {
    totalOrgs: orgIds.length,
    totalProjects: totalProjects || 0,
    totalTasks: totalTasks || 0,
    inProgress: inProgress || 0,
    completed: completed || 0,
    overdue: overdue || 0,
  };
}

async function getRecentTasks(supabase, userId, limit = 10) {
  const { data: memberships } = await supabase
    .from('organization_members').select('organization_id').eq('user_id', userId);
  const orgIds = (memberships || []).map((m) => m.organization_id);
  if (orgIds.length === 0) return [];

  const { data: projects } = await supabase
    .from('projects').select('id').in('organization_id', orgIds);
  const projectIds = (projects || []).map((p) => p.id);
  if (projectIds.length === 0) return [];

  const { data, error } = await supabase
    .from('tasks').select('*')
    .in('project_id', projectIds)
    .order('updated_at', { ascending: false })
    .limit(limit);
  if (error) throw new AppError(error.message, 400);
  return data || [];
}

module.exports = { getStats, getRecentTasks };
