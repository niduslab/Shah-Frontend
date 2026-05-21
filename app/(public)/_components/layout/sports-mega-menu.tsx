"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { useCategories } from "@/lib/hooks/public/useCategories";

interface Sport {
  name: string;
  href: string;
  categoryId: number;
  slug: string;
  image?: string;
}

export function SportsMegaMenu({ className, onLinkClick }: { className?: string; onLinkClick?: () => void }) {
  const { data: categoriesData, isLoading } = useCategories();

  // Process sports categories
  const { teamSports, indoorSports, sportsCategory } = useMemo(() => {
    if (!categoriesData?.data) {
      return { teamSports: [], indoorSports: [], sportsCategory: null };
    }

    // Find the Sports parent category
    const sportsCategory = categoriesData.data.find(
      (cat: any) => cat.is_active && !cat.parent_id && cat.slug === 'sports'
    );

    if (!sportsCategory) {
      return { teamSports: [], indoorSports: [], sportsCategory: null };
    }

    const children = (sportsCategory.children || []).filter((child: any) => child.is_active);

    // Find Indoor & Individual category
    const indoorCategory = children.find((cat: any) => cat.slug === 'indoor-individual');
    const indoorSports = indoorCategory 
      ? (indoorCategory.children || [])
          .filter((child: any) => child.is_active)
          .map((cat: any) => ({
            name: cat.name,
            href: `/shop?category=${cat.slug}`,
            categoryId: cat.id,
            slug: cat.slug,
          }))
      : [];

    // Team sports are direct children of Sports (excluding Indoor & Individual)
    const teamSports = children
      .filter((cat: any) => cat.slug !== 'indoor-individual')
      .map((cat: any) => ({
        name: cat.name,
        href: `/shop?category=${cat.slug}`,
        categoryId: cat.id,
        slug: cat.slug,
        // Map to existing images if available
        image: cat.slug === 'cricket' ? '/images/landing/sports-gear/right-1.png'
          : cat.slug === 'football' ? '/images/landing/sports-gear/right-2.png'
          : cat.slug === 'basketball' ? '/images/landing/sports-gear/right-3.png'
          : cat.slug === 'hockey' ? '/images/landing/sports-gear/right-4.png'
          : '/images/landing/sports-gear/right-1.png',
      }));

    return { teamSports, indoorSports, sportsCategory };
  }, [categoriesData]);

  if (isLoading) {
    return (
      <div className={cn("absolute left-0 top-full z-50 mt-0 w-full border-t border-gray-100 bg-white shadow-xl before:absolute before:-top-10 before:left-0 before:h-10 before:w-full before:bg-transparent", className)}>
        <div className="mx-auto max-w-[1400px] px-8 py-8">
          <div className="text-gray-500">Loading sports categories...</div>
        </div>
      </div>
    );
  }

  if (!sportsCategory || (teamSports.length === 0 && indoorSports.length === 0)) {
    return (
      <div className={cn("absolute left-0 top-full z-50 mt-0 w-full border-t border-gray-100 bg-white shadow-xl before:absolute before:-top-10 before:left-0 before:h-10 before:w-full before:bg-transparent", className)}>
        <div className="mx-auto max-w-[1400px] px-8 py-8">
          <div className="text-gray-500">No sports categories available.</div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("absolute left-0 top-full z-50 mt-0 w-full border-t border-gray-100 bg-white shadow-xl before:absolute before:-top-10 before:left-0 before:h-10 before:w-full before:bg-transparent", className)}>
      <div className="mx-auto max-w-[1400px] px-8 py-8">
        <div className="grid grid-cols-4 gap-8">
          {/* Column 1: Team Sports */}
          {teamSports.length > 0 && (
            <div>
              <h3 className="mb-6 text-sm font-bold uppercase tracking-wider text-[#00072D] border-b border-gray-100 pb-2">
                Team Sports
              </h3>
              <ul className="flex flex-col gap-3">
                {teamSports.map((sport: Sport) => (
                  <li key={sport.slug}>
                    <Link
                      href={sport.href}
                      className="group flex items-center justify-between text-sm font-medium text-gray-600 transition-all hover:text-black hover:font-bold"
                      onClick={onLinkClick}
                    >
                      <span>{sport.name}</span>
                      <ChevronRight className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100 text-[#ffb81e]" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Column 2: Indoor & Individual */}
          {indoorSports.length > 0 && (
            <div>
              <h3 className="mb-6 text-sm font-bold uppercase tracking-wider text-[#00072D] border-b border-gray-100 pb-2">
                Indoor & Individual
              </h3>
              <ul className="flex flex-col gap-3">
                {indoorSports.map((sport: Sport) => (
                  <li key={sport.slug}>
                    <Link
                      href={sport.href}
                      className="group flex items-center justify-between text-sm font-medium text-gray-600 transition-all hover:text-black hover:font-bold"
                      onClick={onLinkClick}
                    >
                      <span>{sport.name}</span>
                      <ChevronRight className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100 text-[#ffb81e]" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Column 3: Featured Promo (Large) */}
          <div className="relative h-full min-h-[300px] overflow-hidden rounded-xl bg-gray-100 group">
            <Image
              src="/images/landing/sports-gear/left-side-image.png"
              alt="Premium Sports Gear"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <span className="mb-2 inline-block rounded-full bg-[#ffb81e] px-3 py-1 text-[10px] font-bold tracking-wider text-[#00072D]">
                PREMIUM COLLECTION
              </span>
              <h4 className="mb-2 text-xl font-bold leading-tight">Elite Performance Gear</h4>
              <p className="mb-4 text-xs text-gray-300 line-clamp-2">
                Discover our range of professional-grade equipment designed for athletes who demand the best.
              </p>
              <Link 
                href={`/shop?category=${sportsCategory.slug}`}
                className="inline-flex items-center text-sm font-bold text-white transition-colors hover:text-[#ffb81e]"
                onClick={onLinkClick}
              >
                Explore Collection <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Column 4: Seasonal / Trending (Using grid of smaller images) */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#00072D] border-b border-gray-100 pb-2">
              Trending Now
            </h3>
            <div className="grid grid-cols-2 gap-4 h-full">
              {teamSports.slice(0, 4).map((sport: Sport, index: number) => (
                <Link 
                  key={sport.slug} 
                  href={sport.href} 
                  className="group relative block h-32 overflow-hidden rounded-lg bg-gray-50"
                  onClick={onLinkClick}
                >
                  <Image
                    src={sport.image || '/images/landing/sports-gear/right-1.png'}
                    alt={sport.name}
                    fill
                    className="object-contain p-2 transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />
                  <div className="absolute bottom-2 left-2 right-2 rounded-md bg-white/90 px-2 py-1 text-center backdrop-blur-sm">
                    <span className="text-[10px] font-bold text-[#00072D] uppercase tracking-wide">{sport.name}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
