"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import { cn } from "@/lib/utils";
import { useCategories } from "@/lib/hooks/public/useCategories";

interface CategoryItem {
  id: number;
  name: string;
  slug: string;
  children: CategoryItem[];
  is_active: boolean;
  parent_id: number | null;
  sort_order: number;
}

interface ProcessedCategory {
  id: number;
  name: string;
  slug: string;
  subcategories: {
    id: number;
    name: string;
    slug: string;
    children: { id: number; name: string; slug: string }[];
  }[];
}

export function CategoriesMegaMenu({
  className,
  onLinkClick,
}: {
  className?: string;
  onLinkClick?: () => void;
}) {
  const { data: categoriesData, isLoading } = useCategories();
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);

  const topLevelCategories = useMemo<ProcessedCategory[]>(() => {
    if (!categoriesData?.data) return [];

    return (categoriesData.data as CategoryItem[])
      .filter((cat) => cat.is_active && cat.parent_id === null)
      .map((cat) => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        subcategories: (cat.children || [])
          .filter((child) => child.is_active)
          .map((child) => ({
            id: child.id,
            name: child.name,
            slug: child.slug,
            children: (child.children || [])
              .filter((gc) => gc.is_active)
              .map((gc) => ({ id: gc.id, name: gc.name, slug: gc.slug })),
          })),
      }));
  }, [categoriesData]);

  useEffect(() => {
    if (topLevelCategories.length > 0 && activeCategoryId === null) {
      setActiveCategoryId(topLevelCategories[0].id);
    }
  }, [topLevelCategories, activeCategoryId]);

  const activeCategory = topLevelCategories.find((c) => c.id === activeCategoryId);

  if (isLoading) {
    return (
      <div
        className={cn(
          "absolute left-0 top-full z-50 mt-0 w-full border-t border-gray-100 bg-white shadow-xl before:absolute before:-top-10 before:left-0 before:h-10 before:w-full before:bg-transparent",
          className
        )}
      >
        <div className="mx-auto flex max-w-[1400px] p-8">
          <div className="flex gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-4 w-20 animate-pulse rounded bg-gray-200" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (topLevelCategories.length === 0) return null;

  // Determine column layout based on number of subcategories
  const subcategories = activeCategory?.subcategories ?? [];
  const colCount = Math.min(subcategories.length, 4);
  const gridCols =
    colCount <= 2
      ? "grid-cols-2"
      : colCount === 3
      ? "grid-cols-3"
      : "grid-cols-4";

  return (
    <div
      className={cn(
        "absolute left-0 top-full z-50 mt-0 w-full border-t border-gray-100 bg-white shadow-xl before:absolute before:-top-10 before:left-0 before:h-10 before:w-full before:bg-transparent",
        className
      )}
    >
      <div className="mx-auto flex max-w-[1400px]">
        {/* Left Sidebar — top-level categories */}
        <div className="w-56 shrink-0 border-r border-gray-100 py-4">
          <ul className="flex flex-col">
            {topLevelCategories.map((cat) => (
              <li key={cat.id}>
                <button
                  onMouseEnter={() => setActiveCategoryId(cat.id)}
                  className={cn(
                    "flex w-full items-center justify-between px-5 py-3 text-left text-sm font-medium transition-colors",
                    activeCategoryId === cat.id
                      ? "bg-gray-50 font-bold text-[#00072D]"
                      : "text-gray-600 hover:bg-gray-50 hover:font-bold hover:text-[#00072D]"
                  )}
                >
                  {cat.name}
                  {activeCategoryId === cat.id && (
                    <ChevronRight className="h-4 w-4 text-[#ffb81e]" />
                  )}
                </button>
              </li>
            ))}
          </ul>

          {/* View all link for active category */}
          {activeCategory && (
            <div className="mt-2 border-t border-gray-100 px-5 pt-3">
              <Link
                href={`/shop?category=${activeCategory.slug}`}
                className="text-xs font-bold text-[#ffb81e] transition-colors hover:text-[#e5a61b]"
                onClick={onLinkClick}
              >
                View All {activeCategory.name} →
              </Link>
            </div>
          )}
        </div>

        {/* Right Content — subcategories grid */}
        <div className="flex-1 px-8 py-6">
          {activeCategory && subcategories.length > 0 ? (
            <>
              <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-gray-400">
                {activeCategory.name}
              </h3>
              <div className={cn("grid gap-6", gridCols)}>
                {subcategories.map((sub) => (
                  <div key={sub.id}>
                    {/* Sub-category heading — clickable */}
                    <Link
                      href={`/shop?category=${sub.slug}`}
                      className="mb-3 block text-sm font-bold uppercase tracking-wide text-[#00072D] transition-colors hover:text-[#ffb81e]"
                      onClick={onLinkClick}
                    >
                      {sub.name}
                    </Link>

                    {/* Level-3 children */}
                    {sub.children.length > 0 && (
                      <ul className="flex flex-col gap-2">
                        {sub.children.map((child) => (
                          <li key={child.id}>
                            <Link
                              href={`/shop?category=${child.slug}`}
                              className="group flex items-center gap-1 text-sm text-gray-500 transition-all hover:font-semibold hover:text-[#00072D]"
                              onClick={onLinkClick}
                            >
                              <ChevronRight className="h-3 w-3 shrink-0 opacity-0 transition-opacity group-hover:opacity-100 text-[#ffb81e]" />
                              {child.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </>
          ) : (
            activeCategory && (
              <div className="flex h-full items-center justify-center">
                <Link
                  href={`/shop?category=${activeCategory.slug}`}
                  className="text-sm font-bold text-[#ffb81e] hover:text-[#e5a61b]"
                  onClick={onLinkClick}
                >
                  Browse all {activeCategory.name} products →
                </Link>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
