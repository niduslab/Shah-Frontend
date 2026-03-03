import { useMutation, UseMutationOptions } from '@tanstack/react-query';
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
