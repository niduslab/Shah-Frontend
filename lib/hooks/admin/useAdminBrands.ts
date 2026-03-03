import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import api from '@/lib/api/axios';

interface BrandData {
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  is_active?: boolean;
  sort_order?: number;
}

export const useAdminBrands = (params?: { page?: number; per_page?: number }, options?: UseQueryOptions) => {
  return useQuery({
    queryKey: ['admin', 'brands', params],
    queryFn: async () => {
      const response = await api.get('/api/admin/brands', { params });
      return response.data;
    },
    ...options,
  });
};

export const useAdminBrand = (id: number, options?: UseQueryOptions) => {
  return useQuery({
    queryKey: ['admin', 'brand', id],
    queryFn: async () => {
      const response = await api.get(`/api/admin/brands/${id}`);
      return response.data;
    },
    enabled: !!id,
    ...options,
  });
};

export const useCreateBrand = (options?: UseMutationOptions<any, any, BrandData>) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: BrandData) => {
      const response = await api.post('/api/admin/brands', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'brands'] });
    },
    ...options,
  });
};

export const useUpdateBrand = (options?: UseMutationOptions<any, any, { id: number; data: Partial<BrandData> }>) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<BrandData> }) => {
      const response = await api.put(`/api/admin/brands/${id}`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'brands'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'brand', variables.id] });
    },
    ...options,
  });
};

export const useDeleteBrand = (options?: UseMutationOptions<any, any, number>) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete(`/api/admin/brands/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'brands'] });
    },
    ...options,
  });
};
