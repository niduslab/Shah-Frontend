"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductCard } from "../shared/product-card";
import { useShopProducts } from "@/lib/hooks/public";
import { getPrimaryImageUrl } from "@/lib/utils/image";

interface RecommendedProductsProps {
  currentProductId: number;
  categoryId?: number;
}

export function RecommendedProducts({ currentProductId, categoryId }: RecommendedProductsProps) {
  const { data, isLoading } = useShopProducts({
    category_id: categoryId,
    per_page: 8,
    is_featured: true,
  });

  const products = data?.data?.data || [];
  
  // Filter out the current product and limit to 4
  const recommendedProducts = products
    .filter((p: any) => p.id !== currentProductId)
    .slice(0, 4)
    .map((product: any) => ({
      id: product.id,
      name: product.name,
      slug: product.slug, // Add slug from API
      image: getPrimaryImageUrl(product.images),
      price: parseFloat(product.price),
      originalPrice: product.compare_price ? parseFloat(product.compare_price) : undefined,
      rating: product.average_rating || 5,
      reviews: product.review_count || 0,
      kinomap: product.kinomap,
      badge: product.compare_price
        ? {
            text: `-${Math.round(((parseFloat(product.compare_price) - parseFloat(product.price)) / parseFloat(product.compare_price)) * 100)}% off`,
            className: "bg-red-500",
          }
        : product.is_featured
        ? { text: "Featured", className: "bg-[#3E4C24]" }
        : undefined,
    }));

  if (isLoading || recommendedProducts.length === 0) {
    return null;
  }

  return (
    <section className="w-full bg-white py-12">
      <div className="mx-auto w-full max-w-[1400px] px-4 md:px-6">
        <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <h2 className="text-3xl font-bold tracking-tight text-black">
            You May Also Like
          </h2>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {recommendedProducts.map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
