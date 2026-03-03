import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import api from '@/lib/api/axios';

interface ReturnRequestData {
  order_item_id: number;
  quantity: number;
  reason: string;
  description: string;
  images?: string[];
}

export const useReturns = (options?: UseQueryOptions) => {
  return useQuery({
    queryKey: ['returns'],
    queryFn: async () => {
      const response = await api.get('/api/returns');
      return response.data;
    },
    ...options,
  });
};

export const useReturn = (id: number, options?: UseQueryOptions) => {
  return useQuery({
    queryKey: ['return', id],
    queryFn: async () => {
      const response = await api.get(`/api/returns/${id}`);
      return response.data;
    },
    enabled: !!id,
    ...options,
  });
};

export const useCreateReturn = (options?: UseMutationOptions<any, any, ReturnRequestData>) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: ReturnRequestData) => {
      const response = await api.post('/api/returns', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['returns'] });
    },
    ...options,
  });
};
