"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Heart, ShoppingBag, Star, Zap } from "lucide-react";
import { useAuth } from "@/lib/context/AuthContext";
import { useCart } from "@/lib/context/CartContext";
import { useCheckWishlist, useAddToWishlist, useRemoveFromWishlistByProduct } from "@/lib/hooks/user/useWishlist";
import { getPlaceholderImage } from "@/lib/utils/image";
import { toast } from "sonner";

export interface Product {
  id: number;
  name: string;
  slug?: string;
  image: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  badge?: {
    text: string;
    className: string;
  };
  is_preorder?: boolean;
  preorder_release_date?: string;
  kinomap?: boolean;
  flash_price?: number;
  flash_discount_label?: string;
}

interface ProductCardProps {
  product: Product;
  imageHeight?: string;
}

export function ProductCard({ product, imageHeight = "h-[372px]" }: ProductCardProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { addToCart, isInCart } = useCart();
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  
  // Wishlist hooks
  const { data: wishlistCheck } = useCheckWishlist(product.id);
  const addToWishlistMutation = useAddToWishlist();
  const removeFromWishlistMutation = useRemoveFromWishlistByProduct();
  
  const isInWishlist = user && wishlistCheck?.data?.in_wishlist ? true : false;
  
  const productSlug = product.slug;
  const itemInCart = isInCart(product.id);
  
  // Check if preorder is active
  const isPreorderActive = product.is_preorder && 
    product.preorder_release_date && 
    new Date(product.preorder_release_date) > new Date();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();

    if (isAddingToCart) return;
    
    setIsAddingToCart(true);

    const cartItem = {
      product_id: product.id,
      variation_id: null,
      quantity: 1,
      product: product,
    };

    addToCart(cartItem, window.location.pathname);
    
    setTimeout(() => setIsAddingToCart(false), 500);
  };
  
  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();

    if (isAddingToCart) return;
    
    setIsAddingToCart(true);

    const cartItem = {
      product_id: product.id,
      variation_id: null,
      quantity: 1,
      product: product,
    };

    addToCart(cartItem);
    
    setTimeout(() => {
      setIsAddingToCart(false);
      router.push('/checkout');
    }, 300);
  };

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();

    if (!user) {
      toast.error('Please login to add items to your wishlist');
      router.push('/login');
      return;
    }

    try {
      if (isInWishlist) {
        await removeFromWishlistMutation.mutateAsync(product.id);
        toast.success('Removed from wishlist');
      } else {
        await addToWishlistMutation.mutateAsync({ product_id: product.id });
        toast.success('Added to wishlist');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to update wishlist';
      toast.error(errorMessage);
    }
  };

  return (
    <div className="group relative flex flex-col gap-4">
      {/* Image Container */}
      <div className={`relative ${imageHeight} w-full overflow-hidden rounded-xs bg-gray-50`}>
        {/* Badge */}
        {product.flash_price ? (
          <div className="absolute left-4 top-4 z-20 flex items-center gap-1 rounded-md bg-gradient-to-r from-red-500 to-orange-500 px-2 py-1 shadow-sm">
            <Zap className="h-3 w-3 fill-yellow-300 text-yellow-300" />
            <span className="text-xs font-bold text-white">Flash Deal</span>
          </div>
        ) : product.badge ? (
          <div
            className={`absolute left-4 top-4 z-20 rounded px-2 py-1 text-xs font-bold text-white ${product.badge.className}`}
          >
            {product.badge.text}
          </div>
        ) : null}
        
        <button 
          onClick={handleToggleWishlist}
          disabled={addToWishlistMutation.isPending || removeFromWishlistMutation.isPending}
          className={`absolute right-4 top-4 z-20 rounded-full bg-white p-2 shadow-sm transition-colors disabled:opacity-50 ${
            isInWishlist 
              ? 'text-red-500 hover:text-red-600' 
              : 'text-gray-400 hover:text-red-500'
          }`}
          aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`h-4 w-4 ${isInWishlist ? 'fill-current' : ''}`} />
        </button>

        {/* Kinomap icon if product supports kinomap */}
        {product.kinomap && (
          <Link 
            href="/kino-map"
            className="absolute right-3 top-15 z-20"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src="/kinomap_icon_lg.png"
              alt="Kinomap Compatible"
              className="h-10 w-10 object-contain"
            />
          </Link>
        )}

        {/* Product Image */}
        <div className="block h-full w-full">
          <div className="relative h-full w-full">
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-contain p-4 transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                e.currentTarget.src = getPlaceholderImage(product.name);
              }}
            />
          </div>
        </div>

        {/* Add to Cart / Buy Now Button (Slide up on hover) */}
        <div className="absolute bottom-0 left-0 right-0 z-20 p-4 translate-y-full transition-transform duration-300 group-hover:translate-y-0">
          {isPreorderActive ? (
            <button 
              onClick={handleBuyNow}
              type="button"
              disabled={isAddingToCart}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-xs bg-blue-600 text-[16px] font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingBag className="h-4 w-4" />
              {isAddingToCart ? 'Processing...' : 'Pre-Order Now'}
            </button>
          ) : (
            <button 
              onClick={handleAddToCart}
              type="button"
              disabled={isAddingToCart}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-xs bg-primary text-[16px] font-semibold text-black shadow-sm transition-colors hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingBag className="h-4 w-4" />
              {isAddingToCart ? 'Adding...' : (itemInCart ? 'Update Cart' : 'Add to Cart')}
            </button>
          )}
        </div>
      </div>

      {/* Product Info */}
      <div className="flex flex-col gap-2">
        <h3 className="line-clamp-2 text-base font-medium text-black transition-colors group-hover:text-primary">
          {product.name}
        </h3>
        
        {/* Rating */}
        <div className="flex items-center gap-2">
          <div className="flex text-primary">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`h-3.5 w-3.5 ${i < product.rating ? "fill-current" : "text-gray-300"}`} 
              />
            ))}
          </div>
          <span className="text-xs text-gray-500">({product.reviews} Reviews)</span>
        </div>

        {/* Price */}
        {product.flash_price ? (
          <div className="flex flex-col gap-0.5">
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-red-600">
                ${product.flash_price.toFixed(2)}
              </span>
              <span className="text-sm text-gray-400 line-through">
                ${product.price.toFixed(2)}
              </span>
            </div>
            {product.flash_discount_label && (
              <span className="w-fit rounded-sm bg-red-50 px-1.5 py-0.5 text-xs font-semibold text-red-600">
                {product.flash_discount_label}
              </span>
            )}
          </div>
        ) : (
          <div className="flex items-baseline gap-3">
            <span className="text-xl font-bold text-black">
              ${product.price.toFixed(2)}
            </span>
            {!isPreorderActive && product.originalPrice && (
              <span className="text-sm text-gray-400 line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
        )}
        
        {/* Explicit View Details Link */}
        <Link 
          href={`/product/${productSlug}`}
          className="relative z-30 mt-1 w-fit text-sm font-medium text-gray-500 underline decoration-gray-300 underline-offset-4 transition-colors hover:text-primary hover:decoration-primary"
        >
          View Details
        </Link>
      </div>

      {/* Overlay Link */}
      <Link 
        href={`/product/${productSlug}`} 
        className="absolute inset-0 z-10"
        aria-label={`View ${product.name}`}
      />
    </div>
  );
}
