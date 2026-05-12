/**
 * Comments Service — CRUD for task comments.
 */
const { adminClient } = require('../config/supabase');
const { AppError } = require('../utils/errors');
const { verifyTaskAccess, verifyCommentAuthor } = require('../utils/permissions');

async function addComment(supabase, userId, taskId, content) {
  await verifyTaskAccess(supabase, userId, taskId);
  const { data, error } = await supabase
    .from('task_comments')
    .insert({ task_id: taskId, user_id: userId, content })
    .select()
    .single();
  if (error) throw new AppError(error.message, 400);

  const { data: author } = await adminClient
    .from('profiles')
    .select('first_name, last_name, avatar_url')
    .eq('id', userId)
    .single();
  return { ...data, author: author || null };
}

async function getTaskComments(supabase, userId, taskId) {
  await verifyTaskAccess(supabase, userId, taskId);
  const { data, error } = await supabase
    .from('task_comments')
    .select('*')
    .eq('task_id', taskId)
    .order('created_at', { ascending: true });
  if (error) throw new AppError(error.message, 400);

  const enriched = await Promise.all(
    (data || []).map(async (c) => {
      const { data: author } = await adminClient
        .from('profiles')
        .select('first_name, last_name, avatar_url')
        .eq('id', c.user_id)
        .single();
      return { ...c, author: author || null };
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
