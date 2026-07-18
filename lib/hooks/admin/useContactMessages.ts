import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import api from '@/lib/api/axios';

interface ContactMessageFilters {
  page?: number;
  per_page?: number;
  search?: string;
  status?: 'new' | 'read' | 'replied';
  date_from?: string;
  date_to?: string;
}

export const useContactMessages = (filters?: ContactMessageFilters, options?: Partial<UseQueryOptions<any>>) => {
  return useQuery({
    queryKey: ['admin', 'contact-messages', filters],
    queryFn: async () => {
      const response = await api.get('/api/admin/contact-messages', { params: filters });
      return response.data;
    },
    ...options,
  });
};

export const useContactMessage = (id: number, options?: Partial<UseQueryOptions<any>>) => {
  return useQuery({
    queryKey: ['admin', 'contact-message', id],
    queryFn: async () => {
      const response = await api.get(`/api/admin/contact-messages/${id}`);
      return response.data;
    },
    enabled: !!id,
    ...options,
  });
};

export const useContactMessageStatistics = (options?: Partial<UseQueryOptions<any>>) => {
  return useQuery({
    queryKey: ['admin', 'contact-messages', 'statistics'],
    queryFn: async () => {
      const response = await api.get('/api/admin/contact-messages/statistics');
      return response.data;
    },
    ...options,
  });
};

export const useUpdateContactMessageStatus = (options?: UseMutationOptions<any, any, { id: number; status: 'new' | 'read' | 'replied' }>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: number; status: 'new' | 'read' | 'replied' }) => {
      const response = await api.put(`/api/admin/contact-messages/${id}/status`, { status });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'contact-messages'] });
    },
    ...options,
  });
};

export const useDeleteContactMessage = (options?: UseMutationOptions<any, any, number>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete(`/api/admin/contact-messages/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'contact-messages'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'contact-messages', 'statistics'] });
    },
    ...options,
  });
};
