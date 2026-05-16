import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: () => api.get('/dashboard/stats').then((r) => r.data),
  });
}

export function useRecentTasks(limit = 10) {
  return useQuery({
    queryKey: ['dashboard', 'recent-tasks', limit],
    queryFn: () => api.get(`/dashboard/recent-tasks?limit=${limit}`).then((r) => r.data),
  });
}
