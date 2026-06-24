import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import api from '@/lib/api/axios';

interface NotificationFilters {
  page?: number;
  per_page?: number;
}

export const useNotifications = (filters?: NotificationFilters, options?: Partial<UseQueryOptions<any>>) => {
  return useQuery({
    queryKey: ['notifications', filters],
    queryFn: async () => {
      const response = await api.get('/api/notifications', { params: filters });
      return response.data;
    },
    ...options,
  });
};

export const useUnreadCount = (options?: Partial<UseQueryOptions<any>>) => {
  return useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: async () => {
      const response = await api.get('/api/notifications/unread-count');
      return response.data;
    },
    ...options,
  });
};

export const useMarkAsRead = (options?: UseMutationOptions<any, any, number>) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.post(`/api/notifications/${id}/mark-as-read`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unread-count'] });
    },
    ...options,
  });
};

export const useMarkAllAsRead = (options?: UseMutationOptions) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      const response = await api.post('/api/notifications/mark-all-as-read');
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unread-count'] });
    },
    ...options,
  });
};

export const useDeleteNotification = (options?: UseMutationOptions<any, any, number>) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete(`/api/notifications/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
    ...options,
  });
};

export const useClearNotifications = (options?: UseMutationOptions) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      const response = await api.post('/api/notifications/clear');
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unread-count'] });
    },
    ...options,
  });
};
