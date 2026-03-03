import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import api from '@/lib/api/axios';

interface ProductFilters {
  page?: number;
  per_page?: number;
  search?: string;
  category_id?: number;
  status?: 'active' | 'inactive' | 'draft';
}

interface ProductData {
  category_id: number;
  brand_id: number;
  name: string;
  sku: string;
  description: string;
  short_description?: string;
  price: number;
  compare_price?: number;
  cost_price?: number;
  quantity: number;
  low_stock_threshold?: number;
  weight?: number;
  weight_unit?: string;
  is_featured?: boolean;
  is_trending?: boolean;
  status?: string;
  meta_title?: string;
  meta_description?: string;
}

interface VariationData {
  sku: string;
  price: number;
  quantity: number;
  attributes: Record<string, string>;
}

export const useAdminProducts = (filters?: ProductFilters, options?: UseQueryOptions) => {
  return useQuery({
    queryKey: ['admin', 'products', filters],
    queryFn: async () => {
      const response = await api.get('/api/admin/products', { params: filters });
      return response.data;
    },
    ...options,
  });
};

export const useAdminProduct = (id: number, options?: UseQueryOptions) => {
  return useQuery({
    queryKey: ['admin', 'product', id],
    queryFn: async () => {
      const response = await api.get(`/api/admin/products/${id}`);
      return response.data;
    },
    enabled: !!id,
    ...options,
  });
};

export const useCreateProduct = (options?: UseMutationOptions<any, any, ProductData>) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: ProductData) => {
      const response = await api.post('/api/admin/products', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
    },
    ...options,
  });
};

export const useUpdateProduct = (options?: UseMutationOptions<any, any, { id: number; data: Partial<ProductData> }>) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<ProductData> }) => {
      const response = await api.put(`/api/admin/products/${id}`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'product', variables.id] });
    },
    ...options,
  });
};

export const useDeleteProduct = (options?: UseMutationOptions<any, any, number>) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete(`/api/admin/products/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
    },
    ...options,
  });
};

export const useAddProductVariation = (options?: UseMutationOptions<any, any, { productId: number; data: VariationData }>) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ productId, data }: { productId: number; data: VariationData }) => {
      const response = await api.post(`/api/admin/products/${productId}/variations`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'product', variables.productId] });
    },
    ...options,
  });
};

export const useUpdateProductVariation = (
  options?: UseMutationOptions<any, any, { productId: number; variationId: number; data: Partial<VariationData> }>
) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ productId, variationId, data }) => {
      const response = await api.put(`/api/admin/products/${productId}/variations/${variationId}`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'product', variables.productId] });
    },
    ...options,
  });
};

export const useDeleteProductVariation = (
  options?: UseMutationOptions<any, any, { productId: number; variationId: number }>
) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ productId, variationId }) => {
      const response = await api.delete(`/api/admin/products/${productId}/variations/${variationId}`);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'product', variables.productId] });
    },
    ...options,
  });
};
