import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import api from '@/lib/api/axios';

export const useCategories = (options?: UseQueryOptions<any>) => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await api.get('/api/catalog/categories');
      return response.data;
    },
    ...options,
  });
};

export const useCategory = (slug: string, options?: UseQueryOptions<any>) => {
  return useQuery({
    queryKey: ['category', slug],
    queryFn: async () => {
      const response = await api.get(`/api/catalog/categories/${slug}`);
      return response.data;
    },
    enabled: !!slug,
    ...options,
  });
};

export const useCategoryProducts = (
  slug: string,
  params?: { page?: number; per_page?: number },
  options?: UseQueryOptions<any>
) => {
  return useQuery({
    queryKey: ['category', slug, 'products', params],
    queryFn: async () => {
      const response = await api.get(`/api/catalog/categories/${slug}/products`, { params });
      return response.data;
    },
    enabled: !!slug,
    ...options,
  });
};
