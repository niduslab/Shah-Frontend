/**
 * useAnalytics Hook
 * 
 * React hook for easy analytics integration in components
 */

import { useEffect, useCallback } from 'react';
import analyticsService, {
  PageViewData,
  ProductViewData,
  CartEventData,
  CheckoutData,
  SearchData,
} from '@/lib/services/analyticsService';

export function useAnalytics() {
  return {
    trackPageView: useCallback((data: PageViewData) => {
      analyticsService.trackPageView(data);
    }, []),

    trackProductView: useCallback((data: ProductViewData) => {
      analyticsService.trackProductView(data);
    }, []),

    trackCartEvent: useCallback((data: CartEventData) => {
      analyticsService.trackCartEvent(data);
    }, []),

    trackCheckout: useCallback((data: CheckoutData) => {
      analyticsService.trackCheckout(data);
    }, []),

    trackSearch: useCallback((data: SearchData) => {
      analyticsService.trackSearch(data);
    }, []),

    // Convenience methods
    trackAddToCart: useCallback((productId: number, quantity: number, price: number, variationId?: number) => {
      analyticsService.trackAddToCart(productId, quantity, price, variationId);
    }, []),

    trackRemoveFromCart: useCallback((productId: number, quantity: number, price: number) => {
      analyticsService.trackRemoveFromCart(productId, quantity, price);
    }, []),

    trackUpdateCartQuantity: useCallback((productId: number, quantity: number, price: number, variationId?: number) => {
      analyticsService.trackUpdateCartQuantity(productId, quantity, price, variationId);
    }, []),
  };
}

/**
 * Hook to automatically track page views on component mount
 */
export function usePageViewTracking(data: PageViewData) {
  useEffect(() => {
    analyticsService.trackPageView(data);
  }, [data.page_type, data.page_title, data.product_id, data.category_id]);
}

/**
 * Hook to automatically track product views on component mount
 */
export function useProductViewTracking(productId: number) {
  useEffect(() => {
    if (productId) {
      analyticsService.trackProductView({ product_id: productId });
    }
  }, [productId]);
}
