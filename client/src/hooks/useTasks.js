import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { supabase } from '@/lib/supabase';

export function useTasks(projectId, filters = {}) {
  const qc = useQueryClient();
  const params = new URLSearchParams();
  if (filters.status) params.set('status', filters.status);
  if (filters.priority) params.set('priority', filters.priority);
  if (filters.assignedTo) params.set('assignedTo', filters.assignedTo);
  const qs = params.toString() ? `?${params}` : '';

  // Real-time sync for any task change in this project
  useEffect(() => {
    if (!projectId) return;
    
    const channel = supabase
      .channel(`project_tasks:${projectId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'task_assignments',
      }, () => {
        // Since assignments affect task cards, we invalidate project tasks
        qc.invalidateQueries({ queryKey: ['tasks', projectId] });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [projectId, qc]);

  return useQuery({
    queryKey: ['tasks', projectId, filters],
    queryFn: () => api.get(`/projects/${projectId}/tasks${qs}`).then((r) => r.data),
    enabled: !!projectId,
  });
}

export function useTask(taskId) {
  const qc = useQueryClient();

  useEffect(() => {
    if (!taskId) return;
    
    const channel = supabase
      .channel(`task_detail:${taskId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'task_assignments',
        filter: `task_id=eq.${taskId}`,
      }, () => {
        qc.invalidateQueries({ queryKey: ['tasks', 'detail', taskId] });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [taskId, qc]);

  return useQuery({
    queryKey: ['tasks', 'detail', taskId],
    queryFn: () => api.get(`/tasks/${taskId}`).then((r) => r.data),
    enabled: !!taskId,
  });
}

export function useCreateTask(projectId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => api.post(`/projects/${projectId}/tasks`, data).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tasks', projectId] }),
  });
}

export function useUpdateTask(projectId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ taskId, ...data }) => api.patch(`/projects/${projectId}/tasks/${taskId}`, data).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tasks', projectId] });
      qc.invalidateQueries({ queryKey: ['tasks', 'detail'] });
    },
  });
}

export function useDeleteTask(projectId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (taskId) => api.delete(`/projects/${projectId}/tasks/${taskId}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tasks', projectId] }),
  });
}

export function useAssignUser(taskId, projectId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (userId) => api.post(`/tasks/${taskId}/assign`, { userId }).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tasks', 'detail', taskId] });
      qc.invalidateQueries({ queryKey: ['tasks', projectId] });
    },
  });
}

export function useUnassignUser(taskId, projectId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (userId) => api.delete(`/tasks/${taskId}/assign/${userId}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tasks', 'detail', taskId] });
      qc.invalidateQueries({ queryKey: ['tasks', projectId] });
    },
  });
}
