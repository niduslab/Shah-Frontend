"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { ShopSidebar } from "../_components/shop/shop-sidebar";
import { ProductCard } from "../_components/shared/product-card";

const SHOP_PRODUCTS = [
  {
    id: 1,
    name: "Reebok Training Speed Rope",
    image: "/images/landing/new-arrival/d28b697c5ffd69551d236e0311c369e1daa2111e.png",
    price: 12.25,
    rating: 5,
    reviews: 56,
    badge: { text: "New Arrival", className: "bg-[#3E4C24]" },
  },
  {
    id: 2,
    name: "UFC Standard Heavy Bag",
    image: "/images/landing/new-arrival/48ea1efb27d9c62811e189727ecd54692bf0e529.png",
    price: 130.99,
    rating: 5,
    reviews: 56,
    badge: { text: "New Arrival", className: "bg-[#3E4C24]" },
  },
  {
    id: 3,
    name: "Reebok Premium Push Up Bars",
    image: "/images/landing/new-arrival/d6d857a1c8f1272b3e4a3e6e66b8975e36f83230.png",
    price: 55.99,
    rating: 5,
    reviews: 56,
    badge: { text: "New Arrival", className: "bg-[#3E4C24]" },
  },
  {
    id: 4,
    name: "Reebok Fitness Training Deck RAP-15170RD",
    image: "/images/landing/new-arrival/3c81b2d5cfd837c1a87f80ecd4654d112931d943.png",
    price: 180.99,
    originalPrice: 240.99,
    rating: 5,
    reviews: 12,
    badge: { text: "-25% off", className: "bg-red-500" },
  },
  {
    id: 5,
    name: "Adidas Wheel Roller ADAC-11404BK-NL",
    image: "/images/landing/new-arrival/d6d857a1c8f1272b3e4a3e6e66b8975e36f83230.png", // Using placeholder if image not found, but trying to match existing
    price: 19.99,
    originalPrice: 1999.00, // Seems high in image, copying exactly
    rating: 5,
    reviews: 12,
    badge: { text: "-25% off", className: "bg-red-500" },
  },
  {
    id: 6,
    name: "UFC Contender Free Standing Bag UHA 69919",
    image: "/images/landing/new-arrival/d28b697c5ffd69551d236e0311c369e1daa2111e.png", // Reusing bag image
    price: 320.99,
    originalPrice: 449.00,
    rating: 5,
    reviews: 12,
    badge: { text: "-25% off", className: "bg-red-500" },
  },
  {
    id: 7,
    name: "Wave Mirrored Electroplate Antifog Swimming Goggles",
    image: "/images/landing/new-arrival/3c81b2d5cfd837c1a87f80ecd4654d112931d943.png", // Placeholder
    price: 15.99,
    originalPrice: 19.99,
    rating: 5,
    reviews: 12,
    badge: { text: "-25% off", className: "bg-red-500" },
  },
  {
    id: 8,
    name: "Xterra Adjustable Dumbbell 50kg Set",
    image: "/images/landing/new-arrival/d6d857a1c8f1272b3e4a3e6e66b8975e36f83230.png", // Placeholder
    price: 438.00,
    originalPrice: 473.00,
    rating: 5,
    reviews: 39,
    badge: { text: "-25% off", className: "bg-red-500" },
  },
  {
    id: 9,
    name: "NordicTrack Commercial 1750 Treadmill",
    image: "/images/landing/new-arrival/48ea1efb27d9c62811e189727ecd54692bf0e529.png", // Placeholder
    price: 824.00,
    originalPrice: 1999.00,
    rating: 5,
    reviews: 12,
    badge: { text: "-25% off", className: "bg-red-500" },
  },
];

export default function ShopPage() {
  return (
    <div className="w-full bg-white pb-20 pt-8">
      <div className="mx-auto w-full max-w-[1400px]">
        {/* Breadcrumb */}
        <div className="mb-8 text-sm text-gray-500">
          <Link href="/" className="hover:text-black">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-black font-medium">Shop All Product</span>
        </div>

        {/* Header */}
        <div className="mb-12">
          <h1 className="mb-4 text-3xl font-bold text-black md:text-4xl">Shop From All Our Products</h1>
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
              <p className="text-sm text-gray-500">676 products are available</p>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Sort By:</span>
                <div className="relative">
                  <button className="flex items-center gap-2 rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-black">
                    Best Match
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  </button>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {SHOP_PRODUCTS.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
