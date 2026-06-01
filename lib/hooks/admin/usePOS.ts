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

interface QuotationData {
  customer_name: string;
  customer_email?: string;
  customer_phone?: string;
  items: CartItem[];
  discount?: number;
  notes?: string;
}

export const useGenerateQuotation = (options?: Omit<UseMutationOptions<void, any, QuotationData>, 'mutationFn'>) => {
  return useMutation<void, any, QuotationData>({
    mutationFn: async (data: QuotationData) => {
      const response = await api.post('/api/admin/pos/quotation', data, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      const disposition = response.headers['content-disposition'];
      const match = disposition?.match(/filename="?([^"]+)"?/);
      link.download = match ? match[1] : 'quotation.pdf';
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    },
    ...options,
  });
};
