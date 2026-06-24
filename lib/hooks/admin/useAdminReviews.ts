import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import api from '@/lib/api/axios';

interface ReviewFilters {
  page?: number;
  per_page?: number;
  status?: 'pending' | 'approved' | 'rejected';
  product_id?: number;
}

export const useAdminReviews = (filters?: ReviewFilters, options?: Partial<UseQueryOptions<any>>) => {
  return useQuery({
    queryKey: ['admin', 'reviews', filters],
    queryFn: async () => {
      const response = await api.get('/api/admin/reviews', { params: filters });
      return response.data;
    },
    ...options,
  });
};

export const useReviewStatistics = (options?: Partial<UseQueryOptions<any>>) => {
  return useQuery({
    queryKey: ['admin', 'reviews', 'statistics'],
    queryFn: async () => {
      const response = await api.get('/api/admin/reviews/statistics');
      return response.data;
    },
    ...options,
  });
};

export const useAdminReview = (id: number, options?: Partial<UseQueryOptions<any>>) => {
  return useQuery({
    queryKey: ['admin', 'review', id],
    queryFn: async () => {
      const response = await api.get(`/api/admin/reviews/${id}`);
      return response.data;
    },
    enabled: !!id,
    ...options,
  });
};

export const useApproveReview = (options?: UseMutationOptions<any, any, number>) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.post(`/api/admin/reviews/${id}/approve`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'reviews'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'reviews', 'statistics'] });
    },
    ...options,
  });
};

export const useRejectReview = (options?: UseMutationOptions<any, any, { id: number; reason: string }>) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, reason }) => {
      const response = await api.post(`/api/admin/reviews/${id}/reject`, { reason });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'reviews'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'reviews', 'statistics'] });
    },
    ...options,
  });
};

export const useRespondToReview = (options?: UseMutationOptions<any, any, { id: number; response: string }>) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, response }) => {
      const response_data = await api.post(`/api/admin/reviews/${id}/respond`, { response });
      return response_data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'review', variables.id] });
    },
    ...options,
  });
};

export const useDeleteReview = (options?: UseMutationOptions<any, any, number>) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete(`/api/admin/reviews/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'reviews'] });
    },
    ...options,
  });
};
