import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import api from '@/lib/api/axios';

// Types
export interface ShippingRate {
  id: number;
  name: string;
  method: 'shah_sports_team' | 'pathao_courier';
  shipping_class_id: number | null;
  zone: string | null;
  base_cost: number;
  per_kg_cost: number | null;
  min_weight: number | null;
  max_weight: number | null;
  free_shipping_threshold: number | null;
  delivery_time: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ShippingClass {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  products_count: number;
  created_at: string;
  updated_at: string;
}

export interface ShippingRateData {
  name: string;
  method: 'shah_sports_team' | 'pathao_courier';
  shipping_class_id?: number | null;
  zone?: string | null;
  base_cost: number;
  per_kg_cost?: number | null;
  min_weight?: number | null;
  max_weight?: number | null;
  free_shipping_threshold?: number | null;
  delivery_time?: string | null;
  is_active?: boolean;
}

export interface ShippingClassData {
  name: string;
  description?: string | null;
}

// Shipping Rates Hooks
export const useShippingRates = (
  params?: { 
    method?: string; 
    is_active?: string; 
    page?: number; 
    per_page?: number;
  },
  options?: Partial<UseQueryOptions<any>>
) => {
  return useQuery({
    queryKey: ['admin', 'shipping-rates', params],
    queryFn: async () => {
      const response = await api.get('/api/admin/shipping-rates', { params });
      return response.data;
    },
    ...options,
  });
};

export const useShippingRate = (id: number, options?: Partial<UseQueryOptions<any>>) => {
  return useQuery({
    queryKey: ['admin', 'shipping-rate', id],
    queryFn: async () => {
      const response = await api.get(`/api/admin/shipping-rates/${id}`);
      return response.data;
    },
    enabled: !!id,
    ...options,
  });
};

export const useCreateShippingRate = (options?: UseMutationOptions<any, any, ShippingRateData>) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: ShippingRateData) => {
      const response = await api.post('/api/admin/shipping-rates', data);
      return response.data;
    },
    onSuccess: async (data, variables, onMutateResult, context) => {
      await queryClient.invalidateQueries({ queryKey: ['admin', 'shipping-rates'] });
      options?.onSuccess?.(data, variables, onMutateResult, context);
    },
    onError: options?.onError,
  });
};

export const useUpdateShippingRate = (
  options?: UseMutationOptions<any, any, { id: number; data: Partial<ShippingRateData> }>
) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await api.put(`/api/admin/shipping-rates/${id}`, data);
      return response.data;
    },
    onSuccess: async (data, variables, onMutateResult, context) => {
      await queryClient.invalidateQueries({ queryKey: ['admin', 'shipping-rates'] });
      await queryClient.invalidateQueries({ queryKey: ['admin', 'shipping-rate', variables.id] });
      options?.onSuccess?.(data, variables, onMutateResult, context);
    },
    onError: options?.onError,
  });
};

export const useDeleteShippingRate = (options?: UseMutationOptions<any, any, number>) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete(`/api/admin/shipping-rates/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'shipping-rates'] });
    },
    ...options,
  });
};

// Shipping Classes Hooks
export const useShippingClasses = (options?: Partial<UseQueryOptions<any>>) => {
  return useQuery({
    queryKey: ['admin', 'shipping-classes'],
    queryFn: async () => {
      const response = await api.get('/api/admin/shipping-classes');
      return response.data;
    },
    ...options,
  });
};

export const useShippingClass = (id: number, options?: Partial<UseQueryOptions<any>>) => {
  return useQuery({
    queryKey: ['admin', 'shipping-class', id],
    queryFn: async () => {
      const response = await api.get(`/api/admin/shipping-classes/${id}`);
      return response.data;
    },
    enabled: !!id,
    ...options,
  });
};

export const useCreateShippingClass = (options?: UseMutationOptions<any, any, ShippingClassData>) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restOptions } = options || {};

  return useMutation({
    mutationFn: async (data: ShippingClassData) => {
      const response = await api.post('/api/admin/shipping-classes', data);
      return response.data;
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'shipping-classes'] });
      onSuccess?.(data, variables, context);
    },
    ...restOptions,
  });
};

export const useUpdateShippingClass = (
  options?: UseMutationOptions<any, any, { id: number; data: Partial<ShippingClassData> }>
) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restOptions } = options || {};

  return useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await api.put(`/api/admin/shipping-classes/${id}`, data);
      return response.data;
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'shipping-classes'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'shipping-class', variables.id] });
      onSuccess?.(data, variables, context);
    },
    ...restOptions,
  });
};

export const useDeleteShippingClass = (options?: UseMutationOptions<any, any, number>) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restOptions } = options || {};

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete(`/api/admin/shipping-classes/${id}`);
      return response.data;
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'shipping-classes'] });
      onSuccess?.(data, variables, context);
    },
    ...restOptions,
  });
};
