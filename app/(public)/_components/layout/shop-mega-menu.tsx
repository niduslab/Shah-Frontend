"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

const categories = [
  {
    id: "cardio",
    label: "Cardio",
    items: [
      { name: "Bike", href: "#" },
      { name: "Treadmill", href: "#" },
      { name: "Elliptical", href: "#" },
      { name: "Rowing", href: "#" },
      { name: "Stair Climber", href: "#" },
    ],
    featured: [
      {
        name: "Pro Runner 5000",
        image: "/images/landing/pre-order/606b82b85373e30dc10d2f79a0253f7d20502b39.png",
        price: "$1,299",
      },
      {
        name: "Elite Cycle",
        image: "/images/landing/pre-order/63594412e77df42c02a5f16d3a2eceb8d4f91d99.png",
        price: "$899",
      },
      {
        name: "Air Rower",
        image: "/images/landing/pre-order/a1d135ac0387f5fbbc33cdd695d09e992dc2d274.png",
        price: "$999",
      },
    ],
  },
  {
    id: "strength",
    label: "Strength",
    items: [
      { name: "Selectorized Series", href: "#" },
      { name: "Plate Loaded Series", href: "#" },
      { name: "Hammer Series", href: "#" },
      { name: "Multi Station Gym", href: "#" },
      { name: "Functional Trainer", href: "#" },
    ],
    featured: [
      {
        name: "Power Rack X",
        image: "/images/landing/pre-order/a1d135ac0387f5fbbc33cdd695d09e992dc2d274.png",
        price: "$1,499",
      },
      {
        name: "Dumbbell Set",
        image: "/images/landing/pre-order/a9bf5425dbad371e93771b044cfeaccd4402283d.png",
        price: "$499",
      },
      {
        name: "Multi Gym Pro",
        image: "/images/landing/pre-order/c7b139cd4aecc159bde32e9387c0dcb372021ab9.png",
        price: "$2,499",
      },
    ],
  },
  {
    id: "free-weight",
    label: "Free Weight",
    items: [
      { name: "Barbell", href: "#" },
      { name: "Dumbbell", href: "#" },
      { name: "Bench", href: "#" },
      { name: "Weight Plate", href: "#" },
      { name: "Fitness Accessories", href: "#" },
    ],
    featured: [
      {
        name: "Olympic Barbell",
        image: "/images/landing/pre-order/c7b139cd4aecc159bde32e9387c0dcb372021ab9.png",
        price: "$299",
      },
      {
        name: "Adjustable Bench",
        image: "/images/landing/pre-order/606b82b85373e30dc10d2f79a0253f7d20502b39.png",
        price: "$199",
      },
      {
        name: "Weight Plates Set",
        image: "/images/landing/pre-order/63594412e77df42c02a5f16d3a2eceb8d4f91d99.png",
        price: "$349",
      },
    ],
  },
];

export function ShopMegaMenu({ className }: { className?: string }) {
  const [activeCategory, setActiveCategory] = useState("cardio");

  const currentCategory = categories.find((c) => c.id === activeCategory);

  return (
    <div className={cn("absolute left-0 top-full z-50 mt-0 w-full border-t border-gray-100 bg-white shadow-xl before:absolute before:-top-10 before:left-0 before:h-10 before:w-full before:bg-transparent", className)}>
      <div className="mx-auto flex max-w-[1400px]">
        {/* Sidebar */}
        <div className="w-64 border-r border-gray-100 py-6">
          <ul className="flex flex-col">
            {categories.map((category) => (
              <li key={category.id}>
                <button
                  onMouseEnter={() => setActiveCategory(category.id)}
                  className={cn(
                    "flex w-full items-center justify-between px-6 py-3 text-left text-sm font-medium transition-colors",
                    activeCategory === category.id
                      ? "bg-gray-50 text-black font-bold"
                      : "text-gray-600 hover:bg-gray-50 hover:text-black hover:font-bold"
                  )}
                >
                  {category.label}
                  {activeCategory === category.id && (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Content Area */}
        <div className="flex-1 px-8 py-6">
          <div className="grid grid-cols-12 gap-6">
            {/* Sub Categories List */}
            <div className="col-span-3 border-r border-gray-100 pr-6">
              <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-[#00072D]">
                {currentCategory?.label} Categories
              </h3>
              <ul className="flex flex-col gap-2.5">
                {currentCategory?.items.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-sm text-gray-600 transition-all hover:text-black hover:font-bold"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Featured Images / Trending Products */}
            <div className="col-span-9 pl-2">
              <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-[#00072D]">
                Trending Products
              </h3>
              <div className="grid grid-cols-3 gap-5">
                {currentCategory?.featured.map((product, index) => (
                  <div key={index} className="group cursor-pointer rounded-lg p-2 transition-all hover:bg-gray-50 hover:shadow-sm">
                    <div className="relative mb-3 aspect-[4/3] overflow-hidden rounded-md bg-white p-2">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-contain transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div className="flex flex-col px-1">
                      <span className="text-sm font-medium text-gray-900 group-hover:text-black group-hover:font-bold">
                        {product.name}
                      </span>
                      <span className="text-xs text-gray-500 font-semibold mt-1">
                        {product.price}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
