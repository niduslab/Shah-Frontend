import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions, keepPreviousData } from '@tanstack/react-query';
import api from '@/lib/api/axios';

interface OrderFilters {
  page?: number;
  per_page?: number;
  status?: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  payment_status?: 'pending' | 'paid' | 'failed' | 'refunded';
  order_type?: 'regular' | 'preorder';
  date_from?: string;
  date_to?: string;
  search?: string;
}

type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export const useAdminOrders = (filters?: OrderFilters, options?: UseQueryOptions) => {
  return useQuery({
    queryKey: ['admin', 'orders', filters],
    queryFn: async () => {
      const response = await api.get('/api/admin/orders', { params: filters });
      return response.data;
    },
    placeholderData: keepPreviousData,
    ...options,
  });
};

export const useAdminOrder = (id: number, options?: UseQueryOptions) => {
  return useQuery({
    queryKey: ['admin', 'order', id],
    queryFn: async () => {
      const response = await api.get(`/api/admin/orders/${id}`);
      return response.data;
    },
    enabled: !!id,
    ...options,
  });
};

export const useUpdateOrderStatus = (options?: UseMutationOptions<any, any, { id: number; status: OrderStatus }>) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, status }: { id: number; status: OrderStatus }) => {
      const response = await api.put(`/api/admin/orders/${id}/status`, { status });
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'orders'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'order', variables.id] });
    },
    ...options,
  });
};

export const useCancelAdminOrder = (options?: UseMutationOptions<any, any, { id: number; reason: string }>) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, reason }: { id: number; reason: string }) => {
      const response = await api.post(`/api/admin/orders/${id}/cancel`, { reason });
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'orders'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'order', variables.id] });
    },
    ...options,
  });
};

export const useAssignTracking = (
  options?: UseMutationOptions<any, any, { id: number; tracking_number: string; carrier: string }>
) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, tracking_number, carrier }) => {
      const response = await api.post(`/api/admin/orders/${id}/tracking`, { tracking_number, carrier });
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'order', variables.id] });
    },
    ...options,
  });
};

export const useUpdateOrderNotes = (options?: UseMutationOptions<any, any, { id: number; notes: string }>) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, notes }: { id: number; notes: string }) => {
      const response = await api.put(`/api/admin/orders/${id}/notes`, { notes });
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'order', variables.id] });
    },
    ...options,
  });
};
