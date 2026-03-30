import { useQuery, useMutation, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import api from '@/lib/api/axios';

interface PageContent {
  id: number;
  page_key: string;
  page_type: 'landing' | 'brand';
  section_name: string;
  title: string;
  sort_order: number;
  brand_id?: number | null;
  content: Record<string, any>;
  meta_title?: string;
  meta_description?: string;
  is_active: boolean;
  created_by?: number;
  updated_by?: number;
  created_at: string;
  updated_at: string;
  brand?: any;
}

interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
}

interface CreatePageContentData {
  page_key: string;
  page_type: 'landing' | 'brand';
  section_name: string;
  title: string;
  sort_order: number;
  brand_id?: number | null;
  content: Record<string, any>;
  meta_title?: string;
  meta_description?: string;
  is_active?: boolean;
}

interface UpdatePageContentData extends Partial<CreatePageContentData> {
  id: number;
}

// Get all page contents (with filters)
export const usePageContents = (
  filters?: { page_key?: string; page_type?: string; is_active?: boolean },
  options?: Omit<UseQueryOptions<ApiResponse<PageContent[]>>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<ApiResponse<PageContent[]>>({
    queryKey: ['admin', 'page-contents', filters],
    queryFn: async () => {
      const response = await api.get('/api/admin/page-contents', { params: filters });
      return response.data;
    },
    ...options,
  });
};

// Get page content by page key
export const usePageContentByKey = (
  pageKey: string,
  options?: Omit<UseQueryOptions<ApiResponse<PageContent[]>>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<ApiResponse<PageContent[]>>({
    queryKey: ['admin', 'page-contents', 'page', pageKey],
    queryFn: async () => {
      const response = await api.get(`/api/admin/page-contents/page/${pageKey}`);
      return response.data;
    },
    enabled: !!pageKey,
    ...options,
  });
};

// Get single page content by ID
export const usePageContent = (
  id: number,
  options?: Omit<UseQueryOptions<ApiResponse<PageContent>>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<ApiResponse<PageContent>>({
    queryKey: ['admin', 'page-contents', id],
    queryFn: async () => {
      const response = await api.get(`/api/admin/page-contents/${id}`);
      return response.data;
    },
    enabled: !!id,
    ...options,
  });
};

// Create page content
export const useCreatePageContent = (
  options?: Omit<UseMutationOptions<ApiResponse<PageContent>, any, CreatePageContentData>, 'mutationFn'>
) => {
  return useMutation<ApiResponse<PageContent>, any, CreatePageContentData>({
    mutationFn: async (data) => {
      const response = await api.post('/api/admin/page-contents', data);
      return response.data;
    },
    ...options,
  });
};

// Update page content
export const useUpdatePageContent = (
  options?: Omit<UseMutationOptions<ApiResponse<PageContent>, any, UpdatePageContentData>, 'mutationFn'>
) => {
  return useMutation<ApiResponse<PageContent>, any, UpdatePageContentData>({
    mutationFn: async ({ id, ...data }) => {
      const response = await api.put(`/api/admin/page-contents/${id}`, data);
      return response.data;
    },
    ...options,
  });
};

// Delete page content
export const useDeletePageContent = (
  options?: Omit<UseMutationOptions<ApiResponse, any, number>, 'mutationFn'>
) => {
  return useMutation<ApiResponse, any, number>({
    mutationFn: async (id) => {
      const response = await api.delete(`/api/admin/page-contents/${id}`);
      return response.data;
    },
    ...options,
  });
};

// Update sort order
export const useUpdateSortOrder = (
  options?: Omit<UseMutationOptions<ApiResponse, any, { items: { id: number; sort_order: number }[] }>, 'mutationFn'>
) => {
  return useMutation<ApiResponse, any, { items: { id: number; sort_order: number }[] }>({
    mutationFn: async (data) => {
      const response = await api.post('/api/admin/page-contents/sort-order', data);
      return response.data;
    },
    ...options,
  });
};
