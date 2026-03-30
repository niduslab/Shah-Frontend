"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

interface BehindTheWorkData {
  enabled: boolean;
  title: string;
  description: string;
  stats: {
    value: string;
    label: string;
  }[];
  images: {
    left: string;
    center: string;
    right: string;
  };
}

const DEFAULT_DATA: BehindTheWorkData = {
  enabled: true,
  title: "Thinking Behind the Work",
  description: "NordicTrack delivers a premium personal training experience at home through expertly crafted fitness equipment and the innovative iFIT platform. With a strong legacy in cardio, NordicTrack designs industry-leading treadmills, bikes, ellipticals, and rowers that combine comfort, performance, and advanced technology. iFIT programs, led by top trainers, offer immersive workouts from iconic global locations while adapting to all fitness levels. By continuously innovating across strength, endurance, and cross-training, NordicTrack provides a complete, interactive home fitness solution—because you deserve the best.",
  stats: [
    { value: "51 +", label: "Years of Experiences" },
    { value: "1M +", label: "Happy Customers" },
    { value: "50 +", label: "Available In Countries" },
  ],
  images: {
    left: "/images/brand-page/behind-the-work/35e52de170a36a04228f64d8d6f6c57f62e3c36a.png",
    center: "/images/brand-page/behind-the-work/6da4e59475159602882c3fabee07c1388d618dbb.png",
    right: "/images/brand-page/behind-the-work/9cb5aaa1137d1d2b316f4e79e0c6cd4907ac3731 (1).png",
  },
};

export function NordicTrackBehindTheWork() {
  const [data, setData] = useState<BehindTheWorkData>(DEFAULT_DATA);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/brand-pages");
        if (response.ok) {
          const result = await response.json();
          if (result.brands && result.brands.length > 0) {
            const nordictrack = result.brands.find((b: any) => 
              b.id === "nordictrack" || b.brandName.toLowerCase().includes("nordictrack")
            );
            if (nordictrack?.behindTheWork) {
              setData(nordictrack.behindTheWork);
            } else {
              const firstBrand = result.brands.find((b: any) => b.behindTheWork);
              if (firstBrand?.behindTheWork) {
                setData(firstBrand.behindTheWork);
              }
            }
          }
        }
      } catch (error) {
        console.error("Error fetching behind the work data:", error);
      }
    };

    fetchData();
  }, []);

  if (!data.enabled) {
    return null;
  }

  return (
    <section className="w-full bg-white py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-0 max-w-[1400px]">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-center lg:gap-16">
          {/* Content Side */}
          <div className="flex-1">
            <h2 className="mb-6 text-3xl font-bold tracking-tight text-black sm:text-4xl lg:text-5xl">
              {data.title}
            </h2>
            <p className="mb-12 text-base leading-relaxed text-gray-600 sm:text-lg">
              {data.description}
            </p>

            {/* Stats */}
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
              {data.stats.map((stat, index) => (
                <div key={index}>
                  <div className="mb-2 text-3xl font-bold italic text-black sm:text-4xl">
                    {stat.value}
                  </div>
                  <div className="text-sm font-medium text-gray-600 sm:text-base">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Images Side */}
          <div className="relative flex min-h-[400px] flex-1 items-center justify-center md:min-h-[500px]">
            {/* Left Image (Rower) - Behind */}
            <div className="absolute left-1/2 top-1/2 h-[300px] w-[200px] max-w-[268px] -translate-x-[85%] -translate-y-1/2 overflow-hidden rounded-[2px] bg-blue-50 shadow-lg md:h-[400px] md:w-[268px]">
              <Image
                src={data.images.left}
                alt="Left"
                fill
                className="object-cover object-center"
              />
            </div>

            {/* Right Image (Treadmill) - Behind */}
            <div className="absolute left-1/2 top-1/2 h-[300px] w-[200px] max-w-[268px] -translate-x-[15%] -translate-y-1/2 overflow-hidden rounded-[2px] bg-gray-50 shadow-lg md:h-[400px] md:w-[268px]">
              <Image
                src={data.images.right}
                alt="Right"
                fill
                className="object-cover object-center"
              />
            </div>

            {/* Center Image (Bike) - Front & Tallest */}
            <div className="absolute left-1/2 top-1/2 z-10 h-[360px] w-[220px] max-w-[268px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[2px] bg-[#E5DCC5] shadow-2xl md:h-[480px] md:w-[268px]">
              <Image
                src={data.images.center}
                alt="Center"
                fill
                className="object-cover object-center"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
