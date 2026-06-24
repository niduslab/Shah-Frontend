import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import api from '@/lib/api/axios';

interface UserFilters {
  page?: number;
  per_page?: number;
  user_type?: 'customer' | 'admin' | 'vendor';
  status?: boolean;
  search?: string;
}

interface UserData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  password: string;
  user_type: 'customer' | 'admin' | 'vendor';
  status?: boolean;
}

export const useAdminUsers = (filters?: UserFilters, options?: Partial<UseQueryOptions<any>>) => {
  return useQuery({
    queryKey: ['admin', 'users', filters],
    queryFn: async () => {
      const response = await api.get('/api/admin/users', { params: filters });
      return response.data;
    },
    ...options,
  });
};

interface UserDetailParams {
  per_page?: number;
  orders_page?: number;
  wishlist_page?: number;
  cart_page?: number;
}

export const useAdminUser = (id: number, params?: UserDetailParams, options?: Partial<UseQueryOptions<any>>) => {
  return useQuery({
    queryKey: ['admin', 'user', id, params],
    queryFn: async () => {
      const response = await api.get(`/api/admin/users/${id}`, { params });
      return response.data;
    },
    enabled: !!id,
    ...options,
  });
};

export const useCreateUser = (options?: UseMutationOptions<any, any, UserData>) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: UserData) => {
      const response = await api.post('/api/admin/users', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
    ...options,
  });
};

export const useUpdateUser = (options?: UseMutationOptions<any, any, { id: number; data: Partial<UserData> }>) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await api.put(`/api/admin/users/${id}`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'user', variables.id] });
    },
    ...options,
  });
};

export const useDeleteUser = (options?: UseMutationOptions<any, any, number>) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete(`/api/admin/users/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
    ...options,
  });
};

export const useToggleUserStatus = (options?: UseMutationOptions<any, any, number>) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.post(`/api/admin/users/${id}/toggle-status`);
      return response.data;
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'user', id] });
    },
    ...options,
  });
};
