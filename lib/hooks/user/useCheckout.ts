import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import api from '@/lib/api/axios';

interface CartItem {
  product_id: number;
  variation_id?: number | null;
  quantity: number;
}

interface ShippingMethodsRequest {
  items: CartItem[];
  shipping_address_id: number;
}

interface OrderPreviewRequest {
  items: CartItem[];
  shipping_address_id: number;
  billing_address_id: number;
  shipping_method: string;
  coupon_code?: string;
}

interface CheckoutRequest {
  items: CartItem[];
  shipping_address_id: number;
  billing_address_id: number;
  shipping_method: string;
  payment_method: string;
  coupon_code?: string;
  notes?: string;
}

export const useGetShippingMethods = (options?: UseMutationOptions<any, any, ShippingMethodsRequest>) => {
  return useMutation({
    mutationFn: async (data: ShippingMethodsRequest) => {
      const response = await api.post('/api/checkout/shipping-methods', data);
      return response.data;
    },
    ...options,
  });
};

export const usePreviewOrder = (options?: UseMutationOptions<any, any, OrderPreviewRequest>) => {
  return useMutation({
    mutationFn: async (data: OrderPreviewRequest) => {
      const response = await api.post('/api/checkout/preview', data);
      return response.data;
    },
    ...options,
  });
};

export const useProcessCheckout = (options?: UseMutationOptions<any, any, CheckoutRequest>) => {
  return useMutation({
    mutationFn: async (data: CheckoutRequest) => {
      const response = await api.post('/api/checkout/process', data);
      return response.data;
    },
    ...options,
  });
};
