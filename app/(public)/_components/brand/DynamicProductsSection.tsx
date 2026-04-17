"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { ProductCard } from "../shared/product-card";
import { getPrimaryImageUrl } from "@/lib/utils/image";

interface Product {
  id: number;
  name: string;
  slug: string;
  price: string;
  compare_price?: string;
  images: Array<{ 
    full_url?: string;
    image_path?: string;
    is_primary: boolean;
  }>;
  quantity: number;
  category?: { name: string };
  brand?: { name: string };
  average_rating?: number;
  review_count?: number;
  is_preorder?: boolean;
  preorder_release_date?: string;
  kinomap?: boolean;
  is_featured?: boolean;
  is_trending?: boolean;
}

interface DynamicProductsSectionProps {
  brandId: number;
  brandName: string;
}

const TABS = ["All", "Treadmill", "Bike", "Rowing", "Elliptical", "Pilates"];

export function DynamicProductsSection({ brandId, brandName }: DynamicProductsSectionProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
        const response = await fetch(
          `${apiUrl}/api/catalog/products?page=1&per_page=20&sort_by=created_at&sort_order=desc&brand_id=${brandId}`,
          { cache: 'no-store' }
        );
        
        if (response.ok) {
          const result = await response.json();
          console.log('[Products Section] API Response:', result);
          // API returns { success: true, data: { data: [...], current_page: 1, ... } }
          setProducts(result.data?.data || []);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [brandId]);

  // Filter products based on active tab
  const filteredProducts = activeTab === "All"
    ? products
    : products.filter((product) => {
        const categoryName = product.category?.name?.toLowerCase() || "";
        return categoryName.includes(activeTab.toLowerCase());
      });

  // Convert API product to ProductCard format (same as shop page)
  const convertToCardProduct = (product: Product) => {
    // Check if preorder date is still active
    const isPreorderActive = product.is_preorder && 
      product.preorder_release_date && 
      new Date(product.preorder_release_date) > new Date();
    
    const price = parseFloat(product.price);
    const comparePrice = product.compare_price ? parseFloat(product.compare_price) : undefined;

    return {
      id: product.id,
      name: product.name,
      slug: product.slug,
      image: getPrimaryImageUrl(product.images),
      price: price,
      // Hide original price if preorder is active
      originalPrice: isPreorderActive ? undefined : comparePrice,
      rating: product.average_rating || 5,
      reviews: product.review_count || 0,
      is_preorder: product.is_preorder,
      preorder_release_date: product.preorder_release_date,
      kinomap: product.kinomap,
      badge: isPreorderActive
        ? { text: "Pre-Order", className: "bg-blue-600" }
        : comparePrice && comparePrice > price
        ? {
            text: `-${Math.round(((comparePrice - price) / comparePrice) * 100)}% off`,
            className: "bg-red-500",
          }
        : product.is_featured
        ? { text: "Featured", className: "bg-[#3E4C24]" }
        : product.is_trending
        ? { text: "Trending", className: "bg-blue-500" }
        : undefined,
    };
  };

  if (loading) {
    return (
      <section className="w-full bg-white py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-0 max-w-[1400px]">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-[#FFC107]"></div>
            <p className="mt-4 text-gray-600">Loading products...</p>
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="w-full bg-white py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-0 max-w-[1400px]">
        {/* Header */}
        <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <h2 className="text-3xl font-bold tracking-tight text-black">
            Recommended Products
          </h2>
          <Link
            href="/shop"
            className="flex items-center gap-1 text-[16px] font-semibold text-black hover:text-[#FFC107] transition-colors"
          >
            View All Products <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Tabs */}
        {/* <div className="mb-8 flex flex-wrap gap-2">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-full px-6 py-2 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? "bg-[#FFC107] text-black"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {tab}
            </button>
          ))}
        </div> */}

        {/* Product Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.length > 0 ? (
            filteredProducts.slice(0, 8).map((product) => (
              <ProductCard 
                key={product.id} 
                product={convertToCardProduct(product)} 
              />
            ))
          ) : (
            <div className="col-span-full py-12 text-center text-gray-500">
              No products found in this category.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
