/**
 * Attachments Service — Operations for task file attachments.
 */

const { adminClient } = require('../config/supabase');
const { AppError } = require('../utils/errors');
const { verifyTaskAccess } = require('../utils/permissions');

/**
 * Upload a file attachment for a task.
 */
async function uploadAttachment(supabase, userId, taskId, { fileName, fileSize, contentType, filePath, fileBlob }) {
  const { task } = await verifyTaskAccess(supabase, userId, taskId);

  // 1. Upload to Storage (only if fileBlob is provided, e.g. from backend direct uploads)
  if (fileBlob) {
    const { error: storageError } = await supabase.storage
      .from('task-attachments')
      .upload(filePath, fileBlob, {
        contentType,
        upsert: true
      });

    if (storageError) {
      throw new AppError(storageError.message, 400);
    }
  }

  // 2. Save metadata to DB
  const { data, error } = await supabase
    .from('task_attachments')
    .insert({
      task_id: taskId,
      file_name: fileName,
      file_path: filePath,
      file_size: fileSize,
      content_type: contentType,
      uploaded_by: userId,
    })
    .select()
    .single();

  if (error) {
    // Cleanup storage if DB fails
    await supabase.storage.from('task-attachments').remove([filePath]);
    throw new AppError(error.message, 400);
  }

  return data;
}

const { anonymizeProfile } = require('../utils/privacy');

/**
 * Get all attachments for a task.
 */
async function getTaskAttachments(supabase, userId, taskId) {
  const { membership, project } = await verifyTaskAccess(supabase, userId, taskId);
  const isAdmin = membership.role === 'admin';
  const orgId = project.organization_id;

  const { data, error } = await supabase
    .from('task_attachments')
    .select('*')
    .eq('task_id', taskId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new AppError(error.message, 400);
  }

  // Enrich with uploader info
  const enriched = await Promise.all(
    (data || []).map(async (attachment) => {
      const { data: authorMember } = await supabase
        .from('organization_members')
        .select('role')
        .eq('organization_id', orgId)
        .eq('user_id', attachment.uploaded_by)
        .single();

      const { data: profile } = await adminClient
        .from('profiles')
        .select('id, first_name, last_name, avatar_url')
        .eq('id', attachment.uploaded_by)
        .single();
      
      return {
        ...attachment,
        uploader: anonymizeProfile(profile, authorMember?.role, isAdmin, attachment.uploaded_by === userId)
      };
    })
  );

  return enriched;
}

/**
 * Delete an attachment.
 */
async function deleteAttachment(supabase, userId, attachmentId) {
  // Get attachment details first
  const { data: attachment, error: fetchError } = await supabase
    .from('task_attachments')
    .select('*')
    .eq('id', attachmentId)
    .single();

  if (fetchError || !attachment) {
    throw new AppError('Attachment not found', 404);
  }

  // Verify access/permissions
  const { task } = await verifyTaskAccess(supabase, userId, attachment.task_id);
  
  // Check if owner or admin
  const isOwner = attachment.uploaded_by === userId;
  // For admin check, we'd need orgId. Let's assume verifyTaskAccess handles membership, 
  // and we'll check admin status if not owner.
  
  if (!isOwner) {
    const { data: project } = await supabase
      .from('projects')
      .select('organization_id')
      .eq('id', task.project_id)
      .single();
      
    const { data: member } = await supabase
      .from('organization_members')
      .select('role')
      .eq('organization_id', project.organization_id)
      .eq('user_id', userId)
      .single();
      
    if (!member || member.role !== 'admin') {
      throw new AppError('Only the uploader or an admin can delete this file', 403);
    }
  }

  // 1. Delete from Storage
  const { error: storageError } = await supabase.storage
    .from('task-attachments')
    .remove([attachment.file_path]);

  if (storageError) {
    throw new AppError(storageError.message, 400);
  }

  // 2. Delete from DB
  const { error: dbError } = await supabase
    .from('task_attachments')
    .delete()
    .eq('id', attachmentId);

  if (dbError) {
    throw new AppError(dbError.message, 400);
  }

  return { success: true };
}

/**
 * Generate a signed URL for download.
 */
async function getDownloadUrl(supabase, userId, attachmentId) {
  const { data: attachment, error: fetchError } = await supabase
    .from('task_attachments')
    .select('*')
    .eq('id', attachmentId)
    .single();

  if (fetchError || !attachment) {
    throw new AppError('Attachment not found', 404);
  }

  await verifyTaskAccess(supabase, userId, attachment.task_id);

  const { data, error } = await supabase.storage
    .from('task-attachments')
    .createSignedUrl(attachment.file_path, 3600); // 1 hour expiry

  if (error) {
    throw new AppError(error.message, 400);
  }

  return { 
    url: data.signedUrl,
    fileName: attachment.file_name
  };
}

module.exports = {
  uploadAttachment,
  getTaskAttachments,
  deleteAttachment,
  getDownloadUrl
};
