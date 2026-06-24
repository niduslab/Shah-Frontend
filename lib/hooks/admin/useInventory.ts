import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import api from '@/lib/api/axios';

interface InventoryFilters {
  search?: string;
  category_id?: number;
  stock_status?: 'low' | 'out' | 'in';
  sort_by?: string;
  per_page?: number;
  page?: number;
}

interface StockAdjustment {
  variation_id?: number | null;
  quantity: number;
  reason: 'adjustment' | 'damage' | 'return' | 'recount' | 'other';
  notes?: string;
}

interface BulkAdjustment {
  product_id: number;
  variation_id?: number | null;
  quantity: number;
}

export const useInventory = (filters?: InventoryFilters, options?: Partial<UseQueryOptions<any>>) => {
  return useQuery({
    queryKey: ['admin', 'inventory', filters],
    queryFn: async () => {
      const response = await api.get('/api/admin/inventory', { params: filters });
      return response.data;
    },
    ...options,
  });
};

export const useLowStockProducts = (options?: Partial<UseQueryOptions<any>>) => {
  return useQuery({
    queryKey: ['admin', 'inventory', 'low-stock'],
    queryFn: async () => {
      const response = await api.get('/api/admin/inventory/low-stock');
      return response.data;
    },
    ...options,
  });
};

export const useProductInventory = (productId: number, options?: Partial<UseQueryOptions<any>>) => {
  return useQuery({
    queryKey: ['admin', 'inventory', productId],
    queryFn: async () => {
      const response = await api.get(`/api/admin/inventory/${productId}`);
      return response.data;
    },
    enabled: !!productId,
    ...options,
  });
};

export const useAdjustStock = (
  options?: UseMutationOptions<any, any, { productId: number; data: StockAdjustment }>
) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ productId, data }) => {
      const response = await api.post(`/api/admin/inventory/${productId}/adjust`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'inventory'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'inventory', variables.productId] });
    },
    ...options,
  });
};

export const useBulkStockAdjustment = (
  options?: UseMutationOptions<any, any, { adjustments: BulkAdjustment[]; reason: string; notes?: string }>
) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data) => {
      const response = await api.post('/api/admin/inventory/bulk-adjust', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'inventory'] });
    },
    ...options,
  });
};

export const useInventoryLogs = (
  filters?: { product_id?: number; reason?: string; date_from?: string; per_page?: number; page?: number },
  options?: Partial<UseQueryOptions<any>>
) => {
  return useQuery({
    queryKey: ['admin', 'inventory', 'logs', filters],
    queryFn: async () => {
      const response = await api.get('/api/admin/inventory/logs', { params: filters });
      return response.data;
    },
    ...options,
  });
};
