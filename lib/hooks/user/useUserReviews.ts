import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import api from '@/lib/api/axios';

interface ReviewData {
  product_id: number;
  order_item_id: number;
  rating: number;
  title: string;
  comment: string;
  images?: string[];
}

export const useMyReviews = (options?: UseQueryOptions) => {
  return useQuery({
    queryKey: ['my-reviews'],
    queryFn: async () => {
      const response = await api.get('/api/reviews/my-reviews');
      return response.data;
    },
    ...options,
  });
};

export const useReviewableItems = (options?: UseQueryOptions) => {
  return useQuery({
    queryKey: ['reviewable-items'],
    queryFn: async () => {
      const response = await api.get('/api/reviews/reviewable-items');
      return response.data;
    },
    ...options,
  });
};

export const useOrderItemReviews = (orderNumber: string, options?: UseQueryOptions) => {
  return useQuery({
    queryKey: ['order-reviews', orderNumber],
    queryFn: async () => {
      const response = await api.get(`/api/reviews/order/${orderNumber}`);
      return response.data;
    },
    enabled: !!orderNumber,
    ...options,
  });
};

export const useSubmitReview = (options?: UseMutationOptions<any, any, ReviewData>) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: ReviewData) => {
      const response = await api.post('/api/reviews', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-reviews'] });
      queryClient.invalidateQueries({ queryKey: ['reviewable-items'] });
      queryClient.invalidateQueries({ queryKey: ['order-reviews'] });
      queryClient.invalidateQueries({ queryKey: ['product-reviews'] });
    },
    ...options,
  });
};

export const useMarkReviewHelpful = (options?: UseMutationOptions<any, any, number>) => {
  return useMutation({
    mutationFn: async (reviewId: number) => {
      const response = await api.post(`/api/reviews/${reviewId}/helpful`);
      return response.data;
    },
    ...options,
  });
};

