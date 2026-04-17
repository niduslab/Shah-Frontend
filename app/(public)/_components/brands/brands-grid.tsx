"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
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

export function BrandsGrid() {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { data, isLoading, error } = useBrands({
    enabled: isMounted, // Only fetch when component is mounted on client
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
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    // Remove leading slash if present to avoid double slashes
    const cleanPath = logoPath.startsWith('/') ? logoPath.slice(1) : logoPath;
    return `${apiUrl}/storage/${cleanPath}`;
  };

  if (!isMounted || isLoading) {
    return (
      <section className="bg-white py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-2xl font-bold text-gray-900 sm:text-3xl">
            Trusted Brands We Carry
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {Array.from({ length: 24 }).map((_, index) => (
              <div 
                key={index} 
                className="flex aspect-[3/2] w-full items-center justify-center bg-gray-100 p-6 animate-pulse"
              >
                <div className="h-12 w-20 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-white py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-2xl font-bold text-gray-900 sm:text-3xl">
            Trusted Brands We Carry
          </h2>
          <div className="text-center py-12">
            <p className="text-gray-500">Unable to load brands. Please try again later.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-8 text-2xl font-bold text-gray-900 sm:text-3xl">
          Trusted Brands We Carry
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {brands.map((brand: Brand) => (
            <Link
              key={brand.id}
              href={`/brand/${brand.slug}`}
              className="group relative flex aspect-[3/2] w-full items-center justify-center bg-gray-50 p-6 transition-all hover:bg-gray-100 hover:shadow-lg hover:ring-2 hover:ring-orange-500/50 rounded-lg cursor-pointer"
              title={`View ${brand.name} products`}
            >
              <div className="relative h-full w-full">
                <Image
                  src={getImageUrl(brand.logo)}
                  alt={`${brand.name} logo`}
                  fill
                  className="object-contain transition-all duration-300 group-hover:scale-110"
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16vw"
                  unoptimized={getImageUrl(brand.logo).includes('localhost')}
                />
              </div>

              {/* Hover overlay with brand info */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex flex-col justify-end p-3">
                <p className="text-white font-semibold text-sm truncate">{brand.name}</p>
                {brand.products_count > 0 && (
                  <p className="text-orange-400 text-xs font-medium">{brand.products_count} products</p>
                )}
                <p className="text-white/80 text-xs mt-1">Click to explore →</p>
              </div>
            </Link>
          ))}
        </div>
        
        {brands.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No brands available at the moment.</p>
          </div>
        )}
      </div>
    </section>
  );
}
