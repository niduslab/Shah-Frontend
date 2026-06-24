import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import api from '@/lib/api/axios';

type AddressType = 'user_address' | 'shipping_address' | 'billing_address';

interface AddressData {
  address_line_1: string;
  address_line_2?: string;
  contact_no: string;
  city: string;
  state: string;
  zip_code: string;
  address_type: AddressType;
  is_default?: boolean;
}

export const useAddresses = (options?: Partial<UseQueryOptions<any>>) => {
  return useQuery({
    queryKey: ['addresses'],
    queryFn: async () => {
      const response = await api.get('/api/addresses');
      return response.data;
    },
    ...options,
  });
};

export const useAddress = (id: number, options?: Partial<UseQueryOptions<any>>) => {
  return useQuery({
    queryKey: ['address', id],
    queryFn: async () => {
      const response = await api.get(`/api/addresses/${id}`);
      return response.data;
    },
    enabled: !!id,
    ...options,
  });
};

export const useCreateAddress = (options?: UseMutationOptions<any, any, AddressData>) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: AddressData) => {
      const response = await api.post('/api/addresses', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
    },
    ...options,
  });
};

export const useUpdateAddress = (options?: UseMutationOptions<any, any, { id: number; data: Partial<AddressData> }>) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<AddressData> }) => {
      const response = await api.put(`/api/addresses/${id}`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      queryClient.invalidateQueries({ queryKey: ['address', variables.id] });
    },
    ...options,
  });
};

export const useDeleteAddress = (options?: UseMutationOptions<any, any, number>) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete(`/api/addresses/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
    },
    ...options,
  });
};

export const useSetDefaultAddress = (options?: UseMutationOptions<any, any, number>) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.post(`/api/addresses/${id}/set-default`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
    },
    ...options,
  });
};
