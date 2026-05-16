/**
 * Comments Service — CRUD for task comments.
 */
const { adminClient } = require('../config/supabase');
const { AppError } = require('../utils/errors');
const { verifyTaskAccess, verifyCommentAuthor } = require('../utils/permissions');

const { anonymizeProfile } = require('../utils/privacy');

async function addComment(supabase, userId, taskId, content) {
  const { membership, project } = await verifyTaskAccess(supabase, userId, taskId);
  const isAdmin = membership.role === 'admin';
  const orgId = project.organization_id;

  const { data, error } = await supabase
    .from('task_comments')
    .insert({ task_id: taskId, user_id: userId, content })
    .select()
    .single();

  if (error) throw new AppError(error.message, 400);

  const { data: authorProfile } = await adminClient
    .from('profiles')
    .select('id, first_name, last_name, avatar_url')
    .eq('id', userId)
    .single();

  // Self comment is never anonymized to the author
  const anonymized = anonymizeProfile(authorProfile, membership.role, isAdmin, true);

  return {
    ...data,
    user_full_name: `${anonymized.firstName} ${anonymized.lastName}`.trim(),
    profile_picture_url: anonymized.avatarUrl,
  };
}

async function getTaskComments(supabase, userId, taskId) {
  const { membership, project } = await verifyTaskAccess(supabase, userId, taskId);
  const isAdmin = membership.role === 'admin';
  const orgId = project.organization_id;

  const { data, error } = await supabase
    .from('task_comments')
    .select('*')
    .eq('task_id', taskId)
    .order('created_at', { ascending: true });

  if (error) throw new AppError(error.message, 400);

  const enriched = await Promise.all(
    (data || []).map(async (c) => {
      const { data: authorMember } = await supabase
        .from('organization_members')
        .select('role')
        .eq('organization_id', orgId)
        .eq('user_id', c.user_id)
        .single();

      const { data: authorProfile } = await adminClient
        .from('profiles')
        .select('id, first_name, last_name, avatar_url')
        .eq('id', c.user_id)
        .single();
      
      const anonymized = anonymizeProfile(authorProfile, authorMember?.role, isAdmin, c.user_id === userId);

      return {
        ...c,
        user_full_name: `${anonymized.firstName} ${anonymized.lastName}`.trim(),
        profile_picture_url: anonymized.avatarUrl,
      };
    })
  );
  return enriched;
}

async function deleteComment(supabase, userId, commentId) {
  await verifyCommentAuthor(supabase, userId, commentId);
  const { error } = await supabase.from('task_comments').delete().eq('id', commentId);
  if (error) throw new AppError(error.message, 400);
}

module.exports = { addComment, getTaskComments, deleteComment };
