"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const GALLERY_ITEMS = [
  {
    id: 1,
    title: "Training",
    image: "/images/landing/rdx-gallery/9006e7dd80ecf645e78b83702112aee120de3a11.png",
    href: "/shop/training",
    className: "h-[280px]",
  },
  {
    id: 2,
    title: "Apparel",
    image: "/images/landing/rdx-gallery/12297c9eef97e322f7c7a0fa9318ed7d1d10ec28.png",
    href: "/shop/apparel",
    className: "h-[280px]",
  },
  {
    id: 3,
    title: "Boxing",
    image: "/images/landing/rdx-gallery/9126b5c957ee5df27dff7a87011a99f338fd0203.png",
    href: "/shop/boxing",
    className: "h-[280px] md:row-span-2 md:h-full",
  },
  {
    id: 4,
    title: "Yoga",
    image: "/images/landing/rdx-gallery/09869b02227fe933f21baa27ed5b13a449885fed.png",
    href: "/shop/yoga",
    className: "h-[280px]",
  },
  {
    id: 5,
    title: "Weight Lifting",
    image: "/images/landing/rdx-gallery/eed8082ab239304497367efe632ede29a9b94f41.png",
    href: "/shop/weight-lifting",
    className: "h-[280px]",
  },
];

export function RdxGallerySection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 75%",
        toggleActions: "play none none reverse",
      },
    });

    // Header Animation
    tl.from("h2", {
      opacity: 0,
      y: 30,
      duration: 0.8,
      ease: "power3.out",
    });

    // Grid Items Animation
    // Select all grid items (links)
    const items = containerRef.current?.querySelectorAll(".gallery-item");
    if (items) {
      tl.from(items, {
        opacity: 0,
        y: 50,
        scale: 0.95,
        stagger: 0.1,
        duration: 0.8,
        ease: "power3.out",
      }, "-=0.4");
    }

  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="w-full bg-white py-12">
      <div className="mx-auto w-full max-w-[1400px] px-4 md:px-6">
        <h2 className="mb-8 text-center text-3xl font-bold tracking-tight text-black md:text-4xl">
          Shop From Our New RDX Gallery
        </h2>

        {/* 
          Grid Layout:
          - Left side: 2x2 grid (Training, Apparel, Yoga, Weight Lifting)
          - Right side: Boxing (tall card spanning full height)
        */}
        <div className="grid grid-cols-1 gap-4 px-4 md:grid-cols-[2fr_1fr] md:px-0">
          {/* Left side: 2x2 grid */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-[60fr_40fr] md:grid-rows-2">
            {/* Training - Top Left */}
            <Link
              href={GALLERY_ITEMS[0].href}
              className="gallery-item group relative block h-[280px] overflow-hidden rounded-[2px] bg-gray-100 cursor-pointer"
            >
              <Image
                src={GALLERY_ITEMS[0].image}
                alt={GALLERY_ITEMS[0].title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105 will-change-transform pointer-events-none"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 z-10 md:bottom-6 md:left-6 pointer-events-none">
                <h3 className="text-xl font-semibold text-white md:text-2xl">
                  {GALLERY_ITEMS[0].title}
                </h3>
              </div>
            </Link>

            {/* Apparel - Top Right */}
            <Link
              href={GALLERY_ITEMS[1].href}
              className="gallery-item group relative block h-[280px] overflow-hidden rounded-[2px] bg-gray-100 cursor-pointer"
            >
              <Image
                src={GALLERY_ITEMS[1].image}
                alt={GALLERY_ITEMS[1].title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105 will-change-transform pointer-events-none"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 z-10 md:bottom-6 md:left-6 pointer-events-none">
                <h3 className="text-xl font-semibold text-white md:text-2xl">
                  {GALLERY_ITEMS[1].title}
                </h3>
              </div>
            </Link>

            {/* Yoga - Bottom Left */}
            <Link
              href={GALLERY_ITEMS[3].href}
              className="gallery-item group relative block h-[280px] overflow-hidden rounded-[2px] bg-gray-100 cursor-pointer"
            >
              <Image
                src={GALLERY_ITEMS[3].image}
                alt={GALLERY_ITEMS[3].title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105 will-change-transform pointer-events-none"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 z-10 md:bottom-6 md:left-6 pointer-events-none">
                <h3 className="text-xl font-semibold text-white md:text-2xl">
                  {GALLERY_ITEMS[3].title}
                </h3>
              </div>
            </Link>

            {/* Weight Lifting - Bottom Right */}
            <Link
              href={GALLERY_ITEMS[4].href}
              className="gallery-item group relative block h-[280px] overflow-hidden rounded-[2px] bg-gray-100 cursor-pointer"
            >
              <Image
                src={GALLERY_ITEMS[4].image}
                alt={GALLERY_ITEMS[4].title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105 will-change-transform pointer-events-none"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 z-10 md:bottom-6 md:left-6 pointer-events-none">
                <h3 className="text-xl font-semibold text-white md:text-2xl">
                  {GALLERY_ITEMS[4].title}
                </h3>
              </div>
            </Link>
          </div>

          {/* Boxing - Right side tall card */}
          <Link
            href={GALLERY_ITEMS[2].href}
            className="gallery-item group relative block h-[280px] overflow-hidden rounded-[2px] bg-gray-100 md:h-full cursor-pointer"
          >
            <Image
              src={GALLERY_ITEMS[2].image}
              alt={GALLERY_ITEMS[2].title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105 will-change-transform pointer-events-none"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-4 left-4 z-10 md:bottom-6 md:left-6 pointer-events-none">
              <h3 className="text-xl font-semibold text-white md:text-2xl">
                {GALLERY_ITEMS[2].title}
              </h3>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
