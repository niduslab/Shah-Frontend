import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import api from '@/lib/api/axios';

export const useWishlist = (options?: Partial<UseQueryOptions<any>>) => {
  return useQuery({
    queryKey: ['wishlist'],
    queryFn: async () => {
      const response = await api.get('/api/wishlist');
      return response.data;
    },
    ...options,
  });
};

export const useAddToWishlist = (options?: UseMutationOptions<any, any, { product_id: number }>) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: { product_id: number }) => {
      const response = await api.post('/api/wishlist', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    },
    ...options,
  });
};

export const useRemoveFromWishlist = (options?: UseMutationOptions<any, any, number>) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete(`/api/wishlist/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    },
    ...options,
  });
};

export const useRemoveFromWishlistByProduct = (options?: UseMutationOptions<any, any, number>) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (productId: number) => {
      const response = await api.delete(`/api/wishlist/product/${productId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    },
    ...options,
  });
};

export const useCheckWishlist = (productId: number, options?: Partial<UseQueryOptions<any>>) => {
  return useQuery({
    queryKey: ['wishlist', 'check', productId],
    queryFn: async () => {
      const response = await api.get(`/api/wishlist/check/${productId}`);
      return response.data;
    },
    enabled: !!productId,
    ...options,
  });
};

export const useClearWishlist = (options?: UseMutationOptions<any, any, void, any>) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      const response = await api.post('/api/wishlist/clear');
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    },
    ...options,
  });
};
