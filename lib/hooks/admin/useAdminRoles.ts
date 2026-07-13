import { useQuery, useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import api from '@/lib/api/axios';

export interface AdminRole {
  id: number;
  name: string;
  permissions: string[];
  users_count: number;
}

interface RoleData {
  name: string;
  permissions?: string[];
}

export const useAdminRoles = () => {
  return useQuery({
    queryKey: ['admin', 'roles'],
    queryFn: async () => {
      const response = await api.get('/api/admin/roles');
      return response.data;
    },
  });
};

export const useAdminPermissions = () => {
  return useQuery({
    queryKey: ['admin', 'permissions'],
    queryFn: async () => {
      const response = await api.get('/api/admin/permissions');
      return response.data;
    },
  });
};

export const useCreateRole = (options?: UseMutationOptions<any, any, RoleData>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: RoleData) => {
      const response = await api.post('/api/admin/roles', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'roles'] });
    },
    ...options,
  });
};

export const useUpdateRole = (options?: UseMutationOptions<any, any, { id: number; data: Partial<RoleData> }>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await api.put(`/api/admin/roles/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'roles'] });
    },
    ...options,
  });
};

export const useDeleteRole = (options?: UseMutationOptions<any, any, number>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete(`/api/admin/roles/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'roles'] });
    },
    ...options,
  });
};
