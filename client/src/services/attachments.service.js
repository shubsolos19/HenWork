import api from '@/lib/api';
import { supabase } from '@/lib/supabase';

export const attachmentService = {
  /**
   * Upload attachment
   * 1. Upload to Supabase Storage directly (better for large files)
   * 2. Send metadata to our API
   */
  async upload(orgId, projectId, taskId, file) {
    const fileName = file.name;
    const fileSize = file.size;
    const contentType = file.type;
    const filePath = `${orgId}/${projectId}/${taskId}/${Date.now()}_${fileName}`;

    // 1. Upload to storage
    const { error: storageError } = await supabase.storage
      .from('task-attachments')
      .upload(filePath, file);

    if (storageError) throw storageError;

    // 2. Save metadata via API
    const { data } = await api.post(`/attachments/task/${taskId}`, {
      fileName,
      fileSize,
      contentType,
      filePath
    });

    return data;
  },

  async getTaskAttachments(taskId) {
    const { data } = await api.get(`/attachments/task/${taskId}`);
    return data;
  },

  async delete(attachmentId) {
    const { data } = await api.delete(`/attachments/${attachmentId}`);
    return data;
  },

  async getDownloadUrl(attachmentId) {
    const { data } = await api.get(`/attachments/${attachmentId}/download`);
    return data;
  }
};
