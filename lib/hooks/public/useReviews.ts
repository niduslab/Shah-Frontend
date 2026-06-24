import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import api from '@/lib/api/axios';

export const useProductReviews = (
  productId: number,
  params?: { page?: number; per_page?: number },
  options?: Partial<UseQueryOptions<any>>
) => {
  return useQuery({
    queryKey: ['product-reviews', productId, params],
    queryFn: async () => {
      const response = await api.get(`/api/products/${productId}/reviews`, { params });
      return response.data;
    },
    enabled: !!productId,
    ...options,
  });
};
