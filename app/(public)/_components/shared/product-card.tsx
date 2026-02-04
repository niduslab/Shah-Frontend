import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingBag, Star } from "lucide-react";

export interface Product {
  id: number;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  badge?: {
    text: string;
    className: string;
  };
}

interface ProductCardProps {
  product: Product;
  imageHeight?: string;
}

export function ProductCard({ product, imageHeight = "h-[372px]" }: ProductCardProps) {
  const productSlug = product.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

  return (
    <div className="group relative flex flex-col gap-4">
      {/* Image Container */}
      <div className={`relative ${imageHeight} w-full overflow-hidden rounded-xs bg-gray-50 p-8`}>
        {/* Badge */}
        {product.badge && (
          <div
            className={`absolute left-4 top-4 z-20 rounded px-2 py-1 text-xs font-bold text-white ${product.badge.className}`}
          >
            {product.badge.text}
          </div>
        )}
        
        <button className="absolute right-4 top-4 z-20 rounded-full bg-white p-2 text-gray-400 shadow-sm transition-colors hover:text-red-500">
          <Heart className="h-4 w-4" />
        </button>

        {/* Product Image */}
        <div className="block h-full w-full p-8">
          <div className="relative h-full w-full">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        </div>

        {/* Add to Cart Button (Slide up on hover) */}
        <div className="absolute bottom-0 left-0 right-0 z-20 p-4 translate-y-full transition-transform duration-300 group-hover:translate-y-0">
          <button className="flex h-11 w-full items-center justify-center gap-2 rounded-xs bg-primary text-[16px] font-semibold text-black shadow-sm transition-colors hover:bg-primary/90">
            <ShoppingBag className="h-4 w-4" />
            Add to Cart
          </button>
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
        <div className="flex items-baseline gap-3">
          <span className="text-xl font-bold text-black">
            ${product.price.toFixed(2)}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-gray-400 line-through">
              ${product.originalPrice.toFixed(2)}
            </span>
          )}
        </div>
        
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
