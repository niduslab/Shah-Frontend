"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

// Generate brand image paths (assuming 24 brand images)
const brandImages = Array.from({ length: 24 }, (_, i) => `/images/all-brands/brand-1 (${i + 1}).png`);

// Featured Brands with logos (simulated by picking specific indices)
const featuredBrands = [
  { name: "NordicTrack", logo: brandImages[0], description: "Premium home fitness equipment" },
  { name: "ProForm", logo: brandImages[1], description: "Interactive training technology" },
  { name: "Reebok", logo: brandImages[2], description: "Global fitness & lifestyle brand" },
  { name: "Adidas", logo: brandImages[3], description: "Performance sports gear" },
];

const categories = [
  "Fitness Equipment",
  "Sports Gear",
  "Apparel",
  "Accessories",
  "Nutrition",
  "Recovery",
];

export function BrandsMegaMenu({ className }: { className?: string }) {
  return (
    <div className={cn("absolute left-0 top-full z-50 mt-0 w-full border-t border-gray-100 bg-white shadow-xl before:absolute before:-top-10 before:left-0 before:h-10 before:w-full before:bg-transparent", className)}>
      <div className="mx-auto max-w-[1400px]">
        <div className="grid grid-cols-12">
          
          {/* Sidebar: Categories & Featured */}
          <div className="col-span-3 border-r border-gray-100 bg-gray-50/50 p-8">
            <h3 className="mb-6 text-sm font-bold uppercase tracking-wider text-[#00072D]">
              Shop By Category
            </h3>
            <ul className="mb-8 flex flex-col gap-3">
              {categories.map((cat) => (
                <li key={cat}>
                  <Link 
                    href="#" 
                    className="group flex items-center justify-between text-sm font-medium text-gray-600 transition-colors hover:text-[#00072D] hover:font-bold"
                  >
                    {cat}
                    <ChevronRight className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100 text-[#ffb81e]" />
                  </Link>
                </li>
              ))}
            </ul>

            <div className="rounded-xl bg-[#00072D] p-6 text-white">
              <h4 className="mb-2 text-lg font-bold">Become a Partner</h4>
              <p className="mb-4 text-xs text-gray-300">Join our network of premium sports brands.</p>
              <Link 
                href="/contact" 
                className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-[#ffb81e] hover:text-white"
              >
                Apply Now <ChevronRight className="ml-1 h-3 w-3" />
              </Link>
            </div>
          </div>

          {/* Main Content: Brand Grid */}
          <div className="col-span-9 p-8">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-lg font-bold text-[#00072D]">Our Premium Partners</h3>
              <Link href="/brands" className="text-sm font-bold text-[#ffb81e] hover:underline">
                View All Brands
              </Link>
            </div>

            {/* Featured Spotlight (Top Row) */}
            <div className="mb-8 grid grid-cols-4 gap-4">
              {featuredBrands.map((brand, idx) => (
                <Link 
                  key={idx} 
                  href="#" 
                  className="group relative flex flex-col items-center justify-center rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:border-[#ffb81e]/30 hover:shadow-md"
                >
                  <div className="relative mb-3 h-12 w-32 grayscale transition-all duration-300 group-hover:grayscale-0">
                    <Image
                      src={brand.logo}
                      alt={brand.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <span className="text-xs font-medium text-gray-400 group-hover:text-[#00072D]">{brand.name}</span>
                </Link>
              ))}
            </div>

            {/* Full Brand Grid (Remaining) */}
            <h4 className="mb-4 text-xs font-bold uppercase tracking-wider text-gray-400">All Brands</h4>
            <div className="grid grid-cols-6 gap-4">
              {brandImages.slice(4, 22).map((src, index) => (
                <Link 
                  key={index} 
                  href="#" 
                  className="group flex h-20 items-center justify-center rounded-lg border border-gray-50 bg-white p-4 transition-all border-gray-200 hover:shadow-sm"
                >
                  <div className="relative h-full w-full opacity-60 transition-opacity duration-300 group-hover:opacity-100">
                    <Image
                      src={src}
                      alt={`Brand ${index + 5}`}
                      fill
                      className="object-contain"
                    />
                  </div>
                </Link>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
