import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import api from '@/lib/api/axios';

export interface PromotionData {
  id?: number;
  name: string;
  description?: string;
  promotion_type: 'percentage' | 'fixed_amount' | 'flash_sale' | 'combo_offer' | 'free_delivery';
  discount_value: number;
  applies_to: 'all_products' | 'specific_products' | 'specific_brands' | 'specific_categories';
  apply_level: 'product' | 'cart';
  min_purchase_amount?: number;
  max_discount_amount?: number;
  starts_at: string;
  ends_at: string;
  is_active: boolean;
  priority: number;
  conditions?: {
    buy_quantity?: number;
    get_quantity?: number;
    [key: string]: any;
  };
  product_ids?: number[];
  brand_ids?: number[];
  category_ids?: number[];
}

interface PromotionParams {
  page?: number;
  per_page?: number;
  search?: string;
  status?: string;
}

export const useAdminPromotions = (params?: PromotionParams, options?: UseQueryOptions) => {
  return useQuery({
    queryKey: ['admin', 'promotions', params],
    queryFn: async () => {
      const response = await api.get('/api/admin/promotions', { params });
      return response.data;
    },
    ...options,
  });
};

export const useAdminPromotion = (id: number, options?: UseQueryOptions) => {
  return useQuery({
    queryKey: ['admin', 'promotion', id],
    queryFn: async () => {
      const response = await api.get(`/api/admin/promotions/${id}`);
      return response.data;
    },
    enabled: !!id,
    ...options,
  });
};

export const useCreatePromotion = (options?: UseMutationOptions<any, any, PromotionData>) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: PromotionData) => {
      const response = await api.post('/api/admin/promotions', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'promotions'] });
    },
    ...options,
  });
};

export const useUpdatePromotion = (options?: UseMutationOptions<any, any, { id: number; data: Partial<PromotionData> }>) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await api.put(`/api/admin/promotions/${id}`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'promotions'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'promotion', variables.id] });
    },
    ...options,
  });
};

export const useDeletePromotion = (options?: UseMutationOptions<any, any, number>) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete(`/api/admin/promotions/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'promotions'] });
    },
    ...options,
  });
};

export const useTogglePromotionStatus = (options?: UseMutationOptions<any, any, number>) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.post(`/api/admin/promotions/${id}/toggle`);
      return response.data;
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'promotions'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'promotion', id] });
    },
    ...options,
  });
};
