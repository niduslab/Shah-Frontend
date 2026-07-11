"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface FeatureSectionData {
  enabled: boolean;
  layout: "image-left" | "image-right";
  image: string;
  title: string;
  description: string;
  buttonText: string;
  buttonUrl: string;
  backgroundColor: string;
}

interface DynamicFeatureSectionProps {
  data: FeatureSectionData;
}

export function DynamicFeatureSection({ data }: DynamicFeatureSectionProps) {
  if (!data.enabled) return null;

  const isImageLeft = data.layout === "image-left";

  return (
    <div 
      className="container py-16"
      // style={{ backgroundColor: data.backgroundColor }}
    >
      <div
        className={`flex gap-12 lg:items-center lg:gap-16 mx-auto px-4 md:px-0 max-w-[1400px] ${
          isImageLeft 
            ? "flex-col lg:flex-row" 
            : "flex-col-reverse lg:flex-row"
        }`}
      >
        {/* Content - Order changes based on layout */}
        <div className={`flex-1 ${isImageLeft ? "lg:order-2" : "lg:order-1"}`}>
          <h2 className="mb-6 text-3xl font-bold leading-tight text-black sm:text-4xl lg:text-5xl">
            {data.title}
          </h2>
          <p className="mb-8 text-base leading-relaxed text-gray-600 sm:text-lg">
            {data.description}
          </p>
          <Link
            href={data.buttonUrl}
            className="inline-flex h-12 items-center gap-2 rounded-md bg-[#FFC107] px-8 text-base font-semibold text-black transition-colors hover:bg-[#FFC107]/90"
          >
            {data.buttonText}
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>

        {/* Image - Order changes based on layout */}
        <div className={`flex-1 ${isImageLeft ? "lg:order-1" : "lg:order-2"}`}>
          <div className="relative aspect-square w-full overflow-hidden rounded-sm bg-[#A4C8F0]/30 md:aspect-[4/3]">
            {data.image ? (
              <img
                src={data.image}
                alt={data.title}
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-gray-200">
                <p className="text-gray-400">No image uploaded</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
