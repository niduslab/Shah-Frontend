import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import api from '@/lib/api/axios';

interface ReturnRequestData {
  order_item_id: number;
  quantity: number;
  reason: string;
  description: string;
  images?: string[];
}

interface ReturnsQueryParams {
  page?: number;
  per_page?: number;
  status?: string;
  search?: string;
}

export const useReturns = (params?: ReturnsQueryParams, options?: Partial<UseQueryOptions<any>>) => {
  return useQuery({
    queryKey: ['returns', params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params?.page) searchParams.append('page', params.page.toString());
      if (params?.per_page) searchParams.append('per_page', params.per_page.toString());
      if (params?.status) searchParams.append('status', params.status);
      if (params?.search) searchParams.append('search', params.search);
      
      const response = await api.get(`/api/returns?${searchParams.toString()}`);
      return response.data;
    },
    ...options,
  });
};

export const useReturn = (id: number, options?: Partial<UseQueryOptions<any>>) => {
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
