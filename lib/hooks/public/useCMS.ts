import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import api from '@/lib/api/axios';

type PolicyType = 'privacy' | 'terms' | 'shipping' | 'return' | 'refund';

export const usePolicies = (options?: Partial<UseQueryOptions<any>>) => {
  return useQuery({
    queryKey: ['policies'],
    queryFn: async () => {
      const response = await api.get('/api/policies');
      return response.data;
    },
    ...options,
  });
};

export const usePolicy = (type: PolicyType, options?: Partial<UseQueryOptions<any>>) => {
  return useQuery({
    queryKey: ['policy', type],
    queryFn: async () => {
      const response = await api.get(`/api/policies/${type}`);
      return response.data;
    },
    enabled: !!type,
    ...options,
  });
};

export const usePage = (slug: string, options?: Partial<UseQueryOptions<any>>) => {
  return useQuery({
    queryKey: ['page', slug],
    queryFn: async () => {
      const response = await api.get(`/api/pages/${slug}`);
      return response.data;
    },
    enabled: !!slug,
    ...options,
  });
};

export const useBanners = (position: string, options?: Partial<UseQueryOptions<any>>) => {
  return useQuery({
    queryKey: ['banners', position],
    queryFn: async () => {
      const response = await api.get(`/api/banners/${position}`);
      return response.data;
    },
    enabled: !!position,
    ...options,
  });
};
