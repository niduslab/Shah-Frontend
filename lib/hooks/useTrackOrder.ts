import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import api from '@/lib/api/axios';

interface TrackingData {
  order_number: string;
  status: string;
  shipping_method: string;
  tracking_number: string;
  created_at: string;
  updated_at: string;
}

export const useTrackOrder = (orderNumber: string | null, options?: UseQueryOptions) => {
  return useQuery({
    queryKey: ['track-order', orderNumber],
    queryFn: async () => {
      if (!orderNumber) throw new Error('Order number is required');
      
      const response = await api.get(`/api/orders/${orderNumber}/track`);
      return response.data.data as TrackingData;
    },
    enabled: !!orderNumber,
    ...options,
  });
};
