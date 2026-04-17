import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import api from '@/lib/api/axios';

interface BrandsResponse {
  success: boolean;
  data: any[];
}

export const useBrands = (options?: Partial<UseQueryOptions<BrandsResponse>>) => {
  return useQuery<BrandsResponse>({
    queryKey: ['brands'],
    queryFn: async () => {
      const response = await api.get('/api/catalog/brands');
      return response.data;
    },
    ...options,
  });
};

export const useBrand = (slug: string, options?: UseQueryOptions) => {
  return useQuery({
    queryKey: ['brand', slug],
    queryFn: async () => {
      const response = await api.get(`/api/catalog/brands/${slug}`);
      return response.data;
    },
    enabled: !!slug,
    ...options,
  });
};

export const useBrandProducts = (
  slug: string,
  params?: { page?: number; per_page?: number },
  options?: UseQueryOptions
) => {
  return useQuery({
    queryKey: ['brand', slug, 'products', params],
    queryFn: async () => {
      const response = await api.get(`/api/catalog/brands/${slug}/products`, { params });
      return response.data;
    },
    enabled: !!slug,
    ...options,
  });
};
