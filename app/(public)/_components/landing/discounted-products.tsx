"use client";

import Link from "next/link";
import { ChevronRight, Loader2 } from "lucide-react";
import { ProductCard } from "../shared/product-card";
import { useShopProducts } from "@/lib/hooks/public";
import { getPrimaryImageUrl } from "@/lib/utils/image";

export function DiscountedProducts() {
  const { data, isLoading, error } = useShopProducts({
    has_discount: true,
    per_page: 8,
    sort_by: "created_at",
    sort_order: "desc",
  });

  const products = data?.data?.data || [];

  // Transform API products to match ProductCard interface
  const transformedProducts = products.map((product: any) => ({
    id: product.id,
    name: product.name,
    slug: product.slug,
    image: getPrimaryImageUrl(product.images),
    price: parseFloat(product.price),
    originalPrice: product.compare_price ? parseFloat(product.compare_price) : undefined,
    rating: product.average_rating ?? 0,
    reviews: product.review_count || 0,
    kinomap: product.kinomap,
    badge: product.compare_price
      ? {
          text: `-${Math.round(((parseFloat(product.compare_price) - parseFloat(product.price)) / parseFloat(product.compare_price)) * 100)}% off`,
          className: "bg-red-500",
        }
      : undefined,
  }));

  // Show loading state
  if (isLoading) {
    return (
      <section className="w-full bg-white py-12">
        <div className="mx-auto w-full max-w-[1400px] px-4 md:px-6">
          <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <h2 className="text-3xl font-bold tracking-tight text-black">
              Discount Products
            </h2>
            <Link 
              href="/shop?has_discount=true"
              className="flex items-center gap-1 text-[16px] font-semibold text-black hover:text-primary transition-colors"
            >
              View All Discounts <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="flex min-h-[300px] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      </section>
    );
  }

  // Don't show section if there are no discounted products or error
  if (error || products.length === 0) {
    return null;
  }

  return (
    <section className="w-full bg-white py-12">
      <div className="mx-auto w-full max-w-[1400px] px-4 md:px-6">
        <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <h2 className="text-3xl font-bold tracking-tight text-black">
            Discount Products
          </h2>
          <Link 
            href="/shop?has_discount=true"
            className="flex items-center gap-1 text-[16px] font-semibold text-black hover:text-primary transition-colors"
          >
            View All Discounts <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {transformedProducts.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
