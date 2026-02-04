"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const BRANDS = [
  { id: 1, image: "/images/landing/branding/2a3d8a178ca7980782d274360c84291d72617ed5.png", name: "Adidas" },
  { id: 2, image: "/images/landing/branding/528c60084b4ad3b1e0a8ad8e35d94a6d01b00a0f.png", name: "SHUA" },
  { id: 3, image: "/images/landing/branding/5bb5b549b842ea7e6319d232bd5fec678aac4b8e.png", name: "UFC" },
  { id: 4, image: "/images/landing/branding/6a339c52fa6708244a8c31d0414ac6811a0da95e.png", name: "Spirit" },
  { id: 5, image: "/images/landing/branding/b20f41d38dc812e592e52cadeb981545900f0bd0.png", name: "NordicTrack" },
  { id: 6, image: "/images/landing/branding/c32c113dc3b8ddaf03c7467d79d040adb3d7ef9d (1).png", name: "WAVE" },
  { id: 7, image: "/images/landing/branding/c32c113dc3b8ddaf03c7467d79d040adb3d7ef9d.png", name: "Other" },
];

export function TrustedBrands() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current) return;

    // Seamless infinite scroll animation
    // Duplicating the list creates a seamless loop
    const totalWidth = containerRef.current.scrollWidth;
    const singleSetWidth = totalWidth / 2;

    gsap.to(containerRef.current, {
      x: -singleSetWidth,
      duration: 20,
      ease: "none",
      repeat: -1,
    });
  }, { scope: containerRef });

  return (
    <section className="w-full bg-white py-12 overflow-hidden">
      <div className="mx-auto w-full max-w-[1400px]">
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
        <div className="relative w-full overflow-hidden">
          <div 
            ref={containerRef}
            className="flex w-max gap-4"
          >
            {/* First Set */}
            {BRANDS.map((brand) => (
              <div
                key={`first-${brand.id}`}
                className="flex min-w-[200px] items-center justify-center rounded-xs bg-gray-50 px-8 py-6 transition-colors hover:bg-gray-100"
              >
                <div className="relative h-12 w-32">
                  <Image
                    src={brand.image}
                    alt={brand.name}
                    fill
                    className="object-contain opacity-80 transition-opacity hover:opacity-100"
                  />
                </div>
              </div>
            ))}
            {/* Second Set (Duplicate for seamless loop) */}
            {BRANDS.map((brand) => (
              <div
                key={`second-${brand.id}`}
                className="flex min-w-[200px] items-center justify-center rounded-xs bg-gray-50 px-8 py-6 transition-colors hover:bg-gray-100"
              >
                <div className="relative h-12 w-32">
                  <Image
                    src={brand.image}
                    alt={brand.name}
                    fill
                    className="object-contain opacity-80 transition-opacity hover:opacity-100"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
