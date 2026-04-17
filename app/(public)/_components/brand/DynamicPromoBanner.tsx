"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface PromoBannerData {
  enabled: boolean;
  badge: string;
  title: string;
  highlightedText: string;
  subtitle: string;
  description: string;
  buttonText: string;
  buttonUrl: string;
  backgroundColor: string;
  textColor: string;
}

interface DynamicPromoBannerProps {
  data: PromoBannerData;
}

export function DynamicPromoBanner({ data }: DynamicPromoBannerProps) {
  if (!data.enabled) return null;

  return (
    <section className="relative w-full py-24 md:py-32">
      {/* Background with fallback color */}
      <div className="absolute inset-0 z-0">
        {/* Fallback background color */}
        <div 
          className="absolute inset-0 -z-10" 
          style={{ backgroundColor: data.backgroundColor }}
        />
        {/* Optional overlay for better text readability */}
        <div className="absolute inset-0 bg-black/10" />
      </div>

      <div className="container relative z-10 mx-auto px-4 text-center sm:px-6 lg:px-8">
        {/* Badge */}
        {data.badge && (
          <span 
            className="mb-4 block text-sm font-medium uppercase tracking-wider sm:text-base"
            style={{ color: data.textColor, opacity: 0.8 }}
          >
            {data.badge}
          </span>
        )}

        {/* Title with Highlighted Text */}
        <h2 
          className="mb-2 text-4xl font-bold sm:text-5xl md:text-6xl"
          style={{ color: data.textColor }}
        >
          {data.title}{" "}
          <span className="italic text-[#FFC107]">{data.highlightedText}</span>
        </h2>

        {/* Subtitle */}
        {data.subtitle && (
          <h2 
            className="mb-6 text-4xl font-bold sm:text-5xl md:text-6xl"
            style={{ color: data.textColor }}
          >
            {data.subtitle}
          </h2>
        )}

        {/* Description */}
        {data.description && (
          <p 
            className="mx-auto mb-10 max-w-2xl text-base sm:text-lg"
            style={{ color: data.textColor, opacity: 0.9 }}
          >
            {data.description}
          </p>
        )}

        {/* CTA Button */}
        <Link
          href={data.buttonUrl}
          className="inline-flex h-12 items-center gap-2 rounded-md bg-[#FFC107] px-8 text-base font-semibold text-black transition-transform hover:scale-105 hover:bg-[#FFC107]/90"
        >
          {data.buttonText}
          <ArrowRight className="h-5 w-5" />
        </Link>
      </div>
    </section>
  );
}
