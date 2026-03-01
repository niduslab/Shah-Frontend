"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

// Generate brand image paths
const brandImages = Array.from({ length: 24 }, (_, i) => `/images/all-brands/brand-1 (${i + 1}).png`);

const categories = [
  {
    id: "fitness",
    label: "Fitness",
    content: (
      <div className="grid grid-cols-4 gap-8">
        <div className="col-span-3 grid grid-cols-3 gap-8">
          {/* Cardio */}
          <div>
            <h3 className="mb-4 text-base font-bold uppercase tracking-wider text-[#00072D]">Cardio</h3>
            <ul className="flex flex-col gap-2.5">
              {["Bike", "Treadmill", "Elliptical", "Rowing", "Stair Climber"].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-sm text-gray-600 transition-all hover:text-black hover:font-bold">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          {/* Strength */}
          <div>
            <h3 className="mb-4 text-base font-bold uppercase tracking-wider text-[#00072D]">Strength</h3>
            <ul className="flex flex-col gap-2.5">
              {["Selectorized Series", "Plate Loaded Series", "Hammer Series", "Multi Station Gym", "Functional Trainer"].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-sm text-gray-600 transition-all hover:text-black hover:font-bold">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          {/* Free Weight */}
          <div>
            <h3 className="mb-4 text-base font-bold uppercase tracking-wider text-[#00072D]">Free Weight</h3>
            <ul className="flex flex-col gap-2.5">
              {["Barbell", "Dumbbell", "Bench", "Weight Plate", "Fitness Accessories"].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-sm text-gray-600 transition-all hover:text-black hover:font-bold">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        {/* Promotional Image */}
        <div className="relative h-full min-h-[320px] overflow-hidden rounded-xl bg-gray-50 group">
          <Image
            src="/images/landing/pre-order/606b82b85373e30dc10d2f79a0253f7d20502b39.png"
            alt="Fitness Promo"
            fill
            className="object-contain p-6 pb-24 transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#00072D] via-[#00072D]/40 to-transparent" />
          <div className="absolute bottom-0 left-0 w-full p-6 text-white">
            <span className="mb-3 inline-block rounded-full bg-[#ffb81e] px-3 py-1 text-xs font-bold text-[#00072D]">
              NEW ARRIVAL
            </span>
            <h4 className="mb-2 text-2xl font-bold leading-tight">Pro Runner 5000</h4>
            <Link 
              href="#" 
              className="inline-flex items-center text-sm font-bold text-white transition-colors hover:text-[#ffb81e]"
            >
              Shop Now <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "sports",
    label: "Sports",
    content: (
      <div className="grid grid-cols-4 gap-8">
        <div className="col-span-2 grid grid-cols-2 gap-8">
          {/* Left Column */}
          <div>
            <ul className="flex flex-col gap-4">
              {["CRICKET", "FOOTBALL", "TABLE TENNIS", "HOCKEY"].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-base font-bold text-[#00072D] transition-all hover:text-[#ffb81e]">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          {/* Right Column */}
          <div>
            <ul className="flex flex-col gap-4">
              {["BASKETBALL", "BOXING", "BILLIARD", "SWIMMING"].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-base font-bold text-[#00072D] transition-all hover:text-[#ffb81e]">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Promotional Images - 2 Columns */}
        <div className="col-span-2 grid grid-cols-2 gap-4">
          {/* Promo 1 */}
          <div className="relative h-full min-h-[300px] overflow-hidden rounded-xl bg-gray-100 group">
            <Image
              src="/images/landing/rdx-gallery/9006e7dd80ecf645e78b83702112aee120de3a11.png"
              alt="Boxing Gear"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute bottom-5 left-5 text-white">
              <h4 className="mb-1 text-lg font-bold">Pro Boxing Gear</h4>
              <Link 
                href="#" 
                className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-[#ffb81e] hover:text-white"
              >
                Shop Collection <ChevronRight className="ml-1 h-3 w-3" />
              </Link>
            </div>
          </div>

          {/* Promo 2 */}
          <div className="relative h-full min-h-[300px] overflow-hidden rounded-xl bg-gray-100 group">
            <Image
              src="/images/landing/rdx-gallery/12297c9eef97e322f7c7a0fa9318ed7d1d10ec28.png"
              alt="Team Sports"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute bottom-5 left-5 text-white">
              <h4 className="mb-1 text-lg font-bold">Team Apparel</h4>
              <Link 
                href="#" 
                className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-[#ffb81e] hover:text-white"
              >
                View All <ChevronRight className="ml-1 h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "brands",
    label: "Brands",
    content: (
      <div>
        <h3 className="mb-6 text-base font-bold uppercase tracking-wider text-[#00072D]">Our Brands</h3>
        <div className="grid grid-cols-6 gap-6">
          {brandImages.map((src, index) => (
            <div key={index} className="flex items-center justify-center rounded-lg border border-gray-100 p-4 transition-shadow hover:shadow-md">
              <div className="relative h-12 w-24">
                <Image
                  src={src}
                  alt={`Brand ${index + 1}`}
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
];

export function ShopMainMegaMenu({ className }: { className?: string }) {
  const [activeCategory, setActiveCategory] = useState("fitness");

  const currentCategory = categories.find((c) => c.id === activeCategory);

  return (
    <div className={cn("absolute left-0 top-full z-50 mt-0 w-full border-t border-gray-100 bg-white shadow-xl before:absolute before:-top-10 before:left-0 before:h-10 before:w-full before:bg-transparent", className)}>
      <div className="mx-auto flex max-w-[1400px]">
        {/* Sidebar */}
        <div className="w-60 border-r border-gray-100 py-6">
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
          {currentCategory?.content}
        </div>
      </div>
    </div>
  );
}
