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
  discount_type?: 'percent' | 'flat';
  shipping_cost?: number;
  shipping_address_line1?: string;
  shipping_address_line2?: string;
  shipping_city?: string;
  shipping_state?: string;
  shipping_zip_code?: string;
  payment_method: 'cash' | 'card' | 'manual' | 'bkash' | 'nagad' | 'bank_transfer';
  reference_number?: string;
  payment_note?: string;
  proof?: File;
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

interface CalculatePOSOrderData {
  items: CartItem[];
  discount?: number;
  discount_type?: 'percent' | 'flat';
  shipping_cost?: number;
}

export const useCalculatePOSOrder = (
  options?: Omit<UseMutationOptions<ApiResponse, any, CalculatePOSOrderData>, 'mutationFn'>
) => {
  return useMutation<ApiResponse, any, CalculatePOSOrderData>({
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
      const formData = new FormData();
      formData.append('customer_name', data.customer_name);
      if (data.customer_email) formData.append('customer_email', data.customer_email);
      formData.append('customer_phone', data.customer_phone);
      formData.append('items', JSON.stringify(data.items));
      if (data.discount !== undefined) formData.append('discount', data.discount.toString());
      if (data.discount_type) formData.append('discount_type', data.discount_type);
      if (data.shipping_cost !== undefined) formData.append('shipping_cost', data.shipping_cost.toString());
      if (data.shipping_address_line1) formData.append('shipping_address_line1', data.shipping_address_line1);
      if (data.shipping_address_line2) formData.append('shipping_address_line2', data.shipping_address_line2);
      if (data.shipping_city) formData.append('shipping_city', data.shipping_city);
      if (data.shipping_state) formData.append('shipping_state', data.shipping_state);
      if (data.shipping_zip_code) formData.append('shipping_zip_code', data.shipping_zip_code);
      formData.append('payment_method', data.payment_method);
      if (data.reference_number) formData.append('reference_number', data.reference_number);
      if (data.payment_note) formData.append('payment_note', data.payment_note);
      if (data.proof instanceof File) formData.append('proof', data.proof);
      if (data.notes) formData.append('notes', data.notes);

      const response = await api.post('/api/admin/pos/orders', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
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
