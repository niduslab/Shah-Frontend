import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import api from '@/lib/api/axios';

export const useTrackOrder = (orderNumber: string, options?: Partial<UseQueryOptions<any>>) => {
  return useQuery({
    queryKey: ['track-order', orderNumber],
    queryFn: async () => {
      const response = await api.get(`/api/orders/${orderNumber}/track`);
      return response.data;
    },
    enabled: !!orderNumber,
    ...options,
  });
};
