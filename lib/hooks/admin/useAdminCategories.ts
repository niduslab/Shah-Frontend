import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import api from '@/lib/api/axios';

interface CategoryData {
  parent_id?: number | null;
  name: string;
  description?: string;
  image?: string;
  is_active?: boolean;
  sort_order?: number;
  meta_title?: string;
  meta_description?: string;
}

export const useAdminCategories = (params?: { page?: number; per_page?: number }, options?: UseQueryOptions) => {
  return useQuery({
    queryKey: ['admin', 'categories', params],
    queryFn: async () => {
      const response = await api.get('/api/admin/categories', { params });
      return response.data;
    },
    ...options,
  });
};

export const useAdminCategoryTree = (options?: UseQueryOptions) => {
  return useQuery({
    queryKey: ['admin', 'categories', 'tree'],
    queryFn: async () => {
      const response = await api.get('/api/admin/categories/tree');
      return response.data;
    },
    ...options,
  });
};

export const useAdminCategory = (id: number, options?: UseQueryOptions) => {
  return useQuery({
    queryKey: ['admin', 'category', id],
    queryFn: async () => {
      const response = await api.get(`/api/admin/categories/${id}`);
      return response.data;
    },
    enabled: !!id,
    ...options,
  });
};

export const useCreateCategory = (options?: UseMutationOptions<any, any, CategoryData>) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CategoryData) => {
      const response = await api.post('/api/admin/categories', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] });
    },
    ...options,
  });
};

export const useUpdateCategory = (options?: UseMutationOptions<any, any, { id: number; data: Partial<CategoryData> }>) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<CategoryData> }) => {
      const response = await api.put(`/api/admin/categories/${id}`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'category', variables.id] });
    },
    ...options,
  });
};

export const useDeleteCategory = (options?: UseMutationOptions<any, any, number>) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete(`/api/admin/categories/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] });
    },
    ...options,
  });
};
