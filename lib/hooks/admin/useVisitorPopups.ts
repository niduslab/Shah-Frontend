import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import api from '@/lib/api/axios';

interface VisitorPopupFilters {
  page?: number;
  per_page?: number;
  search?: string;
  has_email?: boolean;
  has_phone?: boolean;
  date_from?: string;
  date_to?: string;
}

export const useVisitorPopups = (filters?: VisitorPopupFilters, options?: Partial<UseQueryOptions<any>>) => {
  return useQuery({
    queryKey: ['admin', 'visitor-popups', filters],
    queryFn: async () => {
      const response = await api.get('/api/admin/visitor-popups', { params: filters });
      return response.data;
    },
    ...options,
  });
};

export const useVisitorPopup = (id: number, options?: Partial<UseQueryOptions<any>>) => {
  return useQuery({
    queryKey: ['admin', 'visitor-popup', id],
    queryFn: async () => {
      const response = await api.get(`/api/admin/visitor-popups/${id}`);
      return response.data;
    },
    enabled: !!id,
    ...options,
  });
};

export const useVisitorPopupStatistics = (options?: Partial<UseQueryOptions<any>>) => {
  return useQuery({
    queryKey: ['admin', 'visitor-popups', 'statistics'],
    queryFn: async () => {
      const response = await api.get('/api/admin/visitor-popups/statistics');
      return response.data;
    },
    ...options,
  });
};

export const useDeleteVisitorPopup = (options?: UseMutationOptions<any, any, number>) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete(`/api/admin/visitor-popups/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'visitor-popups'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'visitor-popups', 'statistics'] });
    },
    ...options,
  });
};
