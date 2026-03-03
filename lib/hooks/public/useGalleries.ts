import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import api from '@/lib/api/axios';

export const useGalleries = (options?: UseQueryOptions) => {
  return useQuery({
    queryKey: ['galleries'],
    queryFn: async () => {
      const response = await api.get('/api/galleries');
      return response.data;
    },
    ...options,
  });
};

export const useGallery = (slug: string, options?: UseQueryOptions) => {
  return useQuery({
    queryKey: ['gallery', slug],
    queryFn: async () => {
      const response = await api.get(`/api/galleries/${slug}`);
      return response.data;
    },
    enabled: !!slug,
    ...options,
  });
};
