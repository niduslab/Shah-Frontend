"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { ShopSidebar } from "../_components/shop/shop-sidebar";
import { ProductCard } from "../_components/shared/product-card";
import { useShopProducts } from "@/lib/hooks/public";
import { getPrimaryImageUrl } from "@/lib/utils/image";

const SORT_OPTIONS = [
  { label: "Best Match", value: "created_at", order: "desc" },
  { label: "Price: Low to High", value: "price", order: "asc" },
  { label: "Price: High to Low", value: "price", order: "desc" },
  { label: "Name: A to Z", value: "name", order: "asc" },
  { label: "Name: Z to A", value: "name", order: "desc" },
  { label: "Newest First", value: "created_at", order: "desc" },
  { label: "Oldest First", value: "created_at", order: "asc" },
];

export default function ShopPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<"price" | "name" | "created_at">("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const perPage = 20;

  const { data, isLoading, error } = useShopProducts({
    page: currentPage,
    per_page: perPage,
    sort_by: sortBy,
    sort_order: sortOrder,
  });

  const products = data?.data?.data || [];
  const totalProducts = data?.data?.total || 0;
  const lastPage = data?.data?.last_page || 1;
  const currentPageData = data?.data?.current_page || 1;

  const handleSortChange = (value: string, order: string) => {
    setSortBy(value as "price" | "name" | "created_at");
    setSortOrder(order as "asc" | "desc");
    setShowSortDropdown(false);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const selectedSortOption = SORT_OPTIONS.find(
    (opt) => opt.value === sortBy && opt.order === sortOrder
  ) || SORT_OPTIONS[0];

  // Transform API products to match ProductCard interface
  const transformedProducts = products.map((product: any) => ({
    id: product.id,
    name: product.name,
    slug: product.slug, // Add slug from API
    image: getPrimaryImageUrl(product.images),
    price: parseFloat(product.price),
    originalPrice: product.compare_price ? parseFloat(product.compare_price) : undefined,
    rating: product.average_rating || 5,
    reviews: product.review_count || 0,
    badge: product.compare_price
      ? {
          text: `-${Math.round(((parseFloat(product.compare_price) - parseFloat(product.price)) / parseFloat(product.compare_price)) * 100)}% off`,
          className: "bg-red-500",
        }
      : product.is_featured
      ? { text: "Featured", className: "bg-[#3E4C24]" }
      : product.is_trending
      ? { text: "Trending", className: "bg-blue-500" }
      : undefined,
  }));

  return (
    <div className="w-full bg-white pb-20 pt-8">
      <div className="mx-auto w-full max-w-[1400px] px-4">
        {/* Breadcrumb */}
        <div className="mb-8 text-sm text-gray-500">
          <Link href="/" className="hover:text-black">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="font-medium text-black">Shop All Product</span>
        </div>

        {/* Header */}
        <div className="mb-12">
          <h1 className="mb-4 text-3xl font-bold text-black md:text-4xl">
            Shop From All Our Products
          </h1>
          <p className="max-w-3xl text-gray-500">
            Most-loved designs that consistently stand out for their quality, style, and everyday wearability.
          </p>
        </div>

        <div className="flex flex-col gap-12 lg:flex-row">
          {/* Sidebar */}
          <ShopSidebar />

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="mb-8 flex flex-col items-start justify-between gap-4 border-b border-gray-100 pb-6 sm:flex-row sm:items-center">
              <p className="text-sm text-gray-500">
                {isLoading ? "Loading..." : `${totalProducts} products are available`}
              </p>

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Sort By:</span>
                <div className="relative">
                  <button
                    onClick={() => setShowSortDropdown(!showSortDropdown)}
                    className="flex items-center gap-2 rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-black hover:border-gray-300"
                  >
                    {selectedSortOption.label}
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  </button>

                  {showSortDropdown && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setShowSortDropdown(false)}
                      />
                      <div className="absolute right-0 top-full z-20 mt-2 w-56 rounded-md border border-gray-200 bg-white shadow-lg">
                        {SORT_OPTIONS.map((option) => (
                          <button
                            key={`${option.value}-${option.order}`}
                            onClick={() => handleSortChange(option.value, option.order)}
                            className={`block w-full px-4 py-2 text-left text-sm hover:bg-gray-50 ${
                              option.value === sortBy && option.order === sortOrder
                                ? "bg-gray-50 font-medium"
                                : ""
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="flex min-h-[400px] items-center justify-center">
                <div className="text-center">
                  <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
                  <p className="mt-4 text-gray-500">Loading products...</p>
                </div>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="flex min-h-[400px] items-center justify-center">
                <div className="text-center">
                  <p className="text-red-500">Failed to load products</p>
                  <p className="mt-2 text-sm text-gray-500">Please try again later</p>
                </div>
              </div>
            )}

            {/* Empty State */}
            {!isLoading && !error && products.length === 0 && (
              <div className="flex min-h-[400px] items-center justify-center">
                <div className="text-center">
                  <p className="text-gray-500">No products found</p>
                  <p className="mt-2 text-sm text-gray-400">Try adjusting your filters</p>
                </div>
              </div>
            )}

            {/* Products Grid */}
            {!isLoading && !error && products.length > 0 && (
              <>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {transformedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {lastPage > 1 && (
                  <div className="mt-12 flex items-center justify-center gap-2">
                    <button
                      onClick={() => handlePageChange(currentPageData - 1)}
                      disabled={currentPageData === 1}
                      className="flex h-10 w-10 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>

                    {/* Page Numbers */}
                    {Array.from({ length: Math.min(5, lastPage) }, (_, i) => {
                      let pageNum;
                      if (lastPage <= 5) {
                        pageNum = i + 1;
                      } else if (currentPageData <= 3) {
                        pageNum = i + 1;
                      } else if (currentPageData >= lastPage - 2) {
                        pageNum = lastPage - 4 + i;
                      } else {
                        pageNum = currentPageData - 2 + i;
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`flex h-10 w-10 items-center justify-center rounded-md border text-sm font-medium ${
                            currentPageData === pageNum
                              ? "border-black bg-black text-white"
                              : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}

                    <button
                      onClick={() => handlePageChange(currentPageData + 1)}
                      disabled={currentPageData === lastPage}
                      className="flex h-10 w-10 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
