import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import api from '@/lib/api/axios';

export interface ShopFilters {
  search?: string;
  category_slug?: string;
  category_id?: number;
  brand_slug?: string;
  min_price?: number;
  max_price?: number;
  in_stock?: boolean;
  is_featured?: boolean;
  is_trending?: boolean;
  is_preorder?: boolean;
  flash_deal_id?: number;
  has_flash_deal?: boolean;
  has_discount?: boolean;
  has_promotion?: boolean;
  promotion_id?: number;
  has_coupon?: boolean;
  sort_by?: 'price' | 'name' | 'created_at';
  sort_order?: 'asc' | 'desc';
  per_page?: number;
  page?: number;
}

export interface ShopProduct {
  id: number;
  name: string;
  slug: string;
  price: number;
  compare_price?: number;
  quantity: number;
  stock_status: 'in_stock' | 'out_of_stock' | 'low_stock';
  description?: string;
  short_description?: string;
  images: string[];
  category?: {
    id: number;
    name: string;
    slug: string;
  };
  brand?: {
    id: number;
    name: string;
    slug: string;
  };
  is_featured: boolean;
  is_trending: boolean;
  average_rating?: number;
  review_count?: number;
}

export interface ShopResponse {
  success: boolean;
  data: {
    current_page: number;
    data: ShopProduct[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: Array<{
      url: string | null;
      label: string;
      active: boolean;
    }>;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
  };
}

/**
 * Hook for fetching shop products with filters
 * API Endpoint: GET /api/catalog/products
 */
export const useShopProducts = (
  filters?: ShopFilters,
  options?: UseQueryOptions<ShopResponse>
) => {
  return useQuery<ShopResponse>({
    queryKey: ['shop', 'products', filters],
    queryFn: async () => {
      const response = await api.get('/api/catalog/products', { params: filters });
      return response.data;
    },
    ...options,
  });
};

/**
 * Hook for fetching a single product by slug
 * API Endpoint: GET /api/catalog/products/{slug}
 */
export const useShopProduct = (
  slug: string,
  options?: UseQueryOptions<any>
) => {
  return useQuery({
    queryKey: ['shop', 'product', slug],
    queryFn: async () => {
      const response = await api.get(`/api/catalog/products/${slug}`);
      return response.data;
    },
    enabled: !!slug,
    ...options,
  });
};

/**
 * Hook for fetching featured products for shop
 * API Endpoint: GET /api/catalog/products/featured
 */
export const useShopFeaturedProducts = (
  perPage: number = 12,
  options?: UseQueryOptions<any>
) => {
  return useQuery({
    queryKey: ['shop', 'featured', perPage],
    queryFn: async () => {
      const response = await api.get('/api/catalog/products/featured', {
        params: { per_page: perPage },
      });
      return response.data;
    },
    ...options,
  });
};

/**
 * Hook for fetching trending products for shop
 * API Endpoint: GET /api/catalog/products/trending
 */
export const useShopTrendingProducts = (
  perPage: number = 12,
  options?: UseQueryOptions<any>
) => {
  return useQuery({
    queryKey: ['shop', 'trending', perPage],
    queryFn: async () => {
      const response = await api.get('/api/catalog/products/trending', {
        params: { per_page: perPage },
      });
      return response.data;
    },
    ...options,
  });
};
