import { useMutation, useQuery, UseMutationOptions, UseQueryOptions } from '@tanstack/react-query';
import api from '@/lib/api/axios';

interface CartItem {
  product_id: number;
  variation_id?: number | null;
  quantity: number;
}

interface CartSummaryRequest {
  items: CartItem[];
}

interface CouponValidationRequest {
  code: string;
  items: CartItem[];
  subtotal: number;
}

interface AvailabilityCheckRequest {
  items: CartItem[];
}

export const useCalculateCartSummary = (options?: UseMutationOptions<any, any, CartSummaryRequest>) => {
  return useMutation({
    mutationFn: async (data: CartSummaryRequest) => {
      const response = await api.post('/api/cart/summary', data);
      return response.data;
    },
    ...options,
  });
};

export const useValidateCoupon = (options?: UseMutationOptions<any, any, CouponValidationRequest>) => {
  return useMutation({
    mutationFn: async (data: CouponValidationRequest) => {
      const response = await api.post('/api/cart/validate-coupon', data);
      return response.data;
    },
    ...options,
  });
};

export const useCheckAvailability = (options?: UseMutationOptions<any, any, AvailabilityCheckRequest>) => {
  return useMutation({
    mutationFn: async (data: AvailabilityCheckRequest) => {
      const response = await api.post('/api/cart/check-availability', data);
      return response.data;
    },
    ...options,
  });
};

export const useAvailableCoupons = (options?: UseQueryOptions<any, any, any>) => {
  return useQuery({
    queryKey: ['available-coupons'],
    queryFn: async () => {
      const response = await api.get('/api/cart/available-coupons');
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
};
