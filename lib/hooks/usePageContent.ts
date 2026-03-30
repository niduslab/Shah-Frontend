import { useQuery, UseQueryOptions } from '@tanstack/react-query';
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
  created_at: string;
  updated_at: string;
  brand?: any;
}

interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
}

// Get page content by page key (public)
export const usePublicPageContent = (
  pageKey: string,
  options?: Omit<UseQueryOptions<ApiResponse<PageContent[]>>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<ApiResponse<PageContent[]>>({
    queryKey: ['page-content', pageKey],
    queryFn: async () => {
      const response = await api.get(`/api/page-content/${pageKey}`);
      return response.data;
    },
    enabled: !!pageKey,
    ...options,
  });
};

// Get brand page content by brand slug (public)
export const useBrandPageContent = (
  brandSlug: string,
  options?: Omit<UseQueryOptions<ApiResponse<PageContent[]>>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<ApiResponse<PageContent[]>>({
    queryKey: ['page-content', 'brand', brandSlug],
    queryFn: async () => {
      const response = await api.get(`/api/page-content/brand/${brandSlug}`);
      return response.data;
    },
    enabled: !!brandSlug,
    ...options,
  });
};
