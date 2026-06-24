import { useQuery, useMutation, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import api from '@/lib/api/axios';

export const useRetryPayment = (options?: UseMutationOptions<any, any, string>) => {
  return useMutation({
    mutationFn: async (orderNumber: string) => {
      const response = await api.post(`/api/payments/${orderNumber}/retry`);
      return response.data;
    },
    ...options,
  });
};

export const usePayPreorderBalance = (options?: UseMutationOptions<any, any, string>) => {
  return useMutation({
    mutationFn: async (orderNumber: string) => {
      const response = await api.post(`/api/payments/${orderNumber}/pay-preorder-balance`);
      return response.data;
    },
    ...options,
  });
};

export const usePaymentStatus = (orderNumber: string, options?: Partial<UseQueryOptions<any>>) => {
  return useQuery({
    queryKey: ['payment-status', orderNumber],
    queryFn: async () => {
      const response = await api.get(`/api/payments/${orderNumber}/status`);
      return response.data;
    },
    enabled: !!orderNumber,
    ...options,
  });
};
