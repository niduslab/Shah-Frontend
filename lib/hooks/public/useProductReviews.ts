import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api/axios';

export function useProductReviews(productId: number, enabled: boolean = true) {
  return useQuery({
    queryKey: ['product-reviews', productId],
    queryFn: async () => {
      const response = await api.get(`/api/reviews/product/${productId}`);
      console.log('useProductReviews - Full API response:', response.data);
      
      // Extract reviews from nested structure: data.reviews.data
      if (response.data.success && response.data.data) {
        const reviewsData = response.data.data.reviews?.data || response.data.data.reviews || [];
        const statsData = response.data.data.stats || null;
        
        console.log('useProductReviews - Extracted reviews:', reviewsData);
        console.log('useProductReviews - Extracted stats:', statsData);
        
        return {
          success: true,
          data: reviewsData,
          stats: statsData,
        };
      }
      
      console.log('useProductReviews - Returning raw response:', response.data);
      return response.data;
    },
    enabled: enabled && !!productId,
    retry: false, // Don't retry if endpoint doesn't exist yet
  });
}
