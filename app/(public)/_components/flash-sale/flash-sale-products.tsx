"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { ProductCard } from "../shared/product-card";

// Mock data matching the reference image style
const PRODUCTS = [
  {
    id: 1,
    name: "NordicTrack Commercial 1750 Treadmill",
    image: "/images/brand-page/recommended-products/4f2898a8276c69c0710c7a4d32a4ee439c0ec93f.png",
    price: 824.00,
    originalPrice: 1999.00,
    rating: 5,
    reviews: 12,
    category: "Treadmill",
    badge: { text: "-58% off", className: "bg-red-500" }
  },
  {
    id: 2,
    name: "Reebok Fitness Training Deck RAP-15170RD",
    image: "/images/brand-page/recommended-products/7f93b91b48b01ee042621a6882518a622196882d.png", // Reusing available images
    price: 180.99,
    originalPrice: 240.99,
    rating: 5,
    reviews: 12,
    category: "Bench",
    badge: { text: "-33% off", className: "bg-red-500" }
  },
  {
    id: 3,
    name: "Adidas Wheel Roller ADAC-11404BK-NL",
    image: "/images/brand-page/recommended-products/8e1428eaef037d4a8c03c5e5d99f2092821ffea5.png",
    price: 19.99,
    originalPrice: 1999.00, // This seems high for a roller, but following data structure
    rating: 5,
    reviews: 12,
    category: "Accessories",
    badge: { text: "-99% off", className: "bg-red-500" }
  },
  {
    id: 4,
    name: "Sole B 94 Upright Cardio Exercise Bike",
    image: "/images/brand-page/recommended-products/b750d2ef2ffb5d944592687bc623f7e52d5cdd67.png",
    price: 999.99,
    originalPrice: 1099.99,
    rating: 5,
    reviews: 12,
    category: "Bike",
    badge: { text: "-9% off", className: "bg-red-500" }
  },
  {
    id: 5,
    name: "GENESIS DS Chest",
    image: "/images/brand-page/recommended-products/dcd5b672d99ac525bbb4544a2c33bf2d3711e131.png",
    price: 5250.99,
    originalPrice: 10500.99,
    rating: 5,
    reviews: 12,
    category: "Strength",
    badge: { text: "-50% off", className: "bg-red-500" }
  },
  {
    id: 6,
    name: "UFC Standard Heavy Bag",
    image: "/images/brand-page/recommended-products/e7709c26eed3a5e5119c0b030d75911d4867d0bb.png",
    price: 130.99,
    rating: 5,
    reviews: 56,
    category: "Boxing",
    badge: { text: "-27% off", className: "bg-red-500" }
  },
  {
    id: 7,
    name: "Reebok Training Speed Rope",
    image: "/images/brand-page/recommended-products/ec81ee83869ec955226882ac6b8bfd0b075f0969.png",
    price: 12.25,
    rating: 5,
    reviews: 56,
    category: "Accessories",
    badge: { text: "-5% off", className: "bg-red-500" }
  },
  {
    id: 8,
    name: "Reebok Premium Push Up Bars",
    image: "/images/brand-page/recommended-products/fe957b1ccd8bb7cafc7bb6fdecd25626c336cf58.png",
    price: 55.99,
    rating: 5,
    reviews: 56,
    category: "Accessories",
    badge: { text: "-16% off", className: "bg-red-500" }
  },
];

const TABS = [
  "All",
  "Treadmill",
  "Bike",
  "Rowing",
  "Elliptical",
  "Barbell",
  "Bench",
  "Dumbbell",
  "Hammer Series",
  "Weight Plate"
];

export function FlashSaleProducts() {
  const [activeTab, setActiveTab] = useState("All");

  const filteredProducts =
    activeTab === "All"
      ? PRODUCTS
      : PRODUCTS.filter((product) => product.category === activeTab);

  return (
    <section id="products" className="w-full bg-white py-12">
      <div className="mx-auto w-full max-w-[1400px] px-4 md:px-6">
        {/* Filter Tabs */}
        <div className="mb-8 flex flex-wrap gap-2 justify-center md:justify-start">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-full px-6 py-2 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? "bg-yellow-400 text-black"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
          {filteredProducts.length === 0 && (
            <div className="col-span-full py-20 text-center text-gray-500">
              No products found in this category.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
