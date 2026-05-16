import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export function useComments(taskId) {
  return useQuery({
    queryKey: ['comments', taskId],
    queryFn: () => api.get(`/tasks/${taskId}/comments`).then((r) => r.data),
    enabled: !!taskId,
  });
}

export function useAddComment(taskId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (content) => api.post(`/tasks/${taskId}/comments`, { content }).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['comments', taskId] }),
  });
}

export function useDeleteComment(taskId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (commentId) => api.delete(`/tasks/${taskId}/comments/${commentId}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['comments', taskId] }),
  });
}
