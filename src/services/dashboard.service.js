/**
 * Dashboard Service — aggregated stats and recent activity.
 */
const { AppError } = require('../utils/errors');
const { adminClient } = require('../config/supabase');
const { anonymizeProfile } = require('../utils/privacy');

async function enrichComments(supabase, userId, commentRows) {
  if (!commentRows || commentRows.length === 0) return [];
  
  // Fetch comments starred by current user
  const { data: userStarred } = await supabase
    .from('starred_comments')
    .select('comment_id')
    .eq('user_id', userId);
  const starredSet = new Set((userStarred || []).map(s => s.comment_id));

  const enriched = await Promise.all(
    commentRows.map(async (c) => {
      // Fetch task details
      const { data: task } = await supabase
        .from('tasks')
        .select('title, project_id')
        .eq('id', c.task_id)
        .single();
      
      const { data: project } = task ? await supabase
        .from('projects')
        .select('organization_id')
        .eq('id', task.project_id)
        .single() : { data: null };
      
      const orgId = project?.organization_id;

      const { data: authorMember } = orgId ? await supabase
        .from('organization_members')
        .select('role')
        .eq('organization_id', orgId)
        .eq('user_id', c.user_id)
        .single() : { data: null };

      const { data: authorProfile } = await adminClient
        .from('profiles')
        .select('id, first_name, last_name, avatar_url')
        .eq('id', c.user_id)
        .single();
      
      const anonymized = anonymizeProfile(authorProfile, authorMember?.role, authorMember?.role === 'admin', c.user_id === userId);

      return {
        ...c,
        task_title: task?.title || 'Unknown Task',
        project_id: task?.project_id,
        user_full_name: `${anonymized.firstName} ${anonymized.lastName}`.trim(),
        profile_picture_url: anonymized.avatarUrl,
        starred: starredSet.has(c.id),
      };
    })
  );
  return enriched;
}

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

async function getMentions(supabase, userId) {
  const { data: mentions, error } = await supabase
    .from('comment_mentions')
    .select('comment_id')
    .eq('user_id', userId);
  
  if (error) throw new AppError(error.message, 400);
  const commentIds = (mentions || []).map(m => m.comment_id);
  if (commentIds.length === 0) return [];

  const { data: comments, error: commentsError } = await supabase
    .from('task_comments')
    .select('*')
    .in('id', commentIds)
    .order('created_at', { ascending: false });

  if (commentsError) throw new AppError(commentsError.message, 400);
  return enrichComments(supabase, userId, comments);
}

async function getStarred(supabase, userId) {
  const { data: starred, error } = await supabase
    .from('starred_comments')
    .select('comment_id')
    .eq('user_id', userId);
  
  if (error) throw new AppError(error.message, 400);
  const commentIds = (starred || []).map(s => s.comment_id);
  if (commentIds.length === 0) return [];

  const { data: comments, error: commentsError } = await supabase
    .from('task_comments')
    .select('*')
    .in('id', commentIds)
    .order('created_at', { ascending: false });

  if (commentsError) throw new AppError(commentsError.message, 400);
  return enrichComments(supabase, userId, comments);
}

module.exports = { getStats, getRecentTasks, getMentions, getStarred };
