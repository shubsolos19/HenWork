import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { attachmentService } from '@/services/attachments.service';
import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export function useTaskAttachments(taskId) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['attachments', taskId],
    queryFn: () => attachmentService.getTaskAttachments(taskId),
    enabled: !!taskId,
  });

  // Real-time sync
  useEffect(() => {
    if (!taskId) return;

    const channel = supabase
      .channel(`task_attachments_${taskId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'task_attachments',
          filter: `task_id=eq.${taskId}`
        },
        () => {
          queryClient.invalidateQueries(['attachments', taskId]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [taskId, queryClient]);

  return query;
}

export function useUploadAttachment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orgId, projectId, taskId, file }) => 
      attachmentService.upload(orgId, projectId, taskId, file),
    onSuccess: (_, { taskId }) => {
      queryClient.invalidateQueries(['attachments', taskId]);
    },
  });
}

export function useDeleteAttachment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (attachmentId) => attachmentService.delete(attachmentId),
    onSuccess: (_, attachmentId) => {
      // Note: We don't have taskId here easily, but the real-time or manual invalidation will handle it.
      // Better to pass taskId if possible or invalidate all attachments.
      queryClient.invalidateQueries(['attachments']);
    },
  });
}
