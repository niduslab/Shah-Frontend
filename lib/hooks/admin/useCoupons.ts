import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import api from '@/lib/api/axios';

interface CouponData {
  code: string;
  type: 'percentage' | 'fixed_amount' | 'free_shipping';
  value: number;
  max_discount_amount?: number;
  min_purchase_amount?: number;
  usage_limit?: number;
  per_user_limit?: number;
  starts_at: string;
  expires_at: string;
  is_active?: boolean;
  applicable_to: 'all' | 'specific_products' | 'specific_categories';
}

export const useAdminCoupons = (params?: { page?: number; per_page?: number }, options?: UseQueryOptions) => {
  return useQuery({
    queryKey: ['admin', 'coupons', params],
    queryFn: async () => {
      const response = await api.get('/api/admin/coupons', { params });
      return response.data;
    },
    ...options,
  });
};

export const useAdminCoupon = (id: number, options?: UseQueryOptions) => {
  return useQuery({
    queryKey: ['admin', 'coupon', id],
    queryFn: async () => {
      const response = await api.get(`/api/admin/coupons/${id}`);
      return response.data;
    },
    enabled: !!id,
    ...options,
  });
};

export const useCreateCoupon = (options?: UseMutationOptions<any, any, CouponData>) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CouponData) => {
      const response = await api.post('/api/admin/coupons', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'coupons'] });
    },
    ...options,
  });
};

export const useUpdateCoupon = (options?: UseMutationOptions<any, any, { id: number; data: Partial<CouponData> }>) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await api.put(`/api/admin/coupons/${id}`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'coupons'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'coupon', variables.id] });
    },
    ...options,
  });
};

export const useDeleteCoupon = (options?: UseMutationOptions<any, any, number>) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete(`/api/admin/coupons/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'coupons'] });
    },
    ...options,
  });
};

export const useCouponUsageHistory = (
  id: number,
  params?: { page?: number; per_page?: number },
  options?: UseQueryOptions
) => {
  return useQuery({
    queryKey: ['admin', 'coupon', id, 'usage', params],
    queryFn: async () => {
      const response = await api.get(`/api/admin/coupons/${id}/usage`, { params });
      return response.data;
    },
    enabled: !!id,
    ...options,
  });
};
