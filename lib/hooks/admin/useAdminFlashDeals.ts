import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import api from '@/lib/api/axios';

interface FlashDealData {
  title: string;
  description?: string;
  starts_at: string;
  ends_at: string;
  discount_type: 'percentage' | 'fixed_amount';
  discount_value: number;
  max_discount_amount?: number;
  quantity_limit?: number;
  per_user_limit?: number;
  is_active?: boolean;
  priority?: number;
  products?: Array<{
    product_id: number;
    flash_price: number;
    quantity_limit?: number;
  }>;
}

export const useAdminFlashDeals = (
  params?: { status?: 'active' | 'inactive'; page?: number; per_page?: number },
  options?: Partial<UseQueryOptions<any>>
) => {
  return useQuery({
    queryKey: ['admin', 'flash-deals', params],
    queryFn: async () => {
      const response = await api.get('/api/admin/flash-deals', { params });
      return response.data;
    },
    ...options,
  });
};

export const useAdminFlashDeal = (id: number, options?: Partial<UseQueryOptions<any>>) => {
  return useQuery({
    queryKey: ['admin', 'flash-deal', id],
    queryFn: async () => {
      const response = await api.get(`/api/admin/flash-deals/${id}`);
      return response.data;
    },
    enabled: !!id,
    ...options,
  });
};

export const useCreateFlashDeal = (options?: UseMutationOptions<any, any, FlashDealData>) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: FlashDealData) => {
      const response = await api.post('/api/admin/flash-deals', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'flash-deals'] });
    },
    ...options,
  });
};

export const useUpdateFlashDeal = (
  options?: UseMutationOptions<any, any, { id: number; data: Partial<FlashDealData> }>
) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await api.put(`/api/admin/flash-deals/${id}`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'flash-deals'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'flash-deal', variables.id] });
    },
    ...options,
  });
};

export const useDeleteFlashDeal = (options?: UseMutationOptions<any, any, number>) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete(`/api/admin/flash-deals/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'flash-deals'] });
    },
    ...options,
  });
};

export const useToggleFlashDeal = (options?: UseMutationOptions<any, any, number>) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.post(`/api/admin/flash-deals/${id}/toggle`);
      return response.data;
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'flash-deals'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'flash-deal', id] });
    },
    ...options,
  });
};

export const useFlashDealStatistics = (id: number, options?: Partial<UseQueryOptions<any>>) => {
  return useQuery({
    queryKey: ['admin', 'flash-deal', id, 'statistics'],
    queryFn: async () => {
      const response = await api.get(`/api/admin/flash-deals/${id}/statistics`);
      return response.data;
    },
    enabled: !!id,
    ...options,
  });
};
