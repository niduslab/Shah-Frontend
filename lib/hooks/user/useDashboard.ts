import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import api from '@/lib/api/axios';

export const useDashboard = (options?: UseQueryOptions) => {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const response = await api.get('/api/dashboard');
      return response.data;
    },
    ...options,
  });
};

export const useProfile = (options?: UseQueryOptions) => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const response = await api.get('/api/profile');
      return response.data;
    },
    ...options,
  });
};
