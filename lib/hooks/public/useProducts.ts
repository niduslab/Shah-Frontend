import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import api from '@/lib/api/axios';

interface ProductFilters {
  search?: string;
  category_id?: number;
  brand_id?: number;
  min_price?: number;
  max_price?: number;
  in_stock?: boolean;
  is_featured?: boolean;
  is_trending?: boolean;
  sort_by?: 'price' | 'name' | 'created_at';
  sort_order?: 'asc' | 'desc';
  per_page?: number;
  page?: number;
}

export const useProducts = (filters?: ProductFilters, options?: UseQueryOptions) => {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: async () => {
      const response = await api.get('/api/catalog/products', { params: filters });
      return response.data;
    },
    ...options,
  });
};

export const useProduct = (slug: string, options?: UseQueryOptions) => {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: async () => {
      const response = await api.get(`/api/catalog/products/${slug}`);
      return response.data;
    },
    enabled: !!slug,
    ...options,
  });
};

export const useFeaturedProducts = (perPage: number = 12, options?: UseQueryOptions) => {
  return useQuery({
    queryKey: ['products', 'featured', perPage],
    queryFn: async () => {
      const response = await api.get('/api/catalog/products/featured', {
        params: { per_page: perPage },
      });
      return response.data;
    },
    ...options,
  });
};

export const useTrendingProducts = (perPage: number = 12, options?: UseQueryOptions) => {
  return useQuery({
    queryKey: ['products', 'trending', perPage],
    queryFn: async () => {
      const response = await api.get('/api/catalog/products/trending', {
        params: { per_page: perPage },
      });
      return response.data;
    },
    ...options,
  });
};
