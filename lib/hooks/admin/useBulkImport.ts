import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import api from '@/lib/api/axios';

interface ImportFilters {
  status?: string;
  per_page?: number;
  page?: number;
}

// List all imports
export function useBulkImports(filters?: ImportFilters, options?: UseQueryOptions) {
  return useQuery({
    queryKey: ['admin', 'bulk-imports', filters],
    queryFn: async () => {
      const response = await api.get('/api/admin/products/import', { params: filters });
      return response.data;
    },
    ...options,
  });
}

// Get single import status
export function useImportStatus(importId: number, options?: UseQueryOptions) {
  return useQuery({
    queryKey: ['admin', 'bulk-import', importId],
    queryFn: async () => {
      const response = await api.get(`/api/admin/products/import/${importId}`);
      return response.data;
    },
    enabled: !!importId,
    refetchInterval: (data) => {
      // Auto-refetch every 3 seconds if processing or pending
      const status = (data as any)?.data?.status;
      return status === 'processing' || status === 'pending' ? 3000 : false;
    },
    ...options,
  });
}

// Upload CSV file
export function useUploadImport(options?: UseMutationOptions<any, any, FormData>) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await api.post('/api/admin/products/import/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'bulk-imports'] });
    },
    ...options,
  });
}

// Download CSV template
export function useDownloadTemplate(options?: UseMutationOptions) {
  return useMutation({
    mutationFn: async () => {
      const response = await api.get('/api/admin/products/import/template', {
        responseType: 'blob',
      });
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'product_import_template.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      return response.data;
    },
    ...options,
  });
}

// Download error report
export function useDownloadErrors(options?: UseMutationOptions<any, any, number>) {
  return useMutation({
    mutationFn: async (importId: number) => {
      const response = await api.get(`/api/admin/products/import/${importId}/export-errors`, {
        responseType: 'blob',
      });
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `import_${importId}_errors.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      return response.data;
    },
    ...options,
  });
}

// Cancel import
export function useCancelImport(options?: UseMutationOptions<any, any, number>) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (importId: number) => {
      const response = await api.post(`/api/admin/products/import/${importId}/cancel`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'bulk-imports'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'bulk-import'] });
    },
    ...options,
  });
}

// Delete import
export function useDeleteImport(options?: UseMutationOptions<any, any, number>) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (importId: number) => {
      const response = await api.delete(`/api/admin/products/import/${importId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'bulk-imports'] });
    },
    ...options,
  });
}

// Get import errors
export function useImportErrors(importId: number, options?: UseQueryOptions) {
  return useQuery({
    queryKey: ['admin', 'bulk-import-errors', importId],
    queryFn: async () => {
      const response = await api.get(`/api/admin/products/import/${importId}/errors`);
      return response.data;
    },
    enabled: !!importId,
    ...options,
  });
}
