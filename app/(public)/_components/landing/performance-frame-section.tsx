"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { clsx } from "clsx";

const FRAMES = [
  { id: 1, image: "/images/landing/performance-frame/image-1.jpg", alt: "Strength Training" },
  { id: 2, image: "/images/landing/performance-frame/image-2.jpg", alt: "Boxing" },
  { id: 3, image: "/images/landing/performance-frame/image-3.jpg", alt: "Cycling" },
  { id: 4, image: "/images/landing/performance-frame/image-4.jpg", alt: "Cardio" },
  { id: 5, image: "/images/landing/performance-frame/image-5.png", alt: "Tennis" },
];

export function PerformanceFrameSection() {
  const [activeIndex, setActiveIndex] = useState(2);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? FRAMES.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === FRAMES.length - 1 ? 0 : prev + 1));
  };

  // Auto-play: advance to next slide every 1 second
  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 2000);

    return () => clearInterval(interval);
  }, [activeIndex]);

  useGSAP(() => {
    const total = FRAMES.length;
    
    // Fixed positions for each slot (0-4) - all visible
    const positions = [
      { x: -550, width: 240, height: 240, zIndex: 1, opacity: 0.6, scale: 0.9 },  // Far left
      { x: -290, width: 240, height: 240, zIndex: 5, opacity: 0.8, scale: 0.95 }, // Left
      { x: 0, width: 320, height: 420, zIndex: 10, opacity: 1, scale: 1 },        // Center (active)
      { x: 290, width: 240, height: 240, zIndex: 5, opacity: 0.8, scale: 0.95 },  // Right
      { x: 550, width: 240, height: 240, zIndex: 1, opacity: 0.6, scale: 0.9 },   // Far right
    ];

    FRAMES.forEach((_, i) => {
      const card = cardsRef.current[i];
      if (!card) return;

      // Calculate which visual slot this card should occupy
      let offset = (i - activeIndex);
      
      // Normalize offset for circular navigation
      if (offset > 2) offset -= total;
      if (offset < -2) offset += total;

      // Map offset to position index (0-4)
      // offset: -2, -1, 0, 1, 2 -> position: 0, 1, 2, 3, 4
      const positionIndex = offset + 2;
      const position = positions[positionIndex];

      if (position) {
        gsap.to(card, {
          xPercent: -50,
          left: "50%",
          x: position.x,
          width: position.width,
          height: position.height,
          zIndex: position.zIndex,
          opacity: position.opacity,
          scale: position.scale,
          duration: 0.7,
          ease: "power3.inOut",
        });
      }
    });
  }, { dependencies: [activeIndex], scope: containerRef });

  return (
    <section className="w-full bg-white py-20 overflow-hidden" ref={containerRef}>
      <div className="mx-auto w-full max-w-[1400px] px-4 md:px-6">
        <h2 className="mb-12 text-center text-2xl font-bold text-black sm:text-3xl md:text-4xl">
          Performance in Every Frame
        </h2>

        {/* Carousel Container - Fixed Height */}
        <div className="relative flex flex-col items-center h-[450px] w-full">
          {/* Items Container - Relative for absolute children */}
          <div className="relative w-full h-full max-w-[1200px] mx-auto perspective-1000">
            {FRAMES.map((frame, index) => {
              const isActive = index === activeIndex;

              return (
                <div
                  key={frame.id}
                  ref={(el) => { cardsRef.current[index] = el }}
                  className={clsx(
                    "absolute top-1/2 -translate-y-1/2 overflow-hidden rounded-lg bg-gray-100 cursor-pointer shadow-lg",
                    // Initial styles to prevent FOUC (will be overridden by GSAP immediately)
                    index === activeIndex ? "w-[320px] h-[420px] z-10 left-1/2 -translate-x-1/2" : "w-[240px] h-[240px] z-0 opacity-0"
                  )}
                  onClick={() => setActiveIndex(index)}
                >
                  <Image
                    src={frame.image}
                    alt={frame.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority={isActive}
                  />
                  
                  {/* Overlay for inactive states */}
                  <div className={clsx(
                    "absolute inset-0 bg-black/30 transition-opacity duration-500",
                    isActive ? "opacity-0" : "opacity-100 hover:opacity-50"
                  )} />
                </div>
              );
            })}
          </div>

          {/* Navigation Buttons */}
          <div className="absolute -bottom-12 flex gap-4 z-20">
            <button
              onClick={handlePrev}
              className="flex h-12 w-12 items-center justify-center rounded-xs bg-gray-100 text-black transition-colors hover:bg-[#FFC107] hover:text-black"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <button
              onClick={handleNext}
              className="flex h-12 w-12 items-center justify-center rounded-xs bg-[#FFC107] text-black transition-colors hover:bg-[#FFC107]/90"
            >
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
