"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ChevronRight, Loader2 } from "lucide-react";
import { ProductCard } from "../shared/product-card";
import { useShopProducts } from "@/lib/hooks/public/useShop";
import { getPrimaryImageUrl } from "@/lib/utils/image";

export function NewArrivalProducts() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const handleScroll = (direction: "left" | "right") => {
    const container = scrollRef.current;
    if (!container) return;

    const firstCard = container.querySelector<HTMLElement>(".arrival-card");
    const cardWidth = firstCard?.offsetWidth ?? container.clientWidth;
    // scroll by roughly one card + gap (gap-6 = 24px)
    const amount = cardWidth + 24;

    container.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

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

  // Track scroll position so arrows hide at the ends
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const updateScrollState = () => {
      setAtStart(container.scrollLeft <= 1);
      setAtEnd(
        container.scrollLeft + container.clientWidth >= container.scrollWidth - 1
      );
    };

    updateScrollState();
    container.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);

    return () => {
      container.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [transformedProducts.length]);

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

        {/* Products Carousel - 4 visible on desktop, swipeable on mobile */}
        {!isLoading && !error && transformedProducts.length > 0 && (
          <div className="relative">
            <div
              ref={scrollRef}
              className="flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            >
              {transformedProducts.map((product) => (
                <div
                  key={product.id}
                  className="arrival-card w-[80%] flex-shrink-0 snap-start sm:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-4.5rem)/4)]"
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>

            {/* Carousel arrows - centered on the product image, hidden at the ends */}
            <button
              type="button"
              onClick={() => handleScroll("left")}
              disabled={atStart}
              aria-label="Previous products"
              className="absolute left-0 top-[32%] z-10 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white text-black shadow-lg transition-all hover:bg-primary disabled:pointer-events-none disabled:opacity-0 md:h-12 md:w-12"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => handleScroll("right")}
              disabled={atEnd}
              aria-label="Next products"
              className="absolute right-0 top-[32%] z-10 flex h-11 w-11 translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white text-black shadow-lg transition-all hover:bg-primary disabled:pointer-events-none disabled:opacity-0 md:h-12 md:w-12"
            >
              <ArrowRight className="h-5 w-5" />
            </button>
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
