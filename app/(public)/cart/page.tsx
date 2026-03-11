"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight, Minus, Plus, Trash2, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/context/AuthContext";
import { useCart } from "@/lib/context/CartContext";
import { useCalculateCartSummary, useValidateCoupon } from "@/lib/hooks/public/useCart";
import { ProductCard } from "../_components/shared/product-card";
import { toast } from "sonner";
import { getPlaceholderImage } from "@/lib/utils/image";

// Data for "You May Also Like"
const RELATED_PRODUCTS = [
  {
    id: 1,
    name: "XPD Woven J-20",
    image: "/images/landing/new-arrival/d28b697c5ffd69551d236e0311c369e1daa2111e.png",
    price: 29.99,
    originalPrice: 34.99,
    rating: 5,
    reviews: 12,
    badge: { text: "-15% off", className: "bg-red-500" },
  },
  {
    id: 2,
    name: "Wave Men's Sport Swimming Boxer",
    image: "/images/landing/new-arrival/3c81b2d5cfd837c1a87f80ecd4654d112931d943.png",
    price: 16.00,
    originalPrice: 19.00,
    rating: 5,
    reviews: 39,
    badge: { text: "-25% off", className: "bg-red-500" },
  },
  {
    id: 3,
    name: "IREST LEG MASSAGER C 30A",
    image: "/images/landing/new-arrival/48ea1efb27d9c62811e189727ecd54692bf0e529.png",
    price: 599.00,
    originalPrice: 799.00,
    rating: 5,
    reviews: 39,
    badge: { text: "-25% off", className: "bg-red-500" },
  },
  {
    id: 4,
    name: "Xterra Adjustable Dumbbell 50kg Set",
    image: "/images/landing/new-arrival/d6d857a1c8f1272b3e4a3e6e66b8975e36f83230.png",
    price: 438.00,
    originalPrice: 473.00,
    rating: 5,
    reviews: 39,
    badge: { text: "-25% off", className: "bg-red-500" },
  },
];

export default function CartPage() {
  const { loading: authLoading } = useAuth();
  const { items, updateQuantity, removeFromCart, getCartCount } = useCart();
  
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [cartSummary, setCartSummary] = useState<any>(null);
  const [isClient, setIsClient] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);

  const calculateSummary = useCalculateCartSummary();
  const validateCoupon = useValidateCoupon();

  // Client-side fallback calculation
  const calculateClientSideSummary = () => {
    let subtotal = 0;
    
    items.forEach(item => {
      const product = item.product;
      const variation = item.variation;
      const price = variation ? parseFloat(variation.price) : parseFloat(product?.price || 0);
      subtotal += price * item.quantity;
    });

    const discount = appliedCoupon?.discount_amount || 0;
    const tax = 0; // Can be calculated based on your tax rules
    const shipping = 0; // Can be calculated based on shipping rules
    const total = subtotal - discount + tax + shipping;

    return {
      subtotal,
      discount,
      tax,
      shipping,
      total,
    };
  };

  // No redirect - allow guest users to view cart

  // Set client-side flag after mount
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Calculate cart summary whenever items change
  useEffect(() => {
    if (items.length > 0 && isClient) {
      setIsCalculating(true);
      
      const cartItems = items.map(item => ({
        product_id: item.product_id,
        variation_id: item.variation_id || null,
        quantity: item.quantity,
      }));

      calculateSummary.mutate(
        { items: cartItems },
        {
          onSuccess: (response) => {
            setIsCalculating(false);
            if (response.success && response.data) {
              setCartSummary(response.data);
            } else {
              // Fallback to client-side calculation
              setCartSummary(calculateClientSideSummary());
            }
          },
          onError: (error: any) => {
            console.error('Failed to calculate cart summary:', error);
            setIsCalculating(false);
            // Fallback to client-side calculation
            setCartSummary(calculateClientSideSummary());
          },
        }
      );
    } else if (items.length === 0) {
      setCartSummary(null);
      setIsCalculating(false);
    }
  }, [items, isClient, appliedCoupon]);

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      toast.error('Please enter a coupon code');
      return;
    }

    if (!cartSummary) {
      toast.error('Cart summary not available');
      return;
    }

    validateCoupon.mutate(
      {
        code: couponCode,
        subtotal: cartSummary.subtotal,
      },
      {
        onSuccess: (response) => {
          if (response.success) {
            setAppliedCoupon(response.data);
            toast.success('Coupon applied successfully!');
            // Recalculate summary with coupon
          } else {
            toast.error(response.message || 'Invalid coupon code');
          }
        },
        onError: (error: any) => {
          const errorMessage = error.response?.data?.message || 'Failed to apply coupon';
          toast.error(errorMessage);
        },
      }
    );
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    toast.success('Coupon removed');
  };

  // Show loading state only during initial auth check or client hydration
  if (authLoading || !isClient) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const totalItems = getCartCount();
  
  // Use cart summary if available, otherwise calculate on client side
  const summary = cartSummary || (isClient && items.length > 0 ? calculateClientSideSummary() : null);
  
  const subTotal = summary?.subtotal || 0;
  const discount = appliedCoupon?.discount_amount || summary?.discount || 0;
  const tax = summary?.tax || 0;
  const shipping = summary?.shipping || 0;
  const totalPrice = summary?.total || 0;

  return (
    <div className="w-full bg-white pb-20 pt-8">
      <div className="mx-auto w-full max-w-[1400px] px-4 md:px-6">
        {/* Breadcrumb */}
        <div className="mb-8 text-sm text-gray-500">
          <Link href="/" className="hover:text-black">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/shop" className="hover:text-black">Shop</Link>
          <span className="mx-2">/</span>
          <span className="text-black font-medium">Shopping Cart</span>
        </div>

        <h1 className="mb-8 text-2xl font-bold text-black">
          My Shopping Cart ({totalItems} {totalItems === 1 ? 'item' : 'items'})
        </h1>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="mb-6 text-gray-300">
              <svg className="h-32 w-32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h2 className="mb-2 text-2xl font-bold text-black">Your cart is empty</h2>
            <p className="mb-8 text-gray-500">Add some products to get started</p>
            <Link href="/shop">
              <button className="rounded-xs bg-primary px-8 py-3 font-bold text-black transition-colors hover:bg-primary/90">
                Continue Shopping
              </button>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-8 lg:flex-row">
            {/* Cart Items List */}
            <div className="flex-1 rounded-sm border border-gray-100 bg-white">
              {items.map((item) => {
                const product = item.product;
                const variation = item.variation;
                const price = variation ? parseFloat(variation.price) : parseFloat(product?.price || 0);
                const comparePrice = product?.compare_price ? parseFloat(product.compare_price) : null;
                const discount = comparePrice && comparePrice > price 
                  ? Math.round(((comparePrice - price) / comparePrice) * 100) 
                  : 0;
                
                // Get image URL - handle both API format and direct URLs
                let imageUrl = getPlaceholderImage(product?.name || 'Product');
                if (product?.images && product.images.length > 0) {
                  const firstImage = product.images[0];
                  if (typeof firstImage === 'string') {
                    // Direct URL from product card
                    imageUrl = firstImage;
                  } else if (firstImage?.image_path) {
                    // API format with image_path
                    imageUrl = firstImage.image_path.startsWith('http') 
                      ? firstImage.image_path 
                      : `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/${firstImage.image_path}`;
                  }
                } else if (product?.image) {
                  // Fallback to product.image if available
                  imageUrl = product.image;
                }

                return (
                  <div 
                    key={`${item.product_id}-${item.variation_id || 'no-var'}`} 
                    className="flex flex-col gap-6 border-b border-gray-100 p-6 last:border-0 sm:flex-row sm:items-center"
                  >
                    {/* Image */}
                    <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md bg-gray-50 p-2">
                      <img
                        src={imageUrl}
                        alt={product?.name || 'Product'}
                        className="h-full w-full object-contain"
                        onError={(e) => {
                          e.currentTarget.src = getPlaceholderImage(product?.name || 'Product');
                        }}
                      />
                    </div>

                    {/* Details */}
                    <div className="flex flex-1 flex-col justify-between gap-4 sm:flex-row sm:items-center">
                      <div className="flex-1">
                        <h3 className="mb-2 font-medium text-black">{product?.name || 'Product'}</h3>
                        {variation && variation.attributes && (
                          <p className="mb-2 text-sm text-gray-500">
                            {Object.entries(variation.attributes).map(([key, value]) => (
                              <span key={key} className="mr-2">
                                {key}: {value as string}
                              </span>
                            ))}
                          </p>
                        )}
                        <div className="flex items-center gap-3">
                          <span className="text-lg font-bold text-black">${price.toFixed(2)}</span>
                          {comparePrice && comparePrice > price && (
                            <>
                              <span className="text-sm text-gray-400 line-through">
                                ${comparePrice.toFixed(2)}
                              </span>
                              <span className="bg-red-500 px-2 py-0.5 text-xs font-bold text-white rounded-sm">
                                -{discount}% off
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Quantity & Remove */}
                      <div className="flex items-center justify-between gap-6 sm:justify-end">
                        <div className="flex items-center rounded-sm border border-gray-200">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              updateQuantity(item.product_id, item.quantity - 1, item.variation_id);
                            }}
                            className="flex h-10 w-10 items-center justify-center text-gray-500 hover:bg-gray-50"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="flex h-10 w-10 items-center justify-center text-sm font-medium text-black">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              updateQuantity(item.product_id, item.quantity + 1, item.variation_id);
                            }}
                            className="flex h-10 w-10 items-center justify-center text-gray-500 hover:bg-gray-50"
                            aria-label="Increase quantity"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            removeFromCart(item.product_id, item.variation_id);
                          }}
                          className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="underline">Remove</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Order Summary */}
            <div className="h-fit w-full lg:w-[400px]">
              <div className="rounded-sm bg-[#FAFAFA] p-6">
                <h2 className="mb-6 text-xl font-bold text-black">Order Summary</h2>

                {/* Coupon */}
                <div className="mb-8">
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between rounded-sm border border-green-200 bg-green-50 p-3">
                      <div>
                        <p className="text-sm font-medium text-green-800">
                          Coupon Applied: {appliedCoupon.code}
                        </p>
                        <p className="text-xs text-green-600">
                          You saved ${discount.toFixed(2)}
                        </p>
                      </div>
                      <button
                        onClick={handleRemoveCoupon}
                        className="text-sm text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Enter coupon code"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        className="w-full rounded-sm border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-black"
                      />
                      <button
                        onClick={handleApplyCoupon}
                        disabled={validateCoupon.isPending}
                        className="rounded-sm bg-primary px-4 py-2.5 text-sm font-bold text-black hover:bg-primary/90 disabled:opacity-50"
                      >
                        {validateCoupon.isPending ? 'Applying...' : 'Apply'}
                      </button>
                    </div>
                  )}
                </div>

                {/* Summary Details */}
                {isCalculating && !cartSummary ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : (
                  <>
                    <div className="mb-6 space-y-4 border-b border-gray-200 pb-6 text-sm">
                      <div className="flex justify-between text-gray-600">
                        <span>Total Items</span>
                        <span className="font-medium text-black">
                          {totalItems < 10 ? `0${totalItems}` : totalItems}
                        </span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>Sub Total</span>
                        <span className="font-medium text-black">${subTotal.toFixed(2)}</span>
                      </div>
                      {discount > 0 && (
                        <div className="flex justify-between text-green-600">
                          <span>Discount</span>
                          <span className="font-medium">-${discount.toFixed(2)}</span>
                        </div>
                      )}
                      {tax > 0 && (
                        <div className="flex justify-between text-gray-600">
                          <span>Tax</span>
                          <span className="font-medium text-black">${tax.toFixed(2)}</span>
                        </div>
                      )}
                      {shipping > 0 && (
                        <div className="flex justify-between text-gray-600">
                          <span>Shipping</span>
                          <span className="font-medium text-black">${shipping.toFixed(2)}</span>
                        </div>
                      )}
                    </div>

                    {/* Total Price */}
                    <div className="mb-8 flex justify-between text-base font-bold text-black">
                      <span>Total Price</span>
                      <span>${totalPrice.toFixed(2)}</span>
                    </div>
                  </>
                )}

                {/* Actions */}
                <div className="space-y-3">
                  <Link href="/checkout" className="block w-full">
                    <button className="w-full rounded-sm bg-primary py-3.5 text-sm font-bold text-black transition-colors hover:bg-primary/90">
                      Proceed to Checkout
                    </button>
                  </Link>
                  <Link href="/shop" className="block">
                    <button className="w-full rounded-sm border border-black bg-transparent py-3.5 text-sm font-bold text-black transition-colors hover:bg-black hover:text-white">
                      Continue Shopping
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* You May Also Like Section */}
        {items.length > 0 && (
          <div className="mt-20">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-3xl font-bold text-black">You May Also Like</h2>
              <Link 
                href="/shop?sort=discount"
                className="flex items-center gap-1 text-sm font-bold text-black hover:text-primary"
              >
                View Discount Products <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {RELATED_PRODUCTS.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
