import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import api from '@/lib/api/axios';

// ============================================
// TYPES
// ============================================

interface VariationType {
  id: number;
  name: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  options?: VariationOption[];
}

interface VariationOption {
  id: number;
  variation_id: number;
  value: string;
  label?: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface CreateVariationTypeData {
  name: string;
  description?: string;
  is_active?: boolean;
}

interface CreateVariationOptionData {
  value: string;
  label?: string;
  sort_order?: number;
  is_active?: boolean;
}

interface BulkCreateOptionsData {
  options: CreateVariationOptionData[];
}

// ============================================
// VARIATION TYPES HOOKS
// ============================================

/**
 * Get all variation types with their options
 */
export const useAdminVariations = (options?: UseQueryOptions) => {
  return useQuery({
    queryKey: ['admin', 'variations'],
    queryFn: async () => {
      const response = await api.get('/api/admin/variations');
      return response.data;
    },
    ...options,
  });
};

/**
 * Get single variation type with options
 */
export const useAdminVariation = (id: number, options?: UseQueryOptions) => {
  return useQuery({
    queryKey: ['admin', 'variation', id],
    queryFn: async () => {
      const response = await api.get(`/api/admin/variations/${id}`);
      return response.data;
    },
    enabled: !!id,
    ...options,
  });
};

/**
 * Create new variation type
 */
export const useCreateVariationType = (options?: UseMutationOptions<any, any, CreateVariationTypeData>) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreateVariationTypeData) => {
      const response = await api.post('/api/admin/variations', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'variations'] });
    },
    ...options,
  });
};

/**
 * Update variation type
 */
export const useUpdateVariationType = (
  options?: UseMutationOptions<any, any, { id: number; data: Partial<CreateVariationTypeData> }>
) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<CreateVariationTypeData> }) => {
      const response = await api.put(`/api/admin/variations/${id}`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'variations'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'variation', variables.id] });
    },
    ...options,
  });
};

/**
 * Delete variation type
 */
export const useDeleteVariationType = (options?: UseMutationOptions<any, any, number>) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete(`/api/admin/variations/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'variations'] });
    },
    ...options,
  });
};

// ============================================
// VARIATION OPTIONS HOOKS
// ============================================

/**
 * Get all options for a variation type
 */
export const useVariationOptions = (variationId: number, options?: UseQueryOptions) => {
  return useQuery({
    queryKey: ['admin', 'variation', variationId, 'options'],
    queryFn: async () => {
      const response = await api.get(`/api/admin/variations/${variationId}/options`);
      return response.data;
    },
    enabled: !!variationId,
    ...options,
  });
};

/**
 * Create single variation option
 */
export const useCreateVariationOption = (
  options?: UseMutationOptions<any, any, { variationId: number; data: CreateVariationOptionData }>
) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ variationId, data }: { variationId: number; data: CreateVariationOptionData }) => {
      const response = await api.post(`/api/admin/variations/${variationId}/options`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'variations'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'variation', variables.variationId] });
    },
    ...options,
  });
};

/**
 * Bulk create variation options
 */
export const useBulkCreateVariationOptions = (
  options?: UseMutationOptions<any, any, { variationId: number; data: BulkCreateOptionsData }>
) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ variationId, data }: { variationId: number; data: BulkCreateOptionsData }) => {
      const response = await api.post(`/api/admin/variations/${variationId}/options/bulk`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'variations'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'variation', variables.variationId] });
    },
    ...options,
  });
};

/**
 * Update variation option
 */
export const useUpdateVariationOption = (
  options?: UseMutationOptions<any, any, { variationId: number; optionId: number; data: Partial<CreateVariationOptionData> }>
) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ variationId, optionId, data }) => {
      const response = await api.put(`/api/admin/variations/${variationId}/options/${optionId}`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'variations'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'variation', variables.variationId] });
    },
    ...options,
  });
};

/**
 * Delete variation option
 */
export const useDeleteVariationOption = (
  options?: UseMutationOptions<any, any, { variationId: number; optionId: number }>
) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ variationId, optionId }) => {
      const response = await api.delete(`/api/admin/variations/${variationId}/options/${optionId}`);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'variations'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'variation', variables.variationId] });
    },
    ...options,
  });
};

// ============================================
// EXPORT TYPES
// ============================================

export type {
  VariationType,
  VariationOption,
  CreateVariationTypeData,
  CreateVariationOptionData,
  BulkCreateOptionsData,
};
