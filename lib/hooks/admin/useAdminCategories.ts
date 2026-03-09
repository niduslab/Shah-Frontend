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

export const useAdminCategories = (params?: { page?: number; per_page?: number }, options?: UseQueryOptions<any>) => {
  return useQuery({
    queryKey: ['admin', 'categories', params],
    queryFn: async () => {
      const response = await api.get('/api/admin/categories', { params });
      return response.data;
    },
    ...options,
  });
};

export const useAdminCategoryTree = (params?: { page?: number; per_page?: number }, options?: UseQueryOptions<any>) => {
  return useQuery({
    queryKey: ['admin', 'categories', 'tree', params],
    queryFn: async () => {
      // Use the same endpoint since tree structure is already in the response
      const response = await api.get('/api/admin/categories', { params });
      return response.data;
    },
    ...options,
  });
};

export const useAdminCategory = (id: number, options?: UseQueryOptions<any>) => {
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

export const useCreateCategory = (options?: UseMutationOptions<any, any, FormData | CategoryData>) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: FormData | CategoryData) => {
      const config = data instanceof FormData 
        ? { headers: { 'Content-Type': 'multipart/form-data' } }
        : {};
      const response = await api.post('/api/admin/categories', data, config);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] });
    },
    ...options,
  });
};

export const useUpdateCategory = (options?: UseMutationOptions<any, any, { id: number; data: FormData | Partial<CategoryData> }>) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: FormData | Partial<CategoryData> }) => {
      // Laravel requires _method field for FormData PUT requests
      if (data instanceof FormData) {
        data.append('_method', 'PUT');
        const response = await api.post(`/api/admin/categories/${id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
      } else {
        const response = await api.put(`/api/admin/categories/${id}`, data);
        return response.data;
      }
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
