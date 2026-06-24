import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import api from '@/lib/api/axios';

// Types
interface PageData {
  title: string;
  slug: string;
  type: 'landing' | 'brand' | 'flash_deal' | 'gallery' | 'custom';
  meta_title?: string;
  meta_description?: string;
  is_active?: boolean;
  sort_order?: number;
}

interface SectionData {
  section_type: string;
  title?: string;
  content: any;
  settings?: any;
  sort_order?: number;
  is_active?: boolean;
}

interface SectionContentData {
  content: any;
}

// Pages Hooks
export const useAdminPages = (params?: { page?: number; per_page?: number; type?: string }, options?: Partial<UseQueryOptions<any>>) => {
  return useQuery({
    queryKey: ['admin', 'pages', params],
    queryFn: async () => {
      const response = await api.get('/api/admin/pages', { params });
      return response.data;
    },
    ...options,
  });
};

export const useAdminPage = (id: number, options?: Partial<UseQueryOptions<any>>) => {
  return useQuery({
    queryKey: ['admin', 'page', id],
    queryFn: async () => {
      const response = await api.get(`/api/admin/pages/${id}`);
      return response.data;
    },
    enabled: !!id,
    ...options,
  });
};

export const useCreatePage = (options?: UseMutationOptions<any, any, PageData>) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: PageData) => {
      const response = await api.post('/api/admin/pages', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'pages'] });
    },
    ...options,
  });
};

export const useUpdatePage = (options?: UseMutationOptions<any, any, { id: number; data: Partial<PageData> }>) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await api.put(`/api/admin/pages/${id}`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'pages'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'page', variables.id] });
    },
    ...options,
  });
};

export const useDeletePage = (options?: UseMutationOptions<any, any, number>) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete(`/api/admin/pages/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'pages'] });
    },
    ...options,
  });
};

// Sections Hooks
export const usePageSections = (pageId: number, options?: Partial<UseQueryOptions<any>>) => {
  return useQuery({
    queryKey: ['admin', 'page', pageId, 'sections'],
    queryFn: async () => {
      const response = await api.get(`/api/admin/pages/${pageId}/sections`);
      return response.data;
    },
    enabled: !!pageId,
    ...options,
  });
};

export const useSection = (pageId: number, sectionId: number, options?: Partial<UseQueryOptions<any>>) => {
  return useQuery({
    queryKey: ['admin', 'page', pageId, 'section', sectionId],
    queryFn: async () => {
      const response = await api.get(`/api/admin/pages/${pageId}/sections/${sectionId}`);
      return response.data;
    },
    enabled: !!pageId && !!sectionId,
    ...options,
  });
};

export const useCreateSection = (options?: UseMutationOptions<any, any, { pageId: number; data: SectionData }>) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ pageId, data }) => {
      const response = await api.post(`/api/admin/pages/${pageId}/sections`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'page', variables.pageId, 'sections'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'page', variables.pageId] });
    },
    ...options,
  });
};

export const useUpdateSection = (options?: UseMutationOptions<any, any, { pageId: number; sectionId: number; data: Partial<SectionData> }>) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ pageId, sectionId, data }) => {
      const response = await api.put(`/api/admin/pages/${pageId}/sections/${sectionId}`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'page', variables.pageId, 'sections'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'page', variables.pageId, 'section', variables.sectionId] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'page', variables.pageId] });
    },
    ...options,
  });
};

export const useDeleteSection = (options?: UseMutationOptions<any, any, { pageId: number; sectionId: number }>) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ pageId, sectionId }) => {
      const response = await api.delete(`/api/admin/pages/${pageId}/sections/${sectionId}`);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'page', variables.pageId, 'sections'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'page', variables.pageId] });
    },
    ...options,
  });
};

export const useReorderSections = (options?: UseMutationOptions<any, any, { pageId: number; sections: { id: number; sort_order: number }[] }>) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ pageId, sections }) => {
      const response = await api.post(`/api/admin/pages/${pageId}/sections/reorder`, { sections });
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'page', variables.pageId, 'sections'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'page', variables.pageId] });
    },
    ...options,
  });
};

// Section Content Hooks
export const useSectionContent = (pageId: number, sectionId: number, options?: Partial<UseQueryOptions<any>>) => {
  return useQuery({
    queryKey: ['admin', 'page', pageId, 'section', sectionId, 'content'],
    queryFn: async () => {
      const response = await api.get(`/api/admin/pages/${pageId}/sections/${sectionId}/content`);
      return response.data;
    },
    enabled: !!pageId && !!sectionId,
    ...options,
  });
};

export const useUpdateSectionContent = (options?: UseMutationOptions<any, any, { pageId: number; sectionId: number; data: SectionContentData }>) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ pageId, sectionId, data }) => {
      const response = await api.put(`/api/admin/pages/${pageId}/sections/${sectionId}/content`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'page', variables.pageId, 'section', variables.sectionId, 'content'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'page', variables.pageId, 'section', variables.sectionId] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'page', variables.pageId] });
    },
    ...options,
  });
};

// Template Hooks
export const usePageTemplates = (params?: { page_type?: string; category?: string }, options?: Partial<UseQueryOptions<any>>) => {
  return useQuery({
    queryKey: ['admin', 'page-templates', params],
    queryFn: async () => {
      const response = await api.get('/api/admin/page-templates', { params });
      return response.data;
    },
    ...options,
  });
};

export const useTemplatesByPageType = (pageType: string, options?: Partial<UseQueryOptions<any>>) => {
  return useQuery({
    queryKey: ['admin', 'page-templates', 'page-type', pageType],
    queryFn: async () => {
      const response = await api.get(`/api/admin/page-templates/page-type/${pageType}`);
      return response.data;
    },
    enabled: !!pageType,
    ...options,
  });
};

export const useTemplatesByCategory = (category: string, options?: Partial<UseQueryOptions<any>>) => {
  return useQuery({
    queryKey: ['admin', 'page-templates', 'category', category],
    queryFn: async () => {
      const response = await api.get(`/api/admin/page-templates/category/${category}`);
      return response.data;
    },
    enabled: !!category,
    ...options,
  });
};

export const useTemplateSchema = (templateType: string, options?: Partial<UseQueryOptions<any>>) => {
  return useQuery({
    queryKey: ['admin', 'page-templates', 'schema', templateType],
    queryFn: async () => {
      const response = await api.get(`/api/admin/page-templates/${templateType}/schema`);
      return response.data;
    },
    enabled: !!templateType,
    ...options,
  });
};
