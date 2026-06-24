import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import api from '@/lib/api/axios';

interface ReportFilters {
  date_from?: string;
  date_to?: string;
  group_by?: 'day' | 'week' | 'month' | 'year';
  limit?: number;
}

export const useSalesReport = (filters?: ReportFilters, options?: Partial<UseQueryOptions<any>>) => {
  return useQuery({
    queryKey: ['admin', 'reports', 'sales', filters],
    queryFn: async () => {
      const response = await api.get('/api/admin/reports/sales', { params: filters });
      return response.data;
    },
    ...options,
  });
};

export const useProductsReport = (filters?: ReportFilters, options?: Partial<UseQueryOptions<any>>) => {
  return useQuery({
    queryKey: ['admin', 'reports', 'products', filters],
    queryFn: async () => {
      const response = await api.get('/api/admin/reports/products', { params: filters });
      return response.data;
    },
    ...options,
  });
};

export const useCustomersReport = (filters?: ReportFilters, options?: Partial<UseQueryOptions<any>>) => {
  return useQuery({
    queryKey: ['admin', 'reports', 'customers', filters],
    queryFn: async () => {
      const response = await api.get('/api/admin/reports/customers', { params: filters });
      return response.data;
    },
    ...options,
  });
};

export const useInventoryReport = (options?: Partial<UseQueryOptions<any>>) => {
  return useQuery({
    queryKey: ['admin', 'reports', 'inventory'],
    queryFn: async () => {
      const response = await api.get('/api/admin/reports/inventory');
      return response.data;
    },
    ...options,
  });
};

export const useOrderStatusReport = (filters?: Omit<ReportFilters, 'group_by' | 'limit'>, options?: Partial<UseQueryOptions<any>>) => {
  return useQuery({
    queryKey: ['admin', 'reports', 'order-status', filters],
    queryFn: async () => {
      const response = await api.get('/api/admin/reports/order-status', { params: filters });
      return response.data;
    },
    ...options,
  });
};
