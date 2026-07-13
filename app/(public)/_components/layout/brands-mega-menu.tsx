"use client";

import { API_ORIGIN } from '@/lib/config/api';
import { useState, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useBrands } from "@/lib/hooks/public/useBrands";

interface Brand {
  id: number;
  name: string;
  slug: string;
  description: string;
  logo: string;
  is_active: boolean;
  sort_order: number;
  products_count: number;
}

export function BrandsMegaMenu({ className, onLinkClick }: { className?: string; onLinkClick?: () => void }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { data, isLoading, error } = useBrands({
    enabled: isMounted,
  }) as any;

  const brands = data?.data || [];

  // Helper function to get full image URL
  const getImageUrl = (logoPath: string) => {
    if (!logoPath) return '';
    // If already a full URL, return as is
    if (logoPath.startsWith('http://') || logoPath.startsWith('https://')) {
      return logoPath;
    }
    // Otherwise, prepend the API URL
    const apiUrl = API_ORIGIN;
    // Remove leading slash if present to avoid double slashes
    const cleanPath = logoPath.startsWith('/') ? logoPath.slice(1) : logoPath;
    return `${apiUrl}/storage/${cleanPath}`;
  };

  return (
    <div className={cn("absolute left-0 top-full z-50 mt-0 w-full border-t border-gray-100 bg-white shadow-xl before:absolute before:-top-10 before:left-0 before:h-10 before:w-full before:bg-transparent", className)}>
      <div className="mx-auto max-w-[1400px] px-8 py-6">
        
        {/* Header */}
        <div className="mb-6 flex items-center justify-between border-b border-gray-100 pb-4">
          <h3 className="text-lg font-bold text-[#00072D]">Our Premium Partners</h3>
          <Link 
            href="/brands" 
            className="text-sm font-semibold text-[#ffb81e] transition-all hover:text-[#00072D] hover:gap-2 flex items-center gap-1"
            onClick={onLinkClick}
          >
            View All Brands
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </div>

        {/* Brand Grid - Scrollable with max height 400px */}
        <div className="max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-track-gray-50 scrollbar-thumb-gray-200 hover:scrollbar-thumb-gray-300">
          {isLoading || !isMounted ? (
            <div className="grid grid-cols-8 gap-4">
              {Array.from({ length: 24 }).map((_, index) => (
                <div 
                  key={index} 
                  className="flex h-[60px] w-[140px] items-center justify-center rounded-lg border border-gray-100 bg-gray-50 p-3 animate-pulse"
                >
                  <div className="h-8 w-20 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-gray-500 text-sm">Unable to load brands. Please try again later.</p>
            </div>
          ) : brands.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 text-sm">No brands available at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-8 gap-4">
              {brands.map((brand: Brand) => (
                <Link 
                  key={brand.id} 
                  href={`/brand/${brand.slug}`}
                  className="group relative flex h-[60px] w-[140px] items-center justify-center overflow-hidden rounded-lg border border-gray-100 bg-white p-3 shadow-sm transition-all duration-300 hover:border-[#ffb81e] hover:shadow-lg hover:-translate-y-0.5"
                  title={`View ${brand.name} products`}
                  onClick={onLinkClick}
                >
                  <div className="relative h-full w-full transition-all duration-300 group-hover:scale-105">
                    <img
                      src={getImageUrl(brand.logo)}
                      alt={`${brand.name} logo`}
                      className="h-full w-full object-contain filter grayscale-[20%] group-hover:grayscale-0 transition-all duration-300"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  </div>
                  {/* Subtle shine effect on hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 -translate-x-full group-hover:translate-x-full group-hover:duration-700" />
                </Link>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
