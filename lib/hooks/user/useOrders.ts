import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import api from '@/lib/api/axios';

interface OrderFilters {
  page?: number;
  per_page?: number;
}

export const useOrders = (filters?: OrderFilters, options?: UseQueryOptions<any>) => {
  return useQuery({
    queryKey: ['orders', filters],
    queryFn: async () => {
      const response = await api.get('/api/orders', { params: filters });
      return response.data;
    },
    ...options,
  });
};

export const useOrder = (orderNumber: string, options?: UseQueryOptions<any>) => {
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
  };
};
