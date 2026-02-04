"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";

const FRAMES = [
  { id: 1, image: "/images/landing/performance-frame/image-1.jpg", alt: "Strength Training" },
  { id: 2, image: "/images/landing/performance-frame/image-2.jpg", alt: "Boxing" },
  { id: 3, image: "/images/landing/performance-frame/image-3.jpg", alt: "Cycling" },
  { id: 4, image: "/images/landing/performance-frame/image-4.jpg", alt: "Cardio" },
  { id: 5, image: "/images/landing/performance-frame/image-5.png", alt: "Tennis" },
];

export function PerformanceFrameSection() {
  const [activeIndex, setActiveIndex] = useState(2); // Start with the 3rd image (index 2) centered

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? FRAMES.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === FRAMES.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="w-full bg-white py-20 overflow-hidden">
      <div className="mx-auto w-full max-w-[1400px] px-6">
        <h2 className="mb-12 text-center text-2xl font-bold text-black sm:text-3xl md:text-4xl">
          Performance in Every Frame
        </h2>

        {/* Carousel Container */}
        <div className="relative flex flex-col items-center">
          <div className="flex w-full items-center justify-center gap-4 sm:gap-6 md:gap-8">
            {FRAMES.map((frame, index) => {
              const isActive = index === activeIndex;
              const isPrev = index === (activeIndex === 0 ? FRAMES.length - 1 : activeIndex - 1);
              const isNext = index === (activeIndex === FRAMES.length - 1 ? 0 : activeIndex + 1);
              
              let scale = "scale-90 opacity-70";
              let zIndex = "z-0";
              let height = "h-[200px] sm:h-[250px] md:h-[300px]";
              
              if (isActive) {
                scale = "scale-110 opacity-100 shadow-xl";
                zIndex = "z-10";
                height = "h-[250px] sm:h-[320px] md:h-[400px]";
              }

              let visibilityClasses = "hidden sm:block";
              if (isActive) {
                visibilityClasses = "block";
              }

              return (
                <div
                  key={frame.id}
                  className={`relative ${visibilityClasses} transition-all duration-500 ease-in-out ${scale} ${zIndex} ${height} w-full max-w-[280px] flex-shrink-0 cursor-pointer overflow-hidden rounded-lg`}
                  onClick={() => setActiveIndex(index)}
                >
                  <Image
                    src={frame.image}
                    alt={frame.alt}
                    fill
                    className="object-cover"
                  />
                </div>
              );
            })}
          </div>

          {/* Navigation Buttons */}
          <div className="mt-12 flex gap-4">
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
