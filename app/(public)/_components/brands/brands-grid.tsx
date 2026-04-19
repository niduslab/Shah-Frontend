"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useBrands } from "@/lib/hooks/public/useBrands";

interface Brand {
  id: number;
  name: string;
  slug: string;
  description: string;
  logo: string;
  is_active: boolean;
  sort_order: number;
  products_count: number;
}

type CategoryKey = "cardio" | "strength" | "free_weights";

// Map brand slugs to one or more categories.
// A brand can appear in multiple sections (e.g. FreeMotion = cardio + strength).
const BRAND_CATEGORY_MAP: Record<string, CategoryKey[]> = {
  // Cardio
  nordictrack: ["cardio"],
  proform: ["cardio"],
  sole: ["cardio"],
  spirit: ["cardio"],
  xterra: ["cardio"],
  shua: ["cardio", "strength"],
  rider: ["cardio"],
  stex: ["cardio"],
  freemotion: ["cardio", "strength"],

  // Strength
  "body-solid": ["strength"],
  steelflex: ["strength"],
  atlas: ["strength"],
  marcy: ["strength", "free_weights"],
  apc: ["strength"],
  boker: ["strength"],
  xpd: ["strength"],
  zxcn: ["strength"],
  "md-buddy": ["strength", "free_weights"],

  // Free weights & accessories
  adidas: ["free_weights"],
  reebok: ["free_weights"],
  ufc: ["free_weights"],
  wave: ["free_weights"],
  "729": ["free_weights"],
  irest: ["free_weights"],
};

interface CategorySection {
  key: CategoryKey;
  title: string;
  subtitle: string;
  accent: "blue" | "red" | "emerald";
}

const SECTIONS: CategorySection[] = [
  {
    key: "cardio",
    title: "Cardio Brands",
    subtitle: "Treadmills, exercise bikes, ellipticals & rowers",
    accent: "blue",
  },
  {
    key: "strength",
    title: "Strength Brands",
    subtitle: "Multi-gyms, racks, machines & strength stations",
    accent: "red",
  },
  {
    key: "free_weights",
    title: "Free Weight Brands",
    subtitle: "Dumbbells, barbells, plates, kettlebells & accessories",
    accent: "emerald",
  },
];

export function BrandsGrid() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { data, isLoading, error } = useBrands({
    enabled: isMounted,
  }) as any;

  const brands: Brand[] = data?.data || [];

  const getImageUrl = (logoPath: string) => {
    if (!logoPath) return "";
    if (logoPath.startsWith("http://") || logoPath.startsWith("https://")) {
      return logoPath;
    }
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    const cleanPath = logoPath.startsWith("/") ? logoPath.slice(1) : logoPath;
    return `${apiUrl}/storage/${cleanPath}`;
  };

  // Group brands into sections
  const sectionedBrands = useMemo(() => {
    const result: Record<CategoryKey, Brand[]> = {
      cardio: [],
      strength: [],
      free_weights: [],
    };
    brands.forEach((brand) => {
      const cats = BRAND_CATEGORY_MAP[brand.slug] || [];
      cats.forEach((cat) => {
        result[cat].push(brand);
      });
    });
    return result;
  }, [brands]);

  // Loading state
  if (!isMounted || isLoading) {
    return (
      <section className="bg-white py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Trusted Brands We Carry
            </h2>
            <p className="mt-2 text-gray-600">
              Premium brands across cardio, strength, and free weights
            </p>
          </div>
          {Array.from({ length: 3 }).map((_, sectionIdx) => (
            <div key={sectionIdx} className="mb-12">
              <div className="mb-6 h-8 w-48 animate-pulse rounded bg-gray-200" />
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex aspect-[3/2] w-full animate-pulse items-center justify-center rounded-lg bg-gray-100 p-6"
                  >
                    <div className="h-12 w-20 rounded bg-gray-200"></div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-white py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-2xl font-bold text-gray-900 sm:text-3xl">
            Trusted Brands We Carry
          </h2>
          <div className="py-12 text-center">
            <p className="text-gray-500">
              Unable to load brands. Please try again later.
            </p>
          </div>
        </div>
      </section>
    );
  }

  // Accent color mapping (static classes so Tailwind can see them)
  const accentClasses = {
    blue: {
      bar: "bg-blue-500",
      text: "text-blue-600",
      bg: "bg-blue-50",
    },
    red: {
      bar: "bg-red-500",
      text: "text-red-600",
      bg: "bg-red-50",
    },
    emerald: {
      bar: "bg-emerald-500",
      text: "text-emerald-600",
      bg: "bg-emerald-50",
    },
  };

  return (
    <section className="bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-20 text-center">
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Trusted Brands We Carry
          </h2>
          <p className="mt-2 text-gray-600">
            Premium brands across cardio, strength, and free weights
          </p>
        </div>

        {/* Render each category section stacked vertically */}
        {SECTIONS.map((section) => {
          const sectionBrands = sectionedBrands[section.key];
          if (!sectionBrands || sectionBrands.length === 0) return null;

          const a = accentClasses[section.accent];

          return (
            <div key={section.key} className="mb-14 last:mb-0">
              {/* Section header */}
              <div className="mb-6 flex items-center gap-4">
                {/* <div className={``} /> */}
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-xl font-bold text-gray-900 sm:text-2xl">
                      {section.title}
                    </h3>
                    {/* <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${a.bg} ${a.text}`}
                    >
                      {sectionBrands.length}{" "}
                      {sectionBrands.length === 1 ? "brand" : "brands"}
                    </span> */}
                  </div>
                  {/* <p className="mt-1 text-sm text-gray-600">
                    {section.subtitle}
                  </p> */}
                </div>
              </div>

              {/* Brand grid for this section */}
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                {sectionBrands.map((brand) => (
                  <Link
                    key={`${section.key}-${brand.id}`}
                    href={`/brand/${brand.slug}`}
                    className="group relative flex aspect-[3/2] w-full cursor-pointer items-center justify-center rounded-lg bg-gray-50 p-6 transition-all hover:bg-gray-100 hover:shadow-lg hover:ring-2 hover:ring-orange-500/50"
                    title={`View ${brand.name} products`}
                  >
                    <div className="relative h-full w-full">
                      <Image
                        src={getImageUrl(brand.logo)}
                        alt={`${brand.name} logo`}
                        fill
                        className="object-contain transition-all duration-300 group-hover:scale-110"
                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16vw"
                        unoptimized={getImageUrl(brand.logo).includes(
                          "localhost"
                        )}
                      />
                    </div>

                    {/* Hover overlay */}
                    <div className="absolute inset-0 flex flex-col justify-end rounded-lg bg-gradient-to-t from-black/90 via-black/50 to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <p className="truncate text-sm font-semibold text-white">
                        {brand.name}
                      </p>
                      {brand.products_count > 0 && (
                        <p className="text-xs font-medium text-orange-400">
                          {brand.products_count} products
                        </p>
                      )}
                      <p className="mt-1 text-xs text-white/80">
                        Click to explore →
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}