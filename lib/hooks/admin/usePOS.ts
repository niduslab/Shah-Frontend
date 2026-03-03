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

export const useSearchPOSProducts = (search: string, options?: UseQueryOptions) => {
  return useQuery({
    queryKey: ['admin', 'pos', 'products', 'search', search],
    queryFn: async () => {
      const response = await api.get('/api/admin/pos/products/search', {
        params: { search },
      });
      return response.data;
    },
    enabled: !!search && search.length >= 2,
    ...options,
  });
};

export const useGetProductBySKU = (sku: string, options?: UseQueryOptions) => {
  return useQuery({
    queryKey: ['admin', 'pos', 'products', 'sku', sku],
    queryFn: async () => {
      const response = await api.get(`/api/admin/pos/products/sku/${sku}`);
      return response.data;
    },
    enabled: !!sku,
    ...options,
  });
};

export const useCalculatePOSOrder = (
  options?: UseMutationOptions<any, any, { items: CartItem[]; discount?: number }>
) => {
  return useMutation({
    mutationFn: async (data) => {
      const response = await api.post('/api/admin/pos/calculate', data);
      return response.data;
    },
    ...options,
  });
};

export const useCreatePOSOrder = (options?: UseMutationOptions<any, any, POSOrderData>) => {
  return useMutation({
    mutationFn: async (data: POSOrderData) => {
      const response = await api.post('/api/admin/pos/orders', data);
      return response.data;
    },
    ...options,
  });
};
