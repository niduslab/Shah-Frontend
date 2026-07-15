import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import api from '@/lib/api/axios';

interface CouponData {
  code?: string;
  name?: string;
  discount_type: 'percentage' | 'fixed' | 'free_shipping';
  discount_value: number;
  applies_to: 'all' | 'products' | 'brands' | 'categories';
  min_purchase_amount?: number;
  max_discount_amount?: number;
  usage_limit?: number;
  once_per_customer?: boolean;
  starts_at?: string;
  expires_at?: string;
  is_active?: boolean;
  is_public?: boolean;
  product_ids?: number[];
  brand_ids?: number[];
  category_ids?: number[];
}

export const useAdminCoupons = (params?: { page?: number; per_page?: number }, options?: Partial<UseQueryOptions<any>>) => {
  return useQuery({
    queryKey: ['admin', 'coupons', params],
    queryFn: async () => {
      const response = await api.get('/api/admin/coupons', { params });
      return response.data;
    },
    ...options,
  });
};

export const useAdminCoupon = (id: number, options?: Partial<UseQueryOptions<any>>) => {
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
  options?: Partial<UseQueryOptions<any>>
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
