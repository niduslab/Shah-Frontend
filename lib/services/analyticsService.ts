/**
 * Analytics Service
 * 
 * Tracks user behavior and interactions across the e-commerce platform.
 * All tracking is done asynchronously and failures are logged without disrupting user experience.
 */

import api from '@/lib/api/axios';

// Type definitions for analytics events
export interface PageViewData {
  page_type: 'home' | 'product' | 'category' | 'cart' | 'checkout' | 'other';
  page_title?: string;
  product_id?: number;
  category_id?: number;
}

export interface ProductViewData {
  product_id: number;
}

export interface CartEventData {
  event_type: 'added' | 'updated' | 'removed';
  product_id: number;
  quantity: number;
  price: number;
  variation_id?: number;
}

export interface CheckoutData {
  status: 'cart_viewed' | 'checkout_initiated' | 'shipping_info_entered' | 'payment_info_entered' | 'order_completed' | 'abandoned';
  cart_items?: Array<{
    product_id: number;
    name: string;
    quantity: number;
    price: number;
  }>;
  cart_total?: number;
  items_count?: number;
  order_id?: number;
  product_ids?: number[];
  reason?: string;
}

export interface SearchData {
  query: string;
  results_count: number;
  clicked_product_id?: number;
}

class AnalyticsService {
  private isEnabled: boolean = true;
  private debugMode: boolean = false;

  constructor() {
    // Enable debug mode in development
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      this.debugMode = true;
    }
  }

  /**
   * Internal method to send tracking data to the backend
   */
  private async track(endpoint: string, data: any): Promise<void> {
    if (!this.isEnabled) {
      return;
    }

    try {
      const response = await api.post(`/api/analytics/track/${endpoint}`, data);
      
      if (this.debugMode) {
        console.log(`[Analytics] ${endpoint}:`, data, response.data);
      }
    } catch (error) {
      // Silently fail - analytics should never disrupt user experience
      if (this.debugMode) {
        console.error(`[Analytics] Error tracking ${endpoint}:`, error);
      }
    }
  }

  /**
   * Track page views
   * Call this on every page load
   */
  async trackPageView(data: PageViewData): Promise<void> {
    await this.track('page-view', data);
  }

  /**
   * Track product views
   * Call this when a product page is viewed
   */
  async trackProductView(data: ProductViewData): Promise<void> {
    await this.track('product-view', data);
  }

  /**
   * Track cart events (add, update, remove)
   * Call this when cart is modified
   */
  async trackCartEvent(data: CartEventData): Promise<void> {
    await this.track('cart-event', data);
  }

  /**
   * Track checkout funnel stages
   * Call this at each step of the checkout process
   */
  async trackCheckout(data: CheckoutData): Promise<void> {
    await this.track('checkout', data);
  }

  /**
   * Track search queries
   * Call this when users search for products
   */
  async trackSearch(data: SearchData): Promise<void> {
    await this.track('search', data);
  }

  /**
   * Convenience method: Track add to cart
   */
  async trackAddToCart(productId: number, quantity: number, price: number, variationId?: number): Promise<void> {
    await this.trackCartEvent({
      event_type: 'added',
      product_id: productId,
      quantity,
      price,
      variation_id: variationId,
    });
  }

  /**
   * Convenience method: Track remove from cart
   */
  async trackRemoveFromCart(productId: number, quantity: number, price: number): Promise<void> {
    await this.trackCartEvent({
      event_type: 'removed',
      product_id: productId,
      quantity,
      price,
    });
  }

  /**
   * Convenience method: Track cart quantity update
   */
  async trackUpdateCartQuantity(productId: number, quantity: number, price: number, variationId?: number): Promise<void> {
    await this.trackCartEvent({
      event_type: 'updated',
      product_id: productId,
      quantity,
      price,
      variation_id: variationId,
    });
  }

  /**
   * Enable or disable analytics tracking
   */
  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
  }

  /**
   * Check if analytics is enabled
   */
  isAnalyticsEnabled(): boolean {
    return this.isEnabled;
  }
}

// Export singleton instance
const analyticsService = new AnalyticsService();
export default analyticsService;
