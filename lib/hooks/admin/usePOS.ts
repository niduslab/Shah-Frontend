import { useQuery, useMutation, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import api from '@/lib/api/axios';

interface CartItem {
  product_id: number;
  variation_id?: number | null;
  quantity: number;
}

interface POSOrderData {
  customer_name: string;
  customer_email?: string;
  customer_phone: string;
  items: CartItem[];
  discount?: number;
  payment_method: 'cash' | 'card' | 'manual';
  notes?: string;
}

interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
}

export const useSearchPOSProducts = (search: string, options?: Omit<UseQueryOptions<ApiResponse>, 'queryKey' | 'queryFn'>) => {
  return useQuery<ApiResponse>({
    queryKey: ['admin', 'pos', 'products', 'search', search],
    queryFn: async () => {
      // Use the existing products endpoint with search filter
      const response = await api.get('/api/admin/products', {
        params: { 
          search,
          per_page: 20,
          status: 'active' // Only show active products in POS
        },
      });
      return response.data;
    },
    enabled: !!search && search.length >= 2,
    ...options,
  });
};

export const useGetProductBySKU = (sku: string, options?: Omit<UseQueryOptions<ApiResponse>, 'queryKey' | 'queryFn'>) => {
  return useQuery<ApiResponse>({
    queryKey: ['admin', 'pos', 'products', 'sku', sku],
    queryFn: async () => {
      // Use the existing products endpoint with SKU filter
      const response = await api.get('/api/admin/products', {
        params: { 
          sku,
          per_page: 1,
          status: 'active'
        },
      });
      return response.data;
    },
    enabled: !!sku,
    ...options,
  });
};

export const useCalculatePOSOrder = (
  options?: Omit<UseMutationOptions<ApiResponse, any, { items: CartItem[]; discount?: number }>, 'mutationFn'>
) => {
  return useMutation<ApiResponse, any, { items: CartItem[]; discount?: number }>({
    mutationFn: async (data) => {
      const response = await api.post('/api/admin/pos/calculate', data);
      return response.data;
    },
    ...options,
  });
};

export const useCreatePOSOrder = (options?: Omit<UseMutationOptions<ApiResponse, any, POSOrderData>, 'mutationFn'>) => {
  return useMutation<ApiResponse, any, POSOrderData>({
    mutationFn: async (data: POSOrderData) => {
      const response = await api.post('/api/admin/pos/orders', data);
      return response.data;
    },
    ...options,
  });
};
