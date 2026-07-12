import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions, keepPreviousData } from '@tanstack/react-query';
import api from '@/lib/api/axios';

interface OrderFilters {
  page?: number;
  per_page?: number;
  status?: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  payment_status?: 'pending' | 'partial' | 'paid' | 'failed' | 'refunded';
  order_type?: 'regular' | 'preorder';
  date_from?: string;
  date_to?: string;
  search?: string;
}

type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

interface RecordPaymentData {
  amount: number;
  payment_method: 'cash' | 'bkash' | 'nagad' | 'bank_transfer' | 'card' | 'manual';
  reference_number?: string;
  note?: string;
  proof?: File;
}

export const useAdminOrders = (filters?: OrderFilters, options?: Partial<UseQueryOptions<any>>) => {
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

export const useAdminOrder = (id: number, options?: Partial<UseQueryOptions<any>>) => {
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

export const useRecordOrderPayment = (
  options?: UseMutationOptions<any, any, { id: number; data: RecordPaymentData }>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: RecordPaymentData }) => {
      const formData = new FormData();
      formData.append('amount', data.amount.toString());
      formData.append('payment_method', data.payment_method);

      if (data.reference_number) {
        formData.append('reference_number', data.reference_number);
      }
      if (data.note) {
        formData.append('note', data.note);
      }
      if (data.proof instanceof File) {
        formData.append('proof', data.proof);
      }

      const response = await api.post(`/api/admin/orders/${id}/record-payment`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'orders'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'order', variables.id] });
    },
    ...options,
  });
};
