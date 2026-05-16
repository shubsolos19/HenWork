import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export function useProjects(orgId) {
  return useQuery({
    queryKey: ['projects', orgId],
    queryFn: () => api.get(`/organizations/${orgId}/projects`).then((r) => r.data),
    enabled: !!orgId,
  });
}

export function useProject(projectId) {
  return useQuery({
    queryKey: ['projects', 'detail', projectId],
    queryFn: () => api.get(`/organizations/_/projects/${projectId}`).then((r) => r.data),
    enabled: !!projectId,
  });
}

export function useCreateProject(orgId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => api.post(`/organizations/${orgId}/projects`, data).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['projects', orgId] }),
  });
}

export function useDeleteProject(orgId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (projectId) => api.delete(`/organizations/${orgId}/projects/${projectId}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['projects', orgId] }),
  });
}
