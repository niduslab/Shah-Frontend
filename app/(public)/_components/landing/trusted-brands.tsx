"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

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
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await fetch('/api/catalog/brands?active=true&per_page=12');
        const data = await response.json();
        setBrands(data.data || []);
      } catch (error) {
        console.error('Error fetching brands:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  useGSAP(() => {
    if (!containerRef.current || brands.length === 0) return;

    // Seamless infinite scroll animation
    // Duplicating the list creates a seamless loop
    const totalWidth = containerRef.current.scrollWidth;
    const singleSetWidth = totalWidth / 2;

    tweenRef.current = gsap.to(containerRef.current, {
      x: -singleSetWidth,
      duration: 20,
      ease: "none",
      repeat: -1,
    });
  }, { scope: containerRef, dependencies: [brands] });

  if (loading) {
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

  if (brands.length === 0) {
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
            {brands.map((brand) => (
              <Link
                key={`first-${brand.id}`}
                href={`/brand/${brand.slug}`}
                className="flex min-w-[200px] items-center justify-center rounded-xs bg-gray-50 px-8 py-6 transition-colors hover:bg-gray-100"
              >
                <div className="relative h-12 w-32">
                  <Image
                    src={brand.logo}
                    alt={brand.name}
                    fill
                    className="object-contain opacity-80 transition-opacity hover:opacity-100"
                  />
                </div>
              </Link>
            ))}
            {/* Second Set (Duplicate for seamless loop) */}
            {brands.map((brand) => (
              <Link
                key={`second-${brand.id}`}
                href={`/brand/${brand.slug}`}
                className="flex min-w-[200px] items-center justify-center rounded-xs bg-gray-50 px-8 py-6 transition-colors hover:bg-gray-100"
              >
                <div className="relative h-12 w-32">
                  <Image
                    src={brand.logo}
                    alt={brand.name}
                    fill
                    className="object-contain opacity-80 transition-opacity hover:opacity-100"
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
