"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useBrands } from "@/lib/hooks/public/useBrands";

interface Brand {
  id: number;
  name: string;
  slug: string;
  logo: string;
  is_active: boolean;
}

export function TrustedBrands() {
  const containerRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { data: brandsData, isLoading, error } = useBrands({
    enabled: isMounted,
  }) as any;

  const brands = brandsData?.data || [];

  // Helper function to get full image URL
  const getImageUrl = (logoPath: string) => {
    if (!logoPath) return '';
    if (logoPath.startsWith('http://') || logoPath.startsWith('https://')) {
      return logoPath;
    }
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    const cleanPath = logoPath.startsWith('/') ? logoPath.slice(1) : logoPath;
    return `${apiUrl}/storage/${cleanPath}`;
  };

  useGSAP(() => {
    if (!containerRef.current || brands.length === 0) return;

    // Cleanup previous tween
    if (tweenRef.current) {
      tweenRef.current.kill();
    }

    // Seamless infinite scroll animation
    const totalWidth = containerRef.current.scrollWidth;
    const singleSetWidth = totalWidth / 2;

    tweenRef.current = gsap.to(containerRef.current, {
      x: -singleSetWidth,
      duration: 80,
      ease: "none",
      repeat: -1,
    });

    return () => {
      tweenRef.current?.kill();
    };
  }, { scope: containerRef, dependencies: [brands] });

  if (isLoading) {
    return (
      <section className="w-full bg-white py-12 overflow-hidden">
        <div className="mx-auto w-full max-w-[1400px] px-4 md:px-6">
          <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <h2 className="text-3xl font-bold tracking-tight text-black">
              Trusted Brands We Carry
            </h2>
          </div>
          <div className="flex gap-4 overflow-hidden">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="min-w-[200px] h-24 bg-gray-100 rounded-xs animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error || brands.length === 0) {
    return null;
  }

  return (
    <section className="w-full bg-white py-12 overflow-hidden">
      <div className="mx-auto w-full max-w-[1400px] px-4 md:px-6">
        <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <h2 className="text-3xl font-bold tracking-tight text-black">
            Trusted Brands We Carry
          </h2>
          <Link 
            href="/brands"
            className="flex items-center gap-1 text-[16px] font-bold text-[#3E4C24] hover:text-primary transition-colors"
          >
            View All Brands <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Brands Scroll Container */}
        <div 
          className="relative w-full overflow-hidden"
          onMouseEnter={() => tweenRef.current?.pause()}
          onMouseLeave={() => tweenRef.current?.play()}
        >
          <div 
            ref={containerRef}
            className="flex w-max gap-4"
          >
            {/* First Set */}
            {brands.map((brand: Brand) => (
              <Link
                key={`first-${brand.id}`}
                href={`/brand/${brand.slug}`}
                className="flex min-w-[200px] items-center justify-center rounded-xs bg-gray-50 px-8 py-6 transition-colors hover:bg-gray-100"
              >
                <div className="relative h-12 w-32">
                  <Image
                    src={getImageUrl(brand.logo)}
                    alt={brand.name}
                    fill
                    className="object-contain opacity-80 transition-opacity hover:opacity-100"
                    unoptimized={getImageUrl(brand.logo).includes('localhost')}
                  />
                </div>
              </Link>
            ))}
            {/* Second Set (Duplicate for seamless loop) */}
            {brands.map((brand: Brand) => (
              <Link
                key={`second-${brand.id}`}
                href={`/brand/${brand.slug}`}
                className="flex min-w-[200px] items-center justify-center rounded-xs bg-gray-50 px-8 py-6 transition-colors hover:bg-gray-100"
              >
                <div className="relative h-12 w-32">
                  <Image
                    src={getImageUrl(brand.logo)}
                    alt={brand.name}
                    fill
                    className="object-contain opacity-80 transition-opacity hover:opacity-100"
                    unoptimized={getImageUrl(brand.logo).includes('localhost')}
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
