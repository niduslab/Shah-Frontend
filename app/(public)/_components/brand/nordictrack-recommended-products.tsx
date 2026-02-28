"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { ProductCard } from "../shared/product-card";

// Using the images found in the recommended-products folder
const PRODUCTS = [
  {
    id: 1,
    name: "NordicTrack Commercial 1750 Treadmill",
    image: "/images/brand-page/recommended-products/4f2898a8276c69c0710c7a4d32a4ee439c0ec93f.png",
    price: 1999.99,
    rating: 5,
    reviews: 246,
    category: "Treadmill",
  },
  {
    id: 2,
    name: "NordicTrack recumbent bike R35 NTEX14921-INT",
    image: "/images/brand-page/recommended-products/7f93b91b48b01ee042621a6882518a622196882d.png",
    price: 1599.99,
    rating: 5,
    reviews: 12,
    category: "Bike",
  },
  {
    id: 3,
    name: "NordicTrack Commercial 9.9 Elliptical Cross Trainer NTEL79820-INT",
    image: "/images/brand-page/recommended-products/8e1428eaef037d4a8c03c5e5d99f2092821ffea5.png",
    price: 824.00,
    originalPrice: 1999.00,
    rating: 5,
    reviews: 29,
    category: "Elliptical",
  },
  {
    id: 4,
    name: "NordicTrack Tour De France Indoor Bike",
    image: "/images/brand-page/recommended-products/b750d2ef2ffb5d944592687bc623f7e52d5cdd67.png",
    price: 2499.00,
    rating: 5,
    reviews: 12,
    category: "Bike",
  },
  {
    id: 5,
    name: "NordicTrack Ultra 1 Premium Treadmill",
    image: "/images/brand-page/recommended-products/dcd5b672d99ac525bbb4544a2c33bf2d3711e131.png",
    price: 15000.00,
    rating: 5,
    reviews: 7,
    category: "Treadmill",
  },
  {
    id: 6,
    name: "NordicTrack X24 Touch Screen Versatile Treadmill",
    image: "/images/brand-page/recommended-products/e7709c26eed3a5e5119c0b030d75911d4867d0bb.png",
    price: 2999.00,
    rating: 5,
    reviews: 12,
    category: "Treadmill",
  },
  {
    id: 7,
    name: "Nordic Track SE 7i Crosstrainer NTEL99421-INT",
    image: "/images/brand-page/recommended-products/ec81ee83869ec955226882ac6b8bfd0b075f0969.png",
    price: 1999.00,
    rating: 5,
    reviews: 12,
    category: "Elliptical",
  },
  {
    id: 8,
    name: "NordicTrack T7.0s Treadmill NETL 79019",
    image: "/images/brand-page/recommended-products/fe957b1ccd8bb7cafc7bb6fdecd25626c336cf58.png",
    price: 1496.99,
    rating: 5,
    reviews: 12,
    category: "Treadmill",
  },
];

const TABS = ["All", "Treadmill", "Bike", "Rowing", "Elliptical", "Pilates"];

export function NordicTrackRecommendedProducts() {
  const [activeTab, setActiveTab] = useState("All");

  const filteredProducts =
    activeTab === "All"
      ? PRODUCTS
      : PRODUCTS.filter((product) => product.category === activeTab);

  return (
    <section className="w-full bg-white py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
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
        <div className="mb-8 flex flex-wrap gap-2">
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
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
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
