"use client";

import Link from "next/link";
import { ChevronRight, Loader2 } from "lucide-react";
import { ProductCard } from "../shared/product-card";
import { useShopProducts } from "@/lib/hooks/public/useShop";
import { getPrimaryImageUrl } from "@/lib/utils/image";

export function NewArrivalProducts() {
  // Fetch 8 newest products
  const { data, isLoading, error } = useShopProducts({
    sort_by: "created_at",
    sort_order: "desc",
    per_page: 8,
    page: 1,
  });

  const products = data?.data?.data || [];

  // Transform API products to match ProductCard interface
  const transformedProducts = products.map((product: any) => {
    const isPreorderActive = product.is_preorder && 
      product.preorder_release_date && 
      new Date(product.preorder_release_date) > new Date();
    
    return {
      id: product.id,
      name: product.name,
      slug: product.slug,
      image: getPrimaryImageUrl(product.images),
      price: parseFloat(product.price),
      originalPrice: isPreorderActive ? undefined : (product.compare_price ? parseFloat(product.compare_price) : undefined),
      rating: product.average_rating ?? 0,
      reviews: product.review_count || 0,
      is_preorder: product.is_preorder,
      preorder_release_date: product.preorder_release_date,
      kinomap: product.kinomap,
      badge: { text: "New Arrival", className: "bg-[#3E4C24]" },
    };
  });

  return (
    <section className="w-full bg-white py-12">
      <div className="mx-auto w-full max-w-[1400px] px-4 md:px-6">
        <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <h2 className="text-3xl font-bold tracking-tight text-black">
            New Arrival Product
          </h2>
          <Link 
            href="/shop?sort=newest"
            className="flex items-center gap-1 text-[16px] font-semibold text-black hover:text-primary transition-colors"
          >
            View All Products <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex min-h-[300px] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="flex min-h-[300px] items-center justify-center">
            <p className="text-gray-500">Failed to load new arrival products</p>
          </div>
        )}

        {/* Products Grid */}
        {!isLoading && !error && transformedProducts.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {transformedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && transformedProducts.length === 0 && (
          <div className="flex min-h-[300px] items-center justify-center">
            <p className="text-gray-500">No new arrival products available</p>
          </div>
        )}
      </div>
    </section>
  );
}
