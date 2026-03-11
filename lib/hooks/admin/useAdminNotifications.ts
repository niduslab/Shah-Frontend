import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import api from '@/lib/api/axios';

interface NotificationFilters {
  page?: number;
  per_page?: number;
  read?: boolean;
}

export const useAdminNotifications = (filters?: NotificationFilters, options?: UseQueryOptions) => {
  return useQuery({
    queryKey: ['admin-notifications', filters],
    queryFn: async () => {
      const response = await api.get('/api/admin/notifications', { params: filters });
      return response.data;
    },
    ...options,
  });
};

export const useAdminUnreadCount = (options?: UseQueryOptions) => {
  return useQuery({
    queryKey: ['admin-notifications', 'unread-count'],
    queryFn: async () => {
      const response = await api.get('/api/admin/notifications/unread-count');
      return response.data;
    },
    refetchInterval: 30000, // Refetch every 30 seconds
    ...options,
  });
};

export const useAdminMarkAsRead = (options?: UseMutationOptions<any, any, number>) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.post(`/api/admin/notifications/${id}/mark-as-read`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-notifications'] });
      queryClient.invalidateQueries({ queryKey: ['admin-notifications', 'unread-count'] });
    },
    ...options,
  });
};

export const useAdminMarkAllAsRead = (options?: UseMutationOptions) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      const response = await api.post('/api/admin/notifications/mark-all-as-read');
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-notifications'] });
      queryClient.invalidateQueries({ queryKey: ['admin-notifications', 'unread-count'] });
    },
    ...options,
  });
};

export const useAdminDeleteNotification = (options?: UseMutationOptions<any, any, number>) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete(`/api/admin/notifications/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-notifications'] });
    },
    ...options,
  });
};

export const useAdminClearNotifications = (options?: UseMutationOptions) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      const response = await api.post('/api/admin/notifications/clear');
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-notifications'] });
      queryClient.invalidateQueries({ queryKey: ['admin-notifications', 'unread-count'] });
    },
    ...options,
  });
};
