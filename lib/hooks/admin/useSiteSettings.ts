import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import api from '@/lib/api/axios';

export interface SiteSettings {
  id: number;
  contact_email: string | null;
  contact_phone: string | null;
  contact_address: string | null;
  facebook_url: string | null;
  twitter_url: string | null;
  instagram_url: string | null;
  youtube_url: string | null;
  linkedin_url: string | null;
  payment_banner_path?: string | null;
  payment_banner_url: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface SiteSettingsPayload {
  contact_email?: string | null;
  contact_phone?: string | null;
  contact_address?: string | null;
  facebook_url?: string | null;
  twitter_url?: string | null;
  instagram_url?: string | null;
  youtube_url?: string | null;
  linkedin_url?: string | null;
  payment_banner?: File | null;
  remove_payment_banner?: boolean;
}

const KEY = ['admin', 'site-settings'];

export const useSiteSettings = (options?: Partial<UseQueryOptions<any>>) => {
  return useQuery({
    queryKey: KEY,
    queryFn: async () => {
      const response = await api.get('/api/admin/site-settings');
      return response.data;
    },
    ...options,
  });
};

export const useUpdateSiteSettings = (
  options?: UseMutationOptions<any, any, SiteSettingsPayload>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: SiteSettingsPayload) => {
      const formData = new FormData();

      const stringFields: (keyof SiteSettingsPayload)[] = [
        'contact_email',
        'contact_phone',
        'contact_address',
        'facebook_url',
        'twitter_url',
        'instagram_url',
        'youtube_url',
        'linkedin_url',
      ];

      stringFields.forEach((field) => {
        const value = payload[field];
        if (value !== undefined) {
          formData.append(field, (value ?? '') as string);
        }
      });

      if (payload.payment_banner) {
        formData.append('payment_banner', payload.payment_banner);
      } else if (payload.remove_payment_banner) {
        formData.append('remove_payment_banner', '1');
      }

      const response = await api.post('/api/admin/site-settings', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KEY });
    },
    ...options,
  });
};
