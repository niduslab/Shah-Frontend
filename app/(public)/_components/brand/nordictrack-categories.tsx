"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

interface CategoryItem {
  id: string;
  name: string;
  image: string;
  href: string;
}

interface CategoriesData {
  enabled: boolean;
  sectionTitle: string;
  items: CategoryItem[];
}

const DEFAULT_DATA: CategoriesData = {
  enabled: true,
  sectionTitle: "Explore The Nordictrack Categories",
  items: [
    {
      id: "bikes",
      name: "Bikes",
      image: "/images/brand-page/categories/98003f070b9e4310ce977c412d825b39a66f4a49.png",
      href: "/brand/nordictrack/bikes",
    },
    {
      id: "treadmills",
      name: "Treadmills",
      image: "/images/brand-page/categories/9cb5aaa1137d1d2b316f4e79e0c6cd4907ac3731.png",
      href: "/brand/nordictrack/treadmills",
    },
    {
      id: "ellipticals",
      name: "Ellipticals",
      image: "/images/brand-page/categories/9f7648e870428e544492827c09fc28423f3272aa.png",
      href: "/brand/nordictrack/ellipticals",
    },
    {
      id: "rowers",
      name: "Rowers",
      image: "/images/brand-page/categories/dbd0d8305985321c2a2719424e34067f5902dcc3.png",
      href: "/brand/nordictrack/rowers",
    },
  ],
};

export function NordicTrackCategories() {
  const [data, setData] = useState<CategoriesData>(DEFAULT_DATA);

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
            if (nordictrack?.categories) {
              setData(nordictrack.categories);
            } else {
              const firstBrand = result.brands.find((b: any) => b.categories);
              if (firstBrand?.categories) {
                setData(firstBrand.categories);
              }
            }
          }
        }
      } catch (error) {
        console.error("Error fetching categories data:", error);
      }
    };

    fetchData();
  }, []);

  if (!data.enabled || data.items.length === 0) {
    return null;
  }

  return (
    <section
      className="w-full py-16 md:py-24"
      style={{
        background:
          "radial-gradient(72.28% 72.28% at 53.3% 84.54%, #EC9A24 0%, #1B150F 100%)",
      }}
    >
      <div className="container mx-auto px-4 md:px-0 max-w-[1400px]">
        <h2 className="mb-12 text-center text-3xl font-semibold text-white md:text-4xl lg:text-5xl">
          {data.sectionTitle}
        </h2>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {data.items.map((category) => (
            <Link
              key={category.id}
              href={category.href}
              className="group flex flex-col gap-4"
            >
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-sm bg-white/5 transition-transform duration-300 group-hover:-translate-y-2">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
              </div>
              <h3 className="text-xl font-medium text-white transition-colors group-hover:text-[#FFC107]">
                {category.name}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
