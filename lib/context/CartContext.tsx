'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

export interface CartItem {
  product_id: number;
  variation_id?: number | null;
  quantity: number;
  product?: any; // Product details
  variation?: any; // Variation details
}

export interface AppliedCoupon {
  code: string;
  discount_amount: number;
  coupon: any; // Full coupon details from API
}

interface CartContextType {
  items: CartItem[];
  appliedCoupon: AppliedCoupon | null;
  addToCart: (item: CartItem, redirectUrl?: string) => void;
  removeFromCart: (productId: number, variationId?: number | null) => void;
  updateQuantity: (productId: number, quantity: number, variationId?: number | null) => void;
  clearCart: () => void;
  getCartCount: () => number;
  isInCart: (productId: number, variationId?: number | null) => boolean;
  setAppliedCoupon: (coupon: AppliedCoupon | null) => void;
}

const CartContext = createContext<CartContextType | null>(null);

const CART_STORAGE_KEY = 'shopping_cart';
const COUPON_STORAGE_KEY = 'applied_coupon';

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [appliedCoupon, setAppliedCouponState] = useState<AppliedCoupon | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Load cart and coupon from localStorage on mount (client-side only)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        try {
          setItems(JSON.parse(savedCart));
        } catch (error) {
          console.error('Failed to parse cart from localStorage:', error);
        }
      }
      
      const savedCoupon = localStorage.getItem(COUPON_STORAGE_KEY);
      if (savedCoupon) {
        try {
          setAppliedCouponState(JSON.parse(savedCoupon));
        } catch (error) {
          console.error('Failed to parse coupon from localStorage:', error);
        }
      }
      
      setIsInitialized(true);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isInitialized && typeof window !== 'undefined') {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, isInitialized]);

  // Save coupon to localStorage whenever it changes
  useEffect(() => {
    if (isInitialized && typeof window !== 'undefined') {
      if (appliedCoupon) {
        localStorage.setItem(COUPON_STORAGE_KEY, JSON.stringify(appliedCoupon));
      } else {
        localStorage.removeItem(COUPON_STORAGE_KEY);
      }
    }
  }, [appliedCoupon, isInitialized]);

  const addToCart = useCallback((item: CartItem, redirectUrl?: string) => {
    // Prevent double-clicking
    if (isProcessing) {
      return;
    }
    
    setIsProcessing(true);
    
    // Allow guest users to add to cart
    setItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(
        (i) => i.product_id === item.product_id && i.variation_id === item.variation_id
      );

      let result;
      if (existingItemIndex > -1) {
        // Update quantity if item exists
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += item.quantity;
        result = updatedItems;
        // Use setTimeout to avoid multiple toasts in strict mode
        setTimeout(() => toast.success('Cart updated successfully'), 0);
      } else {
        // Add new item
        result = [...prevItems, item];
        setTimeout(() => toast.success('Product added to cart'), 0);
      }
      return result;
    });
    
    // Reset processing flag after a short delay
    setTimeout(() => setIsProcessing(false), 300);
  }, [isProcessing]);

  const removeFromCart = useCallback((productId: number, variationId?: number | null) => {
    setItems((prevItems) =>
      prevItems.filter(
        (item) => !(item.product_id === productId && item.variation_id === variationId)
      )
    );
    toast.success('Product removed from cart');
  }, []);

  const updateQuantity = useCallback((productId: number, quantity: number, variationId?: number | null) => {
    if (quantity < 1) {
      removeFromCart(productId, variationId);
      return;
    }

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.product_id === productId && item.variation_id === variationId
          ? { ...item, quantity }
          : item
      )
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setItems([]);
    setAppliedCouponState(null);
    toast.success('Cart cleared');
  }, []);

  const setAppliedCoupon = useCallback((coupon: AppliedCoupon | null) => {
    setAppliedCouponState(coupon);
  }, []);

  const getCartCount = useCallback(() => {
    return items.reduce((total, item) => total + item.quantity, 0);
  }, [items]);

  const isInCart = useCallback((productId: number, variationId?: number | null) => {
    return items.some(
      (item) => item.product_id === productId && item.variation_id === variationId
    );
  }, [items]);

  return (
    <CartContext.Provider
      value={{
        items,
        appliedCoupon,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartCount,
        isInCart,
        setAppliedCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};
