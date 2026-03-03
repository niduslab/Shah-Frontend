import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import api from '@/lib/api/axios';

export const useFlashDeals = (status?: 'active' | 'upcoming', options?: UseQueryOptions) => {
  return useQuery({
    queryKey: ['flash-deals', status],
    queryFn: async () => {
      const response = await api.get('/api/flash-deals', {
        params: status ? { status } : undefined,
      });
      return response.data;
    },
    ...options,
  });
};

export const useUpcomingFlashDeals = (options?: UseQueryOptions) => {
  return useQuery({
    queryKey: ['flash-deals', 'upcoming'],
    queryFn: async () => {
      const response = await api.get('/api/flash-deals/upcoming');
      return response.data;
    },
    ...options,
  });
};

export const useFlashDeal = (id: number, options?: UseQueryOptions) => {
  return useQuery({
    queryKey: ['flash-deal', id],
    queryFn: async () => {
      const response = await api.get(`/api/flash-deals/${id}`);
      return response.data;
    },
    enabled: !!id,
    ...options,
  });
};
