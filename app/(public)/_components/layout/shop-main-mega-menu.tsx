"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useMemo } from "react";
import { cn } from "@/lib/utils";
import { useCategories } from "@/lib/hooks/public/useCategories";
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

export function ShopMainMegaMenu({ className, onLinkClick }: { className?: string; onLinkClick?: () => void }) {
  const { data: categoriesData, isLoading } = useCategories();
  const { data: brandsData, isLoading: brandsLoading } = useBrands();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const brands = brandsData?.data || [];

  // Helper function to get full image URL
  const getImageUrl = (logoPath: string) => {
    if (!logoPath) return '';
    // If already a full URL, return as is
    if (logoPath.startsWith('http://') || logoPath.startsWith('https://')) {
      return logoPath;
    }
    // Otherwise, prepend the API URL
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    // Remove leading slash if present to avoid double slashes
    const cleanPath = logoPath.startsWith('/') ? logoPath.slice(1) : logoPath;
    return `${apiUrl}/storage/${cleanPath}`;
  };

  // Process categories data
  const categories = useMemo(() => {
    if (!categoriesData?.data) return [];

    const processedCategories = categoriesData.data
      .filter((cat: any) => cat.is_active && !cat.parent_id)
      .map((cat: any) => {
        const level2Children = (cat.children || []).filter((child: any) => child.is_active);

        // For Fitness category, we want to show specific level 2 categories (Cardio, Strength, Free Weight)
        // and skip Home/Commercial intermediate levels
        let groupedCategories;
        
        if (cat.slug === 'fitness') {
          // Find the specific categories we want to display
          const targetCategories = ['fitness-cardio', 'strength', 'free-weight'];
          
          groupedCategories = level2Children
            .filter((level2: any) => targetCategories.includes(level2.slug))
            .map((level2: any) => {
              const level3Children = (level2.children || []).filter((child: any) => child.is_active);
              
              return {
                name: level2.name,
                slug: level2.slug,
                categoryId: level2.id,
                items: level3Children.length > 0 
                  ? level3Children.map((level3: any) => ({
                      name: level3.name,
                      slug: level3.slug,
                      categoryId: level3.id,
                    }))
                  : [],
              };
            });
        } else {
          // For other categories (like Sports), use level 2 children directly
          groupedCategories = level2Children.map((level2: any) => {
            const level3Children = (level2.children || []).filter((child: any) => child.is_active);
            
            return {
              name: level2.name,
              slug: level2.slug,
              categoryId: level2.id,
              items: level3Children.length > 0 
                ? level3Children.map((level3: any) => ({
                    name: level3.name,
                    slug: level3.slug,
                    categoryId: level3.id,
                  }))
                : [],
            };
          });
        }

        return {
          id: cat.slug,
          label: cat.name,
          slug: cat.slug,
          categoryId: cat.id,
          groupedCategories,
        };
      });

    return [
      ...processedCategories,
      {
        id: "brands",
        label: "Brands",
        slug: "brands",
        categoryId: null,
        groupedCategories: [],
      },
    ];
  }, [categoriesData]);

  // Set initial active category
  useEffect(() => {
    if (categories.length > 0 && !activeCategory) {
      setActiveCategory(categories[0].id);
    }
  }, [categories, activeCategory]);

  const currentCategory = categories.find((c) => c.id === activeCategory);

  // Render content based on category
  const renderContent = () => {
    if (!currentCategory) return null;

    // Brands category
    if (currentCategory.id === "brands") {
      return (
        <div>
          <h3 className="mb-6 text-base font-bold uppercase tracking-wider text-[#00072D]">Our Brands</h3>
          {brandsLoading ? (
            <div className="grid grid-cols-6 gap-6">
              {Array.from({ length: 24 }).map((_, index) => (
                <div key={index} className="flex items-center justify-center rounded-lg border border-gray-100 p-4 animate-pulse">
                  <div className="h-12 w-24 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : brands.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 text-sm">No brands available at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-6 gap-6">
              {brands.map((brand: Brand) => (
                <Link 
                  key={brand.id} 
                  href={`/brand/${brand.slug}`}
                  className="group flex items-center justify-center rounded-lg border border-gray-100 p-4 transition-all hover:shadow-md hover:border-[#ffb81e]"
                  title={`View ${brand.name} products`}
                  onClick={onLinkClick}
                >
                  <div className="relative h-12 w-24">
                    <Image
                      src={getImageUrl(brand.logo)}
                      alt={`${brand.name} logo`}
                      fill
                      className="object-contain transition-transform duration-300 group-hover:scale-110"
                      unoptimized={getImageUrl(brand.logo).includes('localhost')}
                    />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      );
    }

    // Fitness category - 3 column layout with promo
    if (currentCategory.slug === "fitness") {
      const columnsToShow = currentCategory.groupedCategories.slice(0, 3);
      
      return (
        <div className="grid grid-cols-4 gap-8">
          <div className="col-span-3 grid grid-cols-3 gap-8">
            {columnsToShow.map((group: any) => (
              <div key={group.slug}>
                <h3 className="mb-4 text-base font-bold uppercase tracking-wider text-[#00072D]">{group.name}</h3>
                <ul className="flex flex-col gap-2.5">
                  {group.items.length > 0 ? (
                    group.items.map((item: any) => (
                      <li key={item.slug}>
                        <Link 
                          href={`/shop?category_id=${item.categoryId}`} 
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
                        href={`/shop?category_id=${group.categoryId}`} 
                        className="text-sm text-gray-600 transition-all hover:text-black hover:font-bold"
                        onClick={onLinkClick}
                      >
                        View All
                      </Link>
                    </li>
                  )}
                </ul>
              </div>
            ))}
          </div>
          {/* Promotional Image */}
          <div className="relative h-full min-h-[320px] overflow-hidden rounded-xl bg-gray-50 group">
            <Image
              src="/images/landing/pre-order/606b82b85373e30dc10d2f79a0253f7d20502b39.png"
              alt="Fitness Promo"
              fill
              className="object-contain p-6 pb-24 transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#00072D] via-[#00072D]/40 to-transparent" />
            <div className="absolute bottom-0 left-0 w-full p-6 text-white">
              <span className="mb-3 inline-block rounded-full bg-[#ffb81e] px-3 py-1 text-xs font-bold text-[#00072D]">
                NEW ARRIVAL
              </span>
              <h4 className="mb-2 text-2xl font-bold leading-tight">Pro Runner 5000</h4>
              <Link 
                href={`/shop?category_id=${currentCategory.categoryId}`} 
                className="inline-flex items-center text-sm font-bold text-white transition-colors hover:text-[#ffb81e]"
                onClick={onLinkClick}
              >
                Shop Now <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      );
    }

    // Sports category - 2 column layout with 2 promo images
    if (currentCategory.slug === "sports") {
      const allItems = currentCategory.groupedCategories.flatMap((group: any) => 
        group.items.length > 0 ? group.items : [{ name: group.name, slug: group.slug, categoryId: group.categoryId }]
      );
      
      const leftColumn = allItems.slice(0, Math.ceil(allItems.length / 2));
      const rightColumn = allItems.slice(Math.ceil(allItems.length / 2));

      // Find boxing category for promo link
      const boxingCategory = currentCategory.groupedCategories.find((g: any) => g.slug === 'boxing');

      return (
        <div className="grid grid-cols-4 gap-8">
          <div className="col-span-2 grid grid-cols-2 gap-8">
            {/* Left Column */}
            <div>
              <ul className="flex flex-col gap-4">
                {leftColumn.map((item: any) => (
                  <li key={item.slug}>
                    <Link 
                      href={`/shop?category_id=${item.categoryId}`} 
                      className="text-base font-bold text-[#00072D] transition-all hover:text-[#ffb81e]"
                      onClick={onLinkClick}
                    >
                      {item.name.toUpperCase()}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            {/* Right Column */}
            <div>
              <ul className="flex flex-col gap-4">
                {rightColumn.map((item: any) => (
                  <li key={item.slug}>
                    <Link 
                      href={`/shop?category_id=${item.categoryId}`} 
                      className="text-base font-bold text-[#00072D] transition-all hover:text-[#ffb81e]"
                      onClick={onLinkClick}
                    >
                      {item.name.toUpperCase()}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* Promotional Images - 2 Columns */}
          <div className="col-span-2 grid grid-cols-2 gap-4">
            {/* Promo 1 */}
            <div className="relative h-full min-h-[300px] overflow-hidden rounded-xl bg-gray-100 group">
              <Image
                src="/images/landing/rdx-gallery/9006e7dd80ecf645e78b83702112aee120de3a11.png"
                alt="Boxing Gear"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 text-white">
                <h4 className="mb-1 text-lg font-bold">Pro Boxing Gear</h4>
                <Link 
                  href={boxingCategory ? `/shop?category_id=${boxingCategory.categoryId}` : `/shop?category_id=${currentCategory.categoryId}`}
                  className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-[#ffb81e] hover:text-white"
                  onClick={onLinkClick}
                >
                  Shop Collection <ChevronRight className="ml-1 h-3 w-3" />
                </Link>
              </div>
            </div>

            {/* Promo 2 */}
            <div className="relative h-full min-h-[300px] overflow-hidden rounded-xl bg-gray-100 group">
              <Image
                src="/images/landing/rdx-gallery/12297c9eef97e322f7c7a0fa9318ed7d1d10ec28.png"
                alt="Team Sports"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 text-white">
                <h4 className="mb-1 text-lg font-bold">Team Apparel</h4>
                <Link 
                  href={`/shop?category_id=${currentCategory.categoryId}`}
                  className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-[#ffb81e] hover:text-white"
                  onClick={onLinkClick}
                >
                  View All <ChevronRight className="ml-1 h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

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
        <div className="w-60 border-r border-gray-100 py-6">
          <ul className="flex flex-col">
            {categories.map((category) => (
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
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
