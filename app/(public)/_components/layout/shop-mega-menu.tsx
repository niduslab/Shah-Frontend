"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useMemo } from "react";
import { cn } from "@/lib/utils";
import { useCategories } from "@/lib/hooks/public/useCategories";

export function ShopMegaMenu({ className, onLinkClick }: { className?: string; onLinkClick?: () => void }) {
  const { data: categoriesData, isLoading } = useCategories();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Process categories data
  const categories = useMemo(() => {
    if (!categoriesData?.data) return [];

    const fitnessCategory = categoriesData.data.find(
      (cat: any) => cat.is_active && !cat.parent_id && cat.slug === 'fitness'
    );

    if (!fitnessCategory) return [];

    const level2Children = (fitnessCategory.children || []).filter((child: any) => child.is_active);

    // Find the specific categories we want to display (Cardio, Strength, Free Weight)
    const targetCategories = ['fitness-cardio', 'strength', 'free-weight'];
    
    const formattedCategories = level2Children
      .filter((level2: any) => targetCategories.includes(level2.slug))
      .map((level2: any) => {
        const level3Children = (level2.children || []).filter((child: any) => child.is_active);
        
        return {
          id: level2.slug,
          categoryId: level2.id,
          label: level2.name,
          slug: level2.slug,
          items: level3Children.map((level3: any) => ({
            name: level3.name,
            slug: level3.slug,
            categoryId: level3.id,
            href: `/shop?category_id=${level3.id}`,
          })),
        };
      });

    return formattedCategories;
  }, [categoriesData]);

  // Set initial active category
  useEffect(() => {
    if (categories.length > 0 && !activeCategory) {
      setActiveCategory(categories[0].id);
    }
  }, [categories, activeCategory]);

  const currentCategory = categories.find((c: any) => c.id === activeCategory);

  if (isLoading || categories.length === 0) {
    return (
      <div className={cn("absolute left-0 top-full z-50 mt-0 w-full border-t border-gray-100 bg-white shadow-xl before:absolute before:-top-10 before:left-0 before:h-10 before:w-full before:bg-transparent", className)}>
        <div className="mx-auto flex max-w-[1400px] p-8">
          <div className="text-gray-500">Loading categories...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("absolute left-0 top-full z-50 mt-0 w-full border-t border-gray-100 bg-white shadow-xl before:absolute before:-top-10 before:left-0 before:h-10 before:w-full before:bg-transparent", className)}>
      <div className="mx-auto flex max-w-[1400px]">
        {/* Sidebar */}
        <div className="w-64 border-r border-gray-100 py-6">
          <ul className="flex flex-col">
            {categories.map((category: any) => (
              <li key={category.id}>
                <button
                  onMouseEnter={() => setActiveCategory(category.id)}
                  className={cn(
                    "flex w-full items-center justify-between px-6 py-3 text-left text-sm font-medium transition-colors",
                    activeCategory === category.id
                      ? "bg-gray-50 text-black font-bold"
                      : "text-gray-600 hover:bg-gray-50 hover:text-black hover:font-bold"
                  )}
                >
                  {category.label}
                  {activeCategory === category.id && (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Content Area */}
        <div className="flex-1 px-8 py-6">
          <div className="grid grid-cols-12 gap-6">
            {/* Sub Categories List */}
            <div className="col-span-3 border-r border-gray-100 pr-6">
              <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-[#00072D]">
                {currentCategory?.label} Categories
              </h3>
              <ul className="flex flex-col gap-2.5">
                {currentCategory?.items && currentCategory.items.length > 0 ? (
                  currentCategory.items.map((item: any) => (
                    <li key={item.slug}>
                      <Link
                        href={item.href}
                        className="text-sm text-gray-600 transition-all hover:text-black hover:font-bold"
                        onClick={onLinkClick}
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))
                ) : (
                  <li>
                    <Link
                      href={`/shop?category_id=${currentCategory?.categoryId}`}
                      className="text-sm text-gray-600 transition-all hover:text-black hover:font-bold"
                      onClick={onLinkClick}
                    >
                      View All {currentCategory?.label}
                    </Link>
                  </li>
                )}
              </ul>
            </div>

            {/* Featured Images / Trending Products */}
            <div className="col-span-9 pl-2">
              <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-[#00072D]">
                Trending Products
              </h3>
              <div className="grid grid-cols-3 gap-5">
                {categories.map((category: any, index: number) => {
                  // Define images for each category
                  const images = [
                    '/images/landing/pre-order/63594412e77df42c02a5f16d3a2eceb8d4f91d99.png',
                    '/images/landing/pre-order/a1d135ac0387f5fbbc33cdd695d09e992dc2d274.png',
                    '/images/kino-map/navbar_kinomap.png',
                  ];
                  
                  // Manual override for third item - Kinomap
                  if (index === 2) {
                    return (
                      <Link 
                        key="kinomap"
                        href="/kino-map"
                        className="group relative cursor-pointer rounded-lg overflow-hidden transition-all hover:shadow-xl"
                        onClick={onLinkClick}
                      >
                        {/* Full Card Image */}
                        <div className="relative aspect-[4/3] overflow-hidden bg-gray-50">
                          <Image
                            src={images[2]}
                            alt="Kinomap Equipment"
                            fill
                            className="object-contain transition-transform duration-500 group-hover:scale-105"
                          />
                          {/* Overlay Gradient */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        </div>
                        
                        {/* Category Label */}
                        <div className="absolute bottom-0 left-0 right-0 p-4 text-center">
                          <span className="text-lg font-bold text-white group-hover:text-[#ffb81e] transition-colors drop-shadow-lg">
                            Kinomap
                          </span>
                        </div>
                      </Link>
                    );
                  }
                  
                  return (
                    <Link 
                      key={category.id}
                      href={`/shop?category_id=${category.categoryId}`}
                      className="group relative cursor-pointer rounded-lg overflow-hidden transition-all hover:shadow-xl"
                      onClick={onLinkClick}
                    >
                      {/* Full Card Image */}
                      <div className="relative aspect-[4/3] overflow-hidden bg-gray-50">
                        <Image
                          src={images[index]}
                          alt={`${category.label} Equipment`}
                          fill
                          className="object-contain transition-transform duration-500 group-hover:scale-105"
                        />
                        {/* Overlay Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      </div>
                      
                      {/* Category Label */}
                      <div className="absolute bottom-0 left-0 right-0 p-4 text-center">
                        <span className="text-lg font-bold text-white group-hover:text-[#ffb81e] transition-colors drop-shadow-lg">
                          {category.label}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
