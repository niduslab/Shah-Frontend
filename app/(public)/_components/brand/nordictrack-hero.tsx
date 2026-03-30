"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";

interface BrandHeroData {
  id: string;
  brandName: string;
  enabled: boolean;
  backgroundImage: string;
  title: string;
  highlightedText: string;
  description: string;
  buttonText: string;
  buttonUrl: string;
}

const DEFAULT_DATA: BrandHeroData = {
  id: "nordictrack",
  brandName: "NordicTrack",
  enabled: true,
  backgroundImage: "/images/brand-page/brand-page-hero-img.png",
  title: "Turn Your Home\nInto A Complete",
  highlightedText: "Fitness Space",
  description: "NordicTrack is a leader in home fitness equipment, known for innovative treadmills, ellipticals, and exercise bikes with iFIT technology integration.",
  buttonText: "Shop Nordictrack",
  buttonUrl: "/shop",
};

export function NordicTrackHero() {
  const [data, setData] = useState<BrandHeroData>(DEFAULT_DATA);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/brand-pages");
        if (response.ok) {
          const result = await response.json();
          if (result.brands && result.brands.length > 0) {
            // Find NordicTrack brand or use first enabled brand
            const nordictrack = result.brands.find((b: BrandHeroData) => 
              b.id === "nordictrack" || b.brandName.toLowerCase().includes("nordictrack")
            );
            if (nordictrack && nordictrack.enabled) {
              setData(nordictrack);
            } else {
              const firstEnabled = result.brands.find((b: BrandHeroData) => b.enabled);
              if (firstEnabled) {
                setData(firstEnabled);
              }
            }
          }
        }
      } catch (error) {
        console.error("Error fetching brand data:", error);
      }
    };

    fetchData();
  }, []);

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
    <div className="relative h-[600px] w-full overflow-hidden bg-black md:h-[700px] lg:h-[800px]">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={data.backgroundImage}
          alt={data.brandName}
          fill
          className="object-cover object-center"
          priority
        />
      </div>

      {/* Gradient Overlay */}
      <div
        className="absolute inset-0 z-10"
        style={{
          background:
            "linear-gradient(89.44deg, rgba(0, 0, 0, 0.82) 21.48%, rgba(102, 102, 102, 0) 67.89%)",
        }}
      />

      {/* Content */}
      <div className="relative z-20 flex h-full items-center mx-auto px-4 md:px-0 max-w-[1400px]">
        <div className="max-w-xl md:max-w-2xl">
          <h1 className="mb-6 text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl lg:text-[64px]">
            {renderTitle(data.title)} <br />
            <span className="italic text-[#FFC107]">{data.highlightedText}</span>
          </h1>
          <p className="mb-8 max-w-lg text-sm text-gray-300 sm:text-base md:text-lg">
            {data.description}
          </p>
          <Link
            href={data.buttonUrl}
            className="group inline-flex h-12 items-center gap-2 rounded-md bg-[#FFC107] px-8 text-base font-semibold text-black transition-transform hover:scale-105 hover:bg-[#FFC107]/90"
          >
            {data.buttonText}
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>

      {/* Slider Indicators */}
      <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 gap-4">
        <div className="h-1.5 w-12 rounded-full bg-white/40"></div>
        <div className="h-1.5 w-12 rounded-full bg-[#FFC107]"></div>
        <div className="h-1.5 w-12 rounded-full bg-white/40"></div>
      </div>
    </div>
  );
}
