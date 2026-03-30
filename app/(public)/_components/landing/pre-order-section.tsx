"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface PreOrderData {
  enabled: boolean;
  sectionTitle: string;
  viewAllText: string;
  viewAllUrl: string;
  mainFeature: {
    image: string;
    title: string;
    buttonText: string;
    buttonUrl: string;
    saveBadge: {
      enabled: boolean;
      text: string;
      percentage: string;
    };
  };
  gridImages: {
    id: string;
    image: string;
    alt: string;
  }[];
}

const DEFAULT_DATA: PreOrderData = {
  enabled: true,
  sectionTitle: "Pre-Order Now & Save Big",
  viewAllText: "View All Preorder Products",
  viewAllUrl: "/shop",
  mainFeature: {
    image: "/images/landing/pre-order/c7b139cd4aecc159bde32e9387c0dcb372021ab9.png",
    title: "Nordictrack T Series\n10 Treadmill",
    buttonText: "Preorder Now",
    buttonUrl: "/shop",
    saveBadge: {
      enabled: true,
      text: "Save",
      percentage: "30%",
    },
  },
  gridImages: [
    { id: "grid1", image: "/images/landing/pre-order/606b82b85373e30dc10d2f79a0253f7d20502b39.png", alt: "Fitness Equipment 1" },
    { id: "grid2", image: "/images/landing/pre-order/63594412e77df42c02a5f16d3a2eceb8d4f91d99.png", alt: "Fitness Equipment 2" },
    { id: "grid3", image: "/images/landing/pre-order/a1d135ac0387f5fbbc33cdd695d09e992dc2d274.png", alt: "Fitness Equipment 3" },
    { id: "grid4", image: "/images/landing/pre-order/a9bf5425dbad371e93771b044cfeaccd4402283d.png", alt: "Fitness Equipment 4" },
  ],
};

export function PreOrderSection() {
  const [data, setData] = useState<PreOrderData>(DEFAULT_DATA);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/hero-sections");
        if (response.ok) {
          const result = await response.json();
          if (result.preOrderSection) {
            // Override URLs to redirect to shop with is_preorder filter
            const updatedData = {
              ...result.preOrderSection,
              viewAllUrl: "/shop",
              mainFeature: {
                ...result.preOrderSection.mainFeature,
                buttonUrl: "/shop",
              },
            };
            setData(updatedData);
          }
        }
      } catch (error) {
        console.error("Error fetching pre-order data:", error);
      }
    };

    fetchData();
  }, []);
  const containerRef = useRef<HTMLDivElement>(null);
  const mainImageRef = useRef<HTMLDivElement>(null);
  const rightGridRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 75%",
        toggleActions: "play none none reverse",
      },
    });

    // Header Animation
    tl.from(".section-header", {
      opacity: 0,
      y: 30,
      duration: 0.8,
      ease: "power3.out",
    });

    // Main Content Animation
    tl.from(mainImageRef.current, {
      opacity: 0,
      x: -50,
      duration: 1,
      ease: "power3.out",
    }, "-=0.4");

    // Right Grid Items Animation
    if (rightGridRef.current) {
        tl.from(rightGridRef.current.children, {
        opacity: 0,
        x: 50,
        stagger: 0.1,
        duration: 0.8,
        ease: "power3.out",
        }, "-=0.8");
    }

    // Optional Parallax for Main Image
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.to(".parallax-img", {
            scale: 1.1,
            ease: "none",
            scrollTrigger: {
                trigger: mainImageRef.current,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
            },
        });
    });

  }, { scope: containerRef });

  if (!data.enabled) {
    return null;
  }

  const renderTitle = (title: string) => {
    return title.split("\n").map((line, index) => (
      <span key={index}>
        {line}
        {index < title.split("\n").length - 1 && <br />}
      </span>
    ));
  };

  return (
    <section ref={containerRef} className="w-full bg-white py-12">
      <div className="mx-auto w-full max-w-[1400px] px-4 md:px-6">
        {/* Header */}
        <div className="section-header mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <h2 className="text-3xl font-bold tracking-tight text-black">
            {data.sectionTitle}
          </h2>
          <Link
            href={`${data.viewAllUrl}?is_preorder=true`}
            className="group flex items-center gap-2 text-sm font-semibold text-black transition-colors hover:text-primary"
          >
            {data.viewAllText}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Grid Layout */}
        <div className="grid h-auto w-full grid-cols-1 gap-4 lg:grid-cols-2 lg:h-[600px]">
          {/* Main Feature Item (Left) */}
          <Link href={`${data.mainFeature.buttonUrl}?is_preorder=true`} className="block">
            <div ref={mainImageRef} className="group relative h-[400px] w-full overflow-hidden rounded-[2px] bg-gray-100 lg:h-full cursor-pointer">
              <div className="h-full w-full overflow-hidden">
                  <Image
                  src={data.mainFeature.image}
                  alt={data.mainFeature.title}
                  fill
                  className="parallax-img object-cover transition-transform duration-500 group-hover:scale-105 will-change-transform"
                  />
              </div>
            
            {/* Badge */}
            {data.mainFeature.saveBadge.enabled && (
              <div className="absolute left-6 top-6 flex h-20 w-20 flex-col items-center justify-center rounded-full bg-[#D35400] text-white shadow-lg z-10">
                <span className="text-xs font-medium">{data.mainFeature.saveBadge.text}</span>
                <span className="text-xl font-bold leading-none">{data.mainFeature.saveBadge.percentage}</span>
              </div>
            )}

            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90 pointer-events-none" />

            {/* Content */}
            <div className="absolute bottom-8 left-8 max-w-md text-white z-10">
              <h3 className="mb-6 text-3xl font-bold leading-tight md:text-4xl">
                {renderTitle(data.mainFeature.title)}
              </h3>
              <span
                className="inline-flex w-fit items-center gap-2 rounded-md bg-[#FFB800] px-6 py-3 text-sm font-bold text-black transition-transform hover:scale-105 active:scale-95"
              >
                {data.mainFeature.buttonText}
                <ArrowRight className="h-4 w-4" />
              </span>
            </div>

            {/* Carousel Dots (Static for UI) */}
            <div className="absolute bottom-8 right-8 flex gap-2 z-10">
              <div className="h-2 w-2 rounded-full bg-white/50"></div>
              <div className="h-2 w-2 rounded-full bg-[#FFB800]"></div>
              <div className="h-2 w-2 rounded-full bg-white/50"></div>
            </div>
            </div>
          </Link>

          {/* Right Grid (4 Items) */}
          <div ref={rightGridRef} className="grid h-full grid-cols-2 grid-rows-2 gap-4">
            {data.gridImages.map((item) => (
              <Link key={item.id} href={`${data.viewAllUrl}?is_preorder=true`}>
                <div className="group relative h-[200px] w-full overflow-hidden rounded-[2px] bg-gray-50 lg:h-full cursor-pointer">
                  <Image
                    src={item.image}
                    alt={item.alt}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
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
