import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import api from '@/lib/api/axios';

export type TrackingPixelProvider =
  | 'facebook_pixel'
  | 'google_ads'
  | 'google_analytics'
  | 'gtm'
  | 'custom';

export type TrackingPixelPlacement = 'head' | 'body_top' | 'body_bottom';

export interface TrackingPixel {
  id: number;
  provider: TrackingPixelProvider;
  name: string;
  pixel_id: string | null;
  custom_head_script: string | null;
  custom_body_script: string | null;
  placement: TrackingPixelPlacement;
  is_active: boolean;
  gtm_dashboard_url: string | null;
  notes: string | null;
  id_valid?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface TrackingPixelPayload {
  provider: TrackingPixelProvider;
  name: string;
  pixel_id?: string | null;
  custom_head_script?: string | null;
  custom_body_script?: string | null;
  placement?: TrackingPixelPlacement;
  is_active?: boolean;
  gtm_dashboard_url?: string | null;
  notes?: string | null;
}

interface TrackingPixelFilters {
  provider?: TrackingPixelProvider;
  is_active?: boolean;
}

const KEY = ['admin', 'tracking-pixels'];

export const useTrackingPixels = (
  filters?: TrackingPixelFilters,
  options?: Partial<UseQueryOptions<any>>
) => {
  return useQuery({
    queryKey: [...KEY, filters],
    queryFn: async () => {
      const response = await api.get('/api/admin/tracking-pixels', { params: filters });
      return response.data;
    },
    ...options,
  });
};

export const useTrackingPixel = (id: number, options?: Partial<UseQueryOptions<any>>) => {
  return useQuery({
    queryKey: [...KEY, id],
    queryFn: async () => {
      const response = await api.get(`/api/admin/tracking-pixels/${id}`);
      return response.data;
    },
    enabled: !!id,
    ...options,
  });
};

export const useCreateTrackingPixel = (
  options?: UseMutationOptions<any, any, TrackingPixelPayload>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: TrackingPixelPayload) => {
      const response = await api.post('/api/admin/tracking-pixels', payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KEY });
    },
    ...options,
  });
};

export const useUpdateTrackingPixel = (
  options?: UseMutationOptions<any, any, { id: number; payload: TrackingPixelPayload }>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: TrackingPixelPayload }) => {
      const response = await api.put(`/api/admin/tracking-pixels/${id}`, payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KEY });
    },
    ...options,
  });
};

export const useDeleteTrackingPixel = (options?: UseMutationOptions<any, any, number>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete(`/api/admin/tracking-pixels/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KEY });
    },
    ...options,
  });
};

export const useToggleTrackingPixel = (options?: UseMutationOptions<any, any, number>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.post(`/api/admin/tracking-pixels/${id}/toggle`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KEY });
    },
    ...options,
  });
};

export const useVerifyTrackingPixel = (options?: UseMutationOptions<any, any, number>) => {
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.post(`/api/admin/tracking-pixels/${id}/verify`);
      return response.data;
    },
    ...options,
  });
};
