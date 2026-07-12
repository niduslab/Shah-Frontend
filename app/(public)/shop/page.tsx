"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronDown, ChevronLeft, ChevronRight, Loader2, Search, SlidersHorizontal, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ShopSidebar } from "../_components/shop/shop-sidebar";
import { ProductCard } from "../_components/shared/product-card";
import { FlashDealBanner } from "../_components/shop/flash-deal-banner";
import { useShopProducts } from "@/lib/hooks/public";
import { getPrimaryImageUrl } from "@/lib/utils/image";
import { useAnalytics } from "@/lib/hooks/useAnalytics";

const SORT_OPTIONS = [
  { label: "Best Match", value: "created_at", order: "desc" },
  { label: "Price: Low to High", value: "price", order: "asc" },
  { label: "Price: High to Low", value: "price", order: "desc" },
  { label: "Name: A to Z", value: "name", order: "asc" },
  { label: "Name: Z to A", value: "name", order: "desc" },
  { label: "Newest First", value: "created_at", order: "desc" },
  { label: "Oldest First", value: "created_at", order: "asc" },
];

function ShopContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const analytics = useAnalytics();
  const urlSearch = searchParams.get("search") || "";
  const urlPreorder = searchParams.get("is_preorder") === "true";
  const urlCategorySlug = searchParams.get("category");
  const urlBrandSlug = searchParams.get("brand");
  const urlFlashDealId = searchParams.get("flash_deal_id");
  const urlHasFlashDeal = searchParams.get("has_flash_deal") === "true";
  const urlHasDiscount = searchParams.get("has_discount") === "true";
  const urlHasPromotion = searchParams.get("has_promotion") === "true";
  const urlPromotionId = searchParams.get("promotion_id");
  const urlHasCoupon = searchParams.get("has_coupon") === "true";
  
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<"price" | "name" | "created_at">("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(urlSearch);
  const [searchInput, setSearchInput] = useState(urlSearch);
  const [minPrice, setMinPrice] = useState<number | undefined>();
  const [maxPrice, setMaxPrice] = useState<number | undefined>();
  const [inStock, setInStock] = useState<boolean | undefined>();
  const [brandSlug, setBrandSlug] = useState<string | undefined>(urlBrandSlug || undefined);
  const [categorySlug, setCategorySlug] = useState<string | undefined>(
    urlCategorySlug || undefined
  );
  const [isPreorder, setIsPreorder] = useState(urlPreorder);
  const [flashDealId, setFlashDealId] = useState<number | undefined>(
    urlFlashDealId ? parseInt(urlFlashDealId) : undefined
  );
  const [hasFlashDeal, setHasFlashDeal] = useState(urlHasFlashDeal);
  const [hasDiscount, setHasDiscount] = useState(urlHasDiscount);
  const [hasPromotion, setHasPromotion] = useState(urlHasPromotion);
  const [promotionId, setPromotionId] = useState<number | undefined>(
    urlPromotionId ? parseInt(urlPromotionId) : undefined
  );
  const [hasCoupon, setHasCoupon] = useState(urlHasCoupon);
  const perPage = 20;

  // Update search when URL parameter changes
  useEffect(() => {
    if (urlSearch) {
      setSearchQuery(urlSearch);
      setSearchInput(urlSearch);
    }
    if (urlPreorder) {
      setIsPreorder(true);
    }
    if (urlCategorySlug) {
      setCategorySlug(urlCategorySlug);
    }
    if (urlFlashDealId) {
      setFlashDealId(parseInt(urlFlashDealId));
    }
    if (urlHasFlashDeal) {
      setHasFlashDeal(true);
    }
    if (urlHasDiscount) {
      setHasDiscount(true);
    }
    if (urlHasPromotion) {
      setHasPromotion(true);
    }
    if (urlPromotionId) {
      setPromotionId(parseInt(urlPromotionId));
    }
    if (urlHasCoupon) {
      setHasCoupon(true);
    }
  }, [urlSearch, urlPreorder, urlCategorySlug, urlFlashDealId, urlHasFlashDeal, urlHasDiscount, urlHasPromotion, urlPromotionId, urlHasCoupon]);

  // Debounced search - auto-search as user types
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput);
      setCurrentPage(1);
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [searchInput]);

  // Prevent body scroll when mobile filter drawer is open
  useEffect(() => {
    document.body.style.overflow = isMobileFilterOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileFilterOpen]);

  const { data, isLoading, error } = useShopProducts({
    page: currentPage,
    per_page: perPage,
    sort_by: sortBy,
    sort_order: sortOrder,
    search: searchQuery || undefined,
    min_price: minPrice,
    max_price: maxPrice,
    in_stock: inStock,
    brand_slug: brandSlug,
    category_slug: categorySlug,
    is_preorder: isPreorder || undefined,
    flash_deal_id: flashDealId,
    has_flash_deal: hasFlashDeal || undefined,
    has_discount: hasDiscount || undefined,
    has_promotion: hasPromotion || undefined,
    promotion_id: promotionId,
    has_coupon: hasCoupon || undefined,
  });

  const products = data?.data?.data || [];
  const totalProducts = data?.data?.total || 0;
  const lastPage = data?.data?.last_page || 1;
  const currentPageData = data?.data?.current_page || 1;

  // Track search when query changes and results are loaded
  useEffect(() => {
    if (searchQuery && !isLoading && data?.data?.data) {
      analytics.trackSearch({
        query: searchQuery,
        results_count: data.data.total || 0,
      });
    }
  }, [searchQuery, isLoading, data, analytics]);

  const updateUrlParams = useCallback((updates: Record<string, string | undefined>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    router.replace(`/shop?${params.toString()}`, { scroll: false });
  }, [searchParams, router]);

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

  const handlePriceRangeChange = (min: number | undefined, max: number | undefined) => {
    setMinPrice(min);
    setMaxPrice(max);
    setCurrentPage(1);
  };

  const handleAvailabilityChange = (availability: boolean | undefined) => {
    setInStock(availability);
    setCurrentPage(1);
  };

  const handleBrandChange = (brand: string | undefined) => {
    setBrandSlug(brand);
    setCurrentPage(1);
    updateUrlParams({ brand });
  };

  const handleCategoryChange = (category: string | undefined) => {
    setCategorySlug(category);
    setCurrentPage(1);
    updateUrlParams({ category });
  };

  const handlePreorderChange = (preorder: boolean | undefined) => {
    setIsPreorder(preorder || false);
    setCurrentPage(1);
  };

  const selectedSortOption = SORT_OPTIONS.find(
    (opt) => opt.value === sortBy && opt.order === sortOrder
  ) || SORT_OPTIONS[0];

  // Transform API products to match ProductCard interface
  const transformedProducts = products.map((product: any) => {
    const isPreorderActive = product.is_preorder &&
      product.preorder_release_date &&
      new Date(product.preorder_release_date) > new Date();

    // Resolve the active flash deal for this product (pivot data)
    const activeFlashDeal = product.flash_deals?.[0];
    const flashPrice = activeFlashDeal?.pivot?.flash_price
      ? parseFloat(activeFlashDeal.pivot.flash_price)
      : undefined;

    let flashDiscountLabel: string | undefined;
    if (flashPrice && product.price) {
      const regularPrice = parseFloat(product.price);
      const savings = regularPrice - flashPrice;
      if (savings > 0) {
        const pct = Math.round((savings / regularPrice) * 100);
        flashDiscountLabel = `Save ${pct}% (–$${savings.toFixed(2)})`;
      }
    }

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
      flash_price: flashPrice,
      flash_discount_label: flashDiscountLabel,
      badge: !flashPrice && isPreorderActive
        ? { text: "Pre-Order", className: "bg-blue-600" }
        : !flashPrice && product.compare_price
        ? {
            text: `-${Math.round(((parseFloat(product.compare_price) - parseFloat(product.price)) / parseFloat(product.compare_price)) * 100)}% off`,
            className: "bg-red-500",
          }
        : !flashPrice && product.is_featured
        ? { text: "Featured", className: "bg-[#3E4C24]" }
        : !flashPrice && product.is_trending
        ? { text: "Trending", className: "bg-blue-500" }
        : undefined,
    };
  });

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
        <div className="mb-8">
          <h1 className="mb-4 text-3xl font-bold text-black md:text-4xl">
            {hasFlashDeal ? "Flash Deal Products" : "Shop From All Our Products"}
          </h1>
          <p className="max-w-3xl text-gray-500">
            {hasFlashDeal
              ? "Limited-time prices on selected products. Grab them before the deal ends!"
              : "Most-loved designs that consistently stand out for their quality, style, and everyday wearability."}
          </p>
        </div>

        {/* Flash Deal Banner */}
        {hasFlashDeal && <FlashDealBanner />}

        <div className="flex flex-col gap-12 lg:flex-row">
          {/* Sidebar - static on desktop */}
          <div className="hidden lg:block">
            <ShopSidebar
              onPriceRangeChange={handlePriceRangeChange}
              onAvailabilityChange={handleAvailabilityChange}
              onBrandChange={handleBrandChange}
              onCategoryChange={handleCategoryChange}
              onPreorderChange={handlePreorderChange}
              initialBrandSlug={urlBrandSlug || undefined}
              initialCategorySlug={urlCategorySlug || undefined}
            />
          </div>

          {/* Mobile Filter Drawer */}
          <div
            className={cn(
              "fixed inset-0 z-50 bg-black/50 transition-opacity duration-300 lg:hidden",
              isMobileFilterOpen ? "opacity-100" : "pointer-events-none opacity-0"
            )}
            onClick={() => setIsMobileFilterOpen(false)}
          />
          <div
            className={cn(
              "fixed top-0 left-0 z-50 h-full w-[85%] max-w-[340px] overflow-y-auto bg-white shadow-2xl transition-transform duration-300 ease-in-out lg:hidden",
              isMobileFilterOpen ? "translate-x-0" : "-translate-x-full"
            )}
          >
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
              <h2 className="text-lg font-bold text-black">Filters</h2>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="p-1 text-gray-500 hover:text-black"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="px-5 pb-24">
              <ShopSidebar
                onPriceRangeChange={handlePriceRangeChange}
                onAvailabilityChange={handleAvailabilityChange}
                onBrandChange={handleBrandChange}
                onCategoryChange={handleCategoryChange}
                onPreorderChange={handlePreorderChange}
                initialBrandSlug={urlBrandSlug || undefined}
                initialCategorySlug={urlCategorySlug || undefined}
              />
            </div>
            <div className="sticky bottom-0 border-t border-gray-100 bg-white p-4">
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-full rounded-md bg-black py-3 text-sm font-bold text-white"
              >
                Show {isLoading ? "" : totalProducts} Results
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar - All in One Line */}
            <div className="mb-8 flex flex-col gap-3 border-b border-gray-100 pb-6 sm:flex-row sm:items-center sm:gap-4 sm:justify-between">
              {/* Product Count */}
              <p className="text-sm text-gray-500 whitespace-nowrap">
                {isLoading ? "Loading..." : `${totalProducts} products available`}
              </p>

              {/* Search Bar + Mobile Filter Trigger */}
              <div className="flex flex-1 min-w-0 max-w-[500] gap-2">
                <div className="relative flex-1 min-w-0">
                  <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="Search for products..."
                    className="w-full rounded-md border border-gray-200 bg-white px-4 py-2 pl-10 text-sm text-black placeholder:text-gray-400 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                  />
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                </div>
                <button
                  onClick={() => setIsMobileFilterOpen(true)}
                  className="flex flex-shrink-0 items-center gap-1.5 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-black hover:border-gray-300 lg:hidden"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  Filter
                </button>
              </div>

              {/* Sort By Dropdown */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-sm text-gray-500 whitespace-nowrap">Sort By:</span>
                <div className="relative">
                  <button
                    onClick={() => setShowSortDropdown(!showSortDropdown)}
                    className="flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-black hover:border-gray-300 whitespace-nowrap"
                  >
                    {selectedSortOption.label}
                    <ChevronDown className="h-4 w-4 text-gray-500 flex-shrink-0" />
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
                <div id="flash-deal-products" className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
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

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="flex min-h-[60vh] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
      <ShopContent />
    </Suspense>
  );
}
