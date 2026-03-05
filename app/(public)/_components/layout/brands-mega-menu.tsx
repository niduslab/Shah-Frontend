"use client";

import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

// All 24 brand images
const brandImages = Array.from({ length: 24 }, (_, i) => `/images/all-brands/brand-1 (${i + 1}).png`);

export function BrandsMegaMenu({ className }: { className?: string }) {
  return (
    <div className={cn("absolute left-0 top-full z-50 mt-0 w-full border-t border-gray-100 bg-white shadow-xl before:absolute before:-top-10 before:left-0 before:h-10 before:w-full before:bg-transparent", className)}>
      <div className="mx-auto max-w-[1400px] px-8 py-6">
        
        {/* Header */}
        <div className="mb-6 flex items-center justify-between border-b border-gray-100 pb-4">
          <h3 className="text-lg font-bold text-[#00072D]">Our Premium Partners</h3>
          <Link 
            href="/brands" 
            className="text-sm font-semibold text-[#ffb81e] transition-all hover:text-[#00072D] hover:gap-2 flex items-center gap-1"
          >
            View All Brands
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </div>

        {/* Brand Grid - Scrollable with max height 400px */}
        <div className="max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-track-gray-50 scrollbar-thumb-gray-200 hover:scrollbar-thumb-gray-300">
          <div className="grid grid-cols-8 gap-4">
            {brandImages.map((src, index) => (
              <Link 
                key={index} 
                href="/brands" 
                className="group relative flex h-[60px] w-[140px] items-center justify-center overflow-hidden rounded-lg border border-gray-100 bg-white p-3 shadow-sm transition-all duration-300 hover:border-[#ffb81e] hover:shadow-lg hover:-translate-y-0.5"
              >
                <div className="relative h-full w-full transition-all duration-300 group-hover:scale-105">
                  <Image
                    src={src}
                    alt={`Brand Partner ${index + 1}`}
                    fill
                    className="object-contain filter grayscale-[20%] group-hover:grayscale-0 transition-all duration-300"
                    sizes="115px"
                  />
                </div>
                {/* Subtle shine effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 -translate-x-full group-hover:translate-x-full group-hover:duration-700" />
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
