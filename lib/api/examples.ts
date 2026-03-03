import api from './axios';

/**
 * Example API calls using the configured axios instance
 * All requests automatically include HTTP-only cookies for authentication
 */

// ============================================
// PRODUCTS
// ============================================

export const getProducts = async (params?: {
  category?: string;
  brand?: string;
  min_price?: number;
  max_price?: number;
  search?: string;
  sort?: string;
  per_page?: number;
  page?: number;
}) => {
  const response = await api.get('/api/products', { params });
  return response.data;
};

export const getProduct = async (slug: string) => {
  const response = await api.get(`/api/products/${slug}`);
  return response.data;
};

// ============================================
// CART
// ============================================

export const getCart = async () => {
  const response = await api.get('/api/cart');
  return response.data;
};

export const addToCart = async (productId: number, quantity: number = 1) => {
  const response = await api.post('/api/cart', {
    product_id: productId,
    quantity: quantity,
  });
  return response.data;
};

export const updateCartItem = async (itemId: number, quantity: number) => {
  const response = await api.put(`/api/cart/${itemId}`, { quantity });
  return response.data;
};

export const removeFromCart = async (itemId: number) => {
  const response = await api.delete(`/api/cart/${itemId}`);
  return response.data;
};

export const clearCart = async () => {
  const response = await api.delete('/api/cart');
  return response.data;
};

// ============================================
// ORDERS
// ============================================

export const getOrders = async () => {
  const response = await api.get('/api/orders');
  return response.data;
};

export const getOrder = async (orderId: number) => {
  const response = await api.get(`/api/orders/${orderId}`);
  return response.data;
};

export const createOrder = async (orderData: {
  shipping_address: string;
  billing_address?: string;
  payment_method: string;
  notes?: string;
}) => {
  const response = await api.post('/api/orders', orderData);
  return response.data;
};

// ============================================
// CATEGORIES
// ============================================

export const getCategories = async () => {
  const response = await api.get('/api/categories');
  return response.data;
};

export const getCategory = async (slug: string) => {
  const response = await api.get(`/api/categories/${slug}`);
  return response.data;
};

// ============================================
// BRANDS
// ============================================

export const getBrands = async () => {
  const response = await api.get('/api/brands');
  return response.data;
};

export const getBrand = async (slug: string) => {
  const response = await api.get(`/api/brands/${slug}`);
  return response.data;
};

// ============================================
// WISHLIST
// ============================================

export const getWishlist = async () => {
  const response = await api.get('/api/wishlist');
  return response.data;
};

export const addToWishlist = async (productId: number) => {
  const response = await api.post('/api/wishlist', { product_id: productId });
  return response.data;
};

export const removeFromWishlist = async (productId: number) => {
  const response = await api.delete(`/api/wishlist/${productId}`);
  return response.data;
};

// ============================================
// REVIEWS
// ============================================

export const getProductReviews = async (productId: number) => {
  const response = await api.get(`/api/products/${productId}/reviews`);
  return response.data;
};

export const createReview = async (productId: number, reviewData: {
  rating: number;
  comment: string;
}) => {
  const response = await api.post(`/api/products/${productId}/reviews`, reviewData);
  return response.data;
};

// ============================================
// ERROR HANDLING EXAMPLE
// ============================================

export const exampleWithErrorHandling = async () => {
  try {
    const response = await api.get('/api/products');
    return response.data;
  } catch (error: any) {
    if (error.response) {
      // Server responded with error status
      console.error('Error status:', error.response.status);
      console.error('Error data:', error.response.data);
      
      if (error.response.status === 401) {
        // Unauthorized - redirect to login
        window.location.href = '/login';
      }
    } else if (error.request) {
      // Request made but no response
      console.error('No response received:', error.request);
    } else {
      // Error setting up request
      console.error('Error:', error.message);
    }
    throw error;
  }
};
