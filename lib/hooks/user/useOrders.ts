import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import api from '@/lib/api/axios';

interface OrderFilters {
  page?: number;
  per_page?: number;
  status?: string;
  search?: string;
  payment_status?: string;
  date_from?: string;
  date_to?: string;
}

export const useOrders = (filters?: OrderFilters, options?: Partial<UseQueryOptions<any>>) => {
  return useQuery({
    queryKey: ['orders', filters],
    queryFn: async () => {
      try {
        // Try the Laravel backend first
        const response = await api.get('/api/orders', { params: filters });
        return response.data;
      } catch (error: any) {
        // If Laravel endpoint fails, try the Next.js API
        if (error.response?.status === 404 || error.response?.status === 500) {
          console.log('Laravel endpoint failed, trying Next.js API...');
          const response = await fetch(`/api/orders?${new URLSearchParams(filters as any).toString()}`);
          if (!response.ok) throw new Error('Failed to fetch orders');
          return response.json();
        }
        throw error;
      }
    },
    ...options,
  });
};

export const useOrder = (orderNumber: string, options?: Partial<UseQueryOptions<any>>) => {
  return useQuery({
    queryKey: ['order', orderNumber],
    queryFn: async () => {
      const response = await api.get(`/api/orders/${orderNumber}`);
      return response.data;
    },
    enabled: !!orderNumber,
    ...options,
  });
};

export const useCancelOrder = (options?: UseMutationOptions<any, any, { orderNumber: string; reason: string }>) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ orderNumber, reason }: { orderNumber: string; reason: string }) => {
      const response = await api.post(`/api/orders/${orderNumber}/cancel`, { reason });
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['order', variables.orderNumber] });
    },
    ...options,
  });
};

export const useDownloadInvoice = (orderNumber: string) => {
  return async () => {
    try {
      const response = await api.get(`/api/orders/${orderNumber}/invoice`, {
        responseType: 'blob',
      });
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice-${orderNumber}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download invoice:', error);
      throw error;
    }
  };
};
