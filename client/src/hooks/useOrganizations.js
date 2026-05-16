import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export function useOrganizations() {
  return useQuery({
    queryKey: ['organizations'],
    queryFn: () => api.get('/organizations').then((r) => r.data),
  });
}

export function useOrganization(orgId) {
  return useQuery({
    queryKey: ['organizations', orgId],
    queryFn: () => api.get(`/organizations/${orgId}`).then((r) => r.data),
    enabled: !!orgId,
  });
}

export function useOrgMembers(orgId) {
  return useQuery({
    queryKey: ['organizations', orgId, 'members'],
    queryFn: () => api.get(`/organizations/${orgId}/members`).then((r) => r.data),
    enabled: !!orgId,
  });
}

export function useCreateOrg() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => api.post('/organizations', data).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['organizations'] }),
  });
}

export function useAddMember(orgId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => api.post(`/organizations/${orgId}/members`, data).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['organizations', orgId, 'members'] }),
  });
}

export function useRemoveMember(orgId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (memberId) => api.delete(`/organizations/${orgId}/members/${memberId}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['organizations', orgId, 'members'] }),
  });
}

export function useUpdateOrg(orgId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => api.patch(`/organizations/${orgId}`, data).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['organizations'] });
      qc.invalidateQueries({ queryKey: ['organizations', orgId] });
    },
  });
}

export function useDeleteOrg(orgId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api.delete(`/organizations/${orgId}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['organizations'] }),
  });
}
