"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useScrollReveal } from "@/lib/hooks/useScrollReveal";

interface Category {
  id: string;
  name: string;
  image: string;
  href: string;
}

interface ExploreCategoriesData {
  enabled: boolean;
  sectionTitle: string;
  categories: Category[];
}

const DEFAULT_DATA: ExploreCategoriesData = {
  enabled: true,
  sectionTitle: "Explore Our Categories",
  categories: [
    {
      id: "fitness-cardio",
      name: "Cardio",
      image: "/images/landing/explore-categories/image-1.png",
      href: "/shop?category=fitness-cardio",
    },
    {
      id: "strength",
      name: "Strength",
      image: "/images/landing/explore-categories/image-3.png",
      href: "/shop?category=strength",
    },
    {
      id: "free-weight",
      name: "Free Weight",
      image: "/images/landing/explore-categories/image-4.png",
      href: "/shop?category=free-weight",
    },
    {
      id: "sports",
      name: "Sports",
      image: "/images/landing/explore-categories/image-2.png",
      href: "/shop?category=sports",
    },
  ],
};

export function ExploreCategories() {
  const sectionRef = useScrollReveal();
  const [data, setData] = useState<ExploreCategoriesData>(DEFAULT_DATA);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/hero-sections");
        if (response.ok) {
          const result = await response.json();
          if (result.exploreCategoriesSection) {
            setData(result.exploreCategoriesSection);
          }
        }
      } catch (error) {
        console.error("Error fetching explore categories data:", error);
      }
    };

    fetchData();
  }, []);

  if (!data.enabled) {
    return null;
  }

  return (
    <section ref={sectionRef as React.RefObject<HTMLElement>} className="w-full bg-white py-12">
      <div className="mx-auto w-full max-w-[1400px] px-4 md:px-6">
        <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <h2 data-reveal className="text-3xl font-bold tracking-tight text-black">
            {data.sectionTitle}
          </h2>
        </div>

        <div data-reveal-stagger className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {data.categories.map((category) => (
            <Link
              key={category.id}
              href={category.href}
              data-reveal
              className="category-card group relative block aspect-[4/5] overflow-hidden rounded-xs-lg bg-gray-100"
            >
              <Image
                src={category.image}
                alt={category.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90" />
              <div className="absolute bottom-6 left-6 text-white">
                <h3 className="mb-2 text-2xl font-medium">{category.name}</h3>
                <div className="flex items-center gap-2 text-[16px] font-semibold text-primary">
                  <span>Shop Now</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
