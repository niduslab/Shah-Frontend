import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import api from '@/lib/api/axios';

interface BrandData {
  name: string;
  slug?: string;
  description?: string;
  logo?: File | string;
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
      const formData = new FormData();
      formData.append('name', data.name);
      
      if (data.description) {
        formData.append('description', data.description);
      }
      
      if (data.logo instanceof File) {
        formData.append('logo', data.logo);
      }
      
      if (data.is_active !== undefined) {
        formData.append('is_active', data.is_active ? '1' : '0');
      }
      
      if (data.sort_order !== undefined) {
        formData.append('sort_order', data.sort_order.toString());
      }
      
      const response = await api.post('/api/admin/brands', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
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
      const formData = new FormData();
      
      // Add _method for Laravel to handle PUT request with FormData
      formData.append('_method', 'PUT');
      
      if (data.name) {
        formData.append('name', data.name);
      }
      
      if (data.description !== undefined) {
        formData.append('description', data.description || '');
      }
      
      if (data.logo instanceof File) {
        formData.append('logo', data.logo);
      }
      
      if (data.is_active !== undefined) {
        formData.append('is_active', data.is_active ? '1' : '0');
      }
      
      if (data.sort_order !== undefined) {
        formData.append('sort_order', data.sort_order.toString());
      }
      
      const response = await api.post(`/api/admin/brands/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
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
