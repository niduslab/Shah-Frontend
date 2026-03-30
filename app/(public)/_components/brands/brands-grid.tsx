"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

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
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/catalog/brands?active=true&per_page=100');
        const data = await response.json();
        setBrands(data.data || []);
        setError(false);
      } catch (err) {
        console.error('Error fetching brands:', err);
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBrands();
  }, []);

  if (isLoading) {
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
              className="group relative flex aspect-[3/2] w-full items-center justify-center bg-gray-50 p-6 transition-all hover:bg-gray-100 hover:shadow-md rounded-sm"
            >
              <div className="relative h-full w-full">
                <Image
                  src={brand.logo}
                  alt={brand.name}
                  fill
                  className="object-contain transition-all duration-300 group-hover:scale-105"
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16vw"
                />
              </div>

              <div className="absolute bottom-2 left-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <p className="truncate font-medium">{brand.name}</p>
                {brand.products_count > 0 && (
                  <p className="text-gray-300">{brand.products_count} products</p>
                )}
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
