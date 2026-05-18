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

  // Parse mentions in comment text
  try {
    const mentions = [];
    const { data: members } = await supabase
      .from('organization_members')
      .select('user_id')
      .eq('organization_id', orgId);
    
    if (members && members.length > 0) {
      const userIds = members.map(m => m.user_id);
      const { data: profiles } = await adminClient
        .from('profiles')
        .select('id, first_name, last_name')
        .in('id', userIds);
      
      if (profiles) {
        for (const profile of profiles) {
          const fullName = `${profile.first_name || ''}${profile.last_name || ''}`.replace(/\s+/g, '').toLowerCase();
          const firstName = (profile.first_name || '').toLowerCase();
          
          const contentLower = content.toLowerCase();
          if (
            contentLower.includes(`@${fullName}`) ||
            (firstName && contentLower.includes(`@${firstName}`))
          ) {
            mentions.push(profile.id);
          }
        }
      }
    }
    
    if (mentions.length > 0) {
      const insertRows = mentions.map(uId => ({ comment_id: data.id, user_id: uId }));
      await supabase.from('comment_mentions').insert(insertRows);
    }
  } catch (parseErr) {
    console.error('Failed to parse mentions:', parseErr);
  }

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
    starred: false,
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

  // Fetch comments starred by current user
  const { data: userStarred } = await supabase
    .from('starred_comments')
    .select('comment_id')
    .eq('user_id', userId);
  
  const starredSet = new Set((userStarred || []).map(s => s.comment_id));

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
        starred: starredSet.has(c.id),
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

async function starComment(supabase, userId, commentId) {
  const { data, error } = await supabase
    .from('starred_comments')
    .upsert({ user_id: userId, comment_id: commentId }, { onConflict: 'user_id, comment_id' })
    .select()
    .single();

  if (error) throw new AppError(error.message, 400);
  return data;
}

async function unstarComment(supabase, userId, commentId) {
  const { error } = await supabase
    .from('starred_comments')
    .delete()
    .eq('user_id', userId)
    .eq('comment_id', commentId);

  if (error) throw new AppError(error.message, 400);
}

module.exports = { addComment, getTaskComments, deleteComment, starComment, unstarComment };
