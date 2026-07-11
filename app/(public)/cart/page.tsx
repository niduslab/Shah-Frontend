"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight, Minus, Plus, Trash2, Loader2, Tag, ChevronDown, ChevronUp } from "lucide-react";
import { useAuth } from "@/lib/context/AuthContext";
import { useCart } from "@/lib/context/CartContext";
import { useCalculateCartSummary, useValidateCoupon, useAvailableCoupons } from "@/lib/hooks/public/useCart";
import { useShopProducts } from "@/lib/hooks/public";
import { ProductCard } from "../_components/shared/product-card";
import { toast } from "sonner";
import { getPlaceholderImage, getPrimaryImageUrl, getImageUrl } from "@/lib/utils/image";
import { formatCurrency } from "@/lib/utils/currency";
import { useAnalytics } from "@/lib/hooks/useAnalytics";

export default function CartPage() {
  const { loading: authLoading } = useAuth();
  const { items, updateQuantity, removeFromCart, getCartCount, appliedCoupon, setAppliedCoupon } = useCart();
  const analytics = useAnalytics();
  
  const [couponCode, setCouponCode] = useState("");
  const [cartSummary, setCartSummary] = useState<any>(null);
  const [isClient, setIsClient] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [showAvailableCoupons, setShowAvailableCoupons] = useState(false);

  const calculateSummary = useCalculateCartSummary();
  const validateCoupon = useValidateCoupon();
  const { data: availableCouponsData, isLoading: loadingCoupons } = useAvailableCoupons();

  // "You May Also Like" - trending products, excluding anything already in the cart
  const { data: relatedProductsData } = useShopProducts(
    { is_trending: true, per_page: 8 },
    { enabled: items.length > 0 }
  );
  const cartProductIds = new Set(items.map((item) => item.product_id));
  const relatedProducts = (relatedProductsData?.data?.data || [])
    .filter((p: any) => !cartProductIds.has(p.id))
    .slice(0, 4)
    .map((product: any) => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      image: getPrimaryImageUrl(product.images),
      price: parseFloat(product.price as any),
      originalPrice: product.compare_price ? parseFloat(product.compare_price as any) : undefined,
      rating: product.average_rating || 5,
      reviews: product.review_count || 0,
      badge: product.compare_price
        ? {
            text: `-${Math.round(((parseFloat(product.compare_price as any) - parseFloat(product.price as any)) / parseFloat(product.compare_price as any)) * 100)}% off`,
            className: "bg-red-500",
          }
        : undefined,
    }));

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

  // Load coupon code from applied coupon on mount
  useEffect(() => {
    if (appliedCoupon) {
      setCouponCode(appliedCoupon.code);
    }
  }, []);

  // No redirect - allow guest users to view cart

  // Set client-side flag after mount
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Track cart viewed when page loads with items
  useEffect(() => {
    if (isClient && items.length > 0 && cartSummary) {
      analytics.trackCheckout({
        status: 'cart_viewed',
        cart_items: items.map(item => ({
          product_id: item.product_id,
          name: item.product?.name || '',
          quantity: item.quantity,
          price: item.variation ? parseFloat(item.variation.price) : parseFloat(item.product?.price || '0'),
        })),
        cart_total: cartSummary.total,
        items_count: items.length,
      });
    }
  }, [isClient, items.length, cartSummary]);

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

  const handleApplyCoupon = (code?: string) => {
    const couponToApply = code || couponCode;
    
    if (!couponToApply.trim()) {
      toast.error('Please enter a coupon code');
      return;
    }

    if (!cartSummary) {
      toast.error('Cart summary not available');
      return;
    }

    // Prepare cart items for coupon validation
    const cartItems = items.map(item => ({
      product_id: item.product_id,
      variation_id: item.variation_id || undefined,
      quantity: item.quantity,
    }));

    validateCoupon.mutate(
      {
        code: couponToApply,
        items: cartItems,
        subtotal: cartSummary.subtotal,
      },
      {
        onSuccess: (response) => {
          if (response.success && response.data) {
            // Store coupon in context with proper structure
            const couponData = {
              code: response.data.coupon.code,
              discount_amount: response.data.discount,
              coupon: response.data.coupon,
            };
            setAppliedCoupon(couponData);
            setCouponCode(response.data.coupon.code);
            setShowAvailableCoupons(false);
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
  const totalPrice = subTotal - discount + tax + shipping;

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
                
                // Get image URL - handle both API format (images array) and product card format (image string)
                let imageUrl = getPlaceholderImage(product?.name || 'Product');
                if (product?.images && product.images.length > 0) {
                  imageUrl = getPrimaryImageUrl(product.images) || imageUrl;
                } else if (product?.image) {
                  imageUrl = getImageUrl(product.image) || product.image;
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
                        <p className="mb-2 text-sm text-gray-500">
                          {variation && variation.attributes && (
                            Object.entries(variation.attributes).map(([key, value]) => (
                              <span key={key} className="mr-2">
                                {key}: {value as string}
                              </span>
                            ))
                          )}
                          {product?.country_of_origin && (
                            <span className="mr-2 text-black font-bold">
                              Origin: {product.country_of_origin}
                            </span>
                          )}
                        </p>
                        <div className="flex items-center gap-3">
                          <span className="text-lg font-bold text-black">{formatCurrency(price)}</span>
                          {comparePrice && comparePrice > price && (
                            <>
                              <span className="text-sm text-gray-400 line-through">
                                {formatCurrency(comparePrice)}
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
                        <div className="flex items-center rounded-sm border border-gray-200 bg-white">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              const newQuantity = item.quantity - 1;
                              updateQuantity(item.product_id, newQuantity, item.variation_id);
                              
                              // Track quantity update
                              const price = item.variation ? parseFloat(item.variation.price) : parseFloat(item.product?.price || '0');
                              if (newQuantity > 0) {
                                analytics.trackUpdateCartQuantity(item.product_id, newQuantity, price, item.variation_id || undefined);
                              }
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
                              const newQuantity = item.quantity + 1;
                              updateQuantity(item.product_id, newQuantity, item.variation_id);
                              
                              // Track quantity update
                              const price = item.variation ? parseFloat(item.variation.price) : parseFloat(item.product?.price || '0');
                              analytics.trackUpdateCartQuantity(item.product_id, newQuantity, price, item.variation_id || undefined);
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
                            
                            // Track removal
                            const price = item.variation ? parseFloat(item.variation.price) : parseFloat(item.product?.price || '0');
                            analytics.trackRemoveFromCart(item.product_id, item.quantity, price);
                            
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
                    <div className="space-y-3">
                      <div className="flex items-center justify-between rounded-sm border border-green-200 bg-green-50 p-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="inline-flex items-center rounded-full bg-green-600 px-2.5 py-0.5 text-xs font-bold text-white">
                              {appliedCoupon.code}
                            </span>
                            <span className="text-sm font-medium text-green-800">
                              Coupon Applied
                            </span>
                          </div>
                          <p className="text-sm text-green-700">
                            {appliedCoupon.coupon?.name || 'Discount Applied'}
                          </p>
                          <p className="text-xs text-green-600 mt-1">
                            You saved {formatCurrency(appliedCoupon.discount_amount)}
                          </p>
                        </div>
                        <button
                          onClick={handleRemoveCoupon}
                          className="text-sm font-medium text-red-600 hover:text-red-700 underline"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Enter coupon code"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleApplyCoupon();
                            }
                          }}
                          className="w-full rounded-sm border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-black"
                        />
                        <button
                          onClick={() => handleApplyCoupon()}
                          disabled={validateCoupon.isPending}
                          className="rounded-sm bg-primary px-4 py-2.5 text-sm font-bold text-black hover:bg-primary/90 disabled:opacity-50 whitespace-nowrap"
                        >
                          {validateCoupon.isPending ? 'Applying...' : 'Apply'}
                        </button>
                      </div>
                      
                      {/* Promotions & Deals Button */}
                      <button
                        onClick={() => setShowAvailableCoupons(!showAvailableCoupons)}
                        className="flex w-full items-center justify-between rounded-sm border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <Tag className="h-4 w-4 text-[#FF6F00]" />
                          <span>Promotions & Deals</span>
                        </div>
                        {showAvailableCoupons ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </button>

                      {/* Available Coupons List */}
                      {showAvailableCoupons && (
                        <div className="rounded-sm border border-gray-200 bg-white">
                          {loadingCoupons ? (
                            <div className="flex items-center justify-center py-8">
                              <Loader2 className="h-5 w-5 animate-spin text-primary" />
                            </div>
                          ) : availableCouponsData?.success && availableCouponsData?.data?.length > 0 ? (
                            <div className="max-h-[400px] overflow-y-auto">
                              {availableCouponsData.data.map((coupon: any) => (
                                <div
                                  key={coupon.id}
                                  className="border-b border-gray-100 p-4 last:border-0 hover:bg-gray-50 transition-colors"
                                >
                                  <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-2 mb-1">
                                        <span className="inline-flex items-center rounded-sm bg-[#FF6F00] px-2 py-0.5 text-xs font-bold text-white">
                                          {coupon.code}
                                        </span>
                                        {coupon.discount_type === 'percentage' && (
                                          <span className="text-xs font-semibold text-[#FF6F00]">
                                            {coupon.discount_value}% OFF
                                          </span>
                                        )}
                                        {coupon.discount_type === 'fixed_amount' && (
                                          <span className="text-xs font-semibold text-[#FF6F00]">
                                            ${parseFloat(coupon.discount_value).toFixed(2)} OFF
                                          </span>
                                        )}
                                        {coupon.discount_type === 'free_shipping' && (
                                          <span className="text-xs font-semibold text-[#FF6F00]">
                                            FREE SHIPPING
                                          </span>
                                        )}
                                      </div>
                                      <p className="text-sm font-medium text-gray-900 mb-1">
                                        {coupon.name}
                                      </p>
                                      {coupon.description && (
                                        <p className="text-xs text-gray-600 mb-2">
                                          {coupon.description}
                                        </p>
                                      )}
                                      <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                                        {coupon.min_purchase_amount && parseFloat(coupon.min_purchase_amount) > 0 && (
                                          <span>Min: {formatCurrency(coupon.min_purchase_amount)}</span>
                                        )}
                                        {coupon.max_discount_amount && parseFloat(coupon.max_discount_amount) > 0 && (
                                          <span>Max: {formatCurrency(coupon.max_discount_amount)}</span>
                                        )}
                                        {coupon.expires_at && (
                                          <span>
                                            Expires: {new Date(coupon.expires_at).toLocaleDateString()}
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                    <button
                                      onClick={() => handleApplyCoupon(coupon.code)}
                                      disabled={validateCoupon.isPending}
                                      className="flex-shrink-0 rounded-sm bg-primary px-3 py-1.5 text-xs font-bold text-black hover:bg-primary/90 disabled:opacity-50 transition-colors"
                                    >
                                      Apply
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="py-8 text-center">
                              <Tag className="mx-auto h-8 w-8 text-gray-300 mb-2" />
                              <p className="text-sm text-gray-500">No coupons available at the moment</p>
                            </div>
                          )}
                        </div>
                      )}
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
                        <span className="font-medium text-black">{formatCurrency(subTotal)}</span>
                      </div>
                      {discount > 0 && (
                        <div className="flex justify-between text-green-600">
                          <span>Discount</span>
                          <span className="font-medium">-{formatCurrency(discount)}</span>
                        </div>
                      )}
                      {tax > 0 && (
                        <div className="flex justify-between text-gray-600">
                          <span>Tax</span>
                          <span className="font-medium text-black">{formatCurrency(tax)}</span>
                        </div>
                      )}
                      {shipping > 0 && (
                        <div className="flex justify-between text-gray-600">
                          <span>Shipping</span>
                          <span className="font-medium text-black">{formatCurrency(shipping)}</span>
                        </div>
                      )}
                    </div>

                    {/* Total Price */}
                    <div className="mb-8 flex justify-between text-base font-bold text-black">
                      <span>Total Price</span>
                      <span>{formatCurrency(totalPrice)}</span>
                    </div>
                  </>
                )}

                {/* Actions */}
                <div className="space-y-3">
                  <Link 
                    href="/checkout" 
                    className="block w-full"
                    onClick={() => {
                      // Track checkout initiated
                      analytics.trackCheckout({
                        status: 'checkout_initiated',
                        cart_total: totalPrice,
                        items_count: items.length,
                      });
                    }}
                  >
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
        {items.length > 0 && relatedProducts.length > 0 && (
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
              {relatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
