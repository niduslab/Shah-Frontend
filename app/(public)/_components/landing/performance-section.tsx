"use client";

import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ProductCard } from "../shared/product-card";
import { useCategories } from "@/lib/hooks/public/useCategories";
import { useShopProducts } from "@/lib/hooks/public/useShop";
import { getPrimaryImageUrl } from "@/lib/utils/image";

/**
 * Find the top-level "Sports" category (case-insensitive) from the categories tree.
 */
function findSportsCategory(categories: any[]): any | undefined {
  return categories.find(
    (category) => category?.name?.trim().toLowerCase() === "sports"
  );
}

export function PerformanceSection() {
  // Resolve the Sports category slug dynamically from the catalog
  const { data: categoriesData } = useCategories();
  const categories = (categoriesData as any)?.data || [];
  const sportsCategory = findSportsCategory(categories);
  const sportsSlug: string | undefined = sportsCategory?.slug;

  // Fetch products within the Sports category. The backend resolves the
  // category slug to include every sub (and sub-sub) category's products.
  const { data, isLoading } = useShopProducts(
    {
      category_slug: sportsSlug,
      per_page: 4,
      sort_by: "created_at",
      sort_order: "desc",
    },
    { enabled: !!sportsSlug }
  );

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
  }));

  // Link to the shop pre-filtered to the Sports category (and all its children)
  const shopHref = sportsSlug ? `/shop?category=${sportsSlug}` : "/shop";

  // Don't render the section if there's no Sports category or no products in it
  if (!sportsSlug) {
    return null;
  }
  if (!isLoading && transformedProducts.length === 0) {
    return null;
  }

  return (
    <section className="w-full bg-white py-12">
      <div className="mx-auto w-full max-w-[1400px] px-4 md:px-6">
        <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <h2 className="text-3xl font-bold text-black">
            Play Better with the Right Gear
          </h2>
          <Link
            href={shopHref}
            className="flex items-center gap-2 text-[16px] font-bold text-[#3E4C24] hover:underline"
          >
            View All Products
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="relative h-[360px] overflow-hidden rounded-lg bg-gray-100 sm:h-[480px] md:h-[600px] lg:h-[800px]">
            <Image
              src="/images/landing/sports-gear/left-side-image.png"
              alt="Pickleball Gear"
              fill
              className="object-cover"
            />
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

            {/* Content */}
            <div className="absolute bottom-0 left-0 p-8 text-white">
              <h3 className="mb-2 text-3xl font-bold">Pickleball</h3>
              <p className="mb-6 max-w-md text-sm text-gray-200">
                Lightweight paddles and gear built for fast rallies and smooth gameplay.
              </p>
              <Link
                href={shopHref}
                className="flex items-center gap-2 rounded bg-[#FFC107] px-6 py-3 text-[16px] font-semibold text-black transition-colors hover:bg-[#FFC107]/90 w-fit"
              >
                Shop Now
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Right Product Grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {transformedProducts.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} imageHeight="h-[288px]" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
