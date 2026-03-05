"use client";

import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

const floorCategories = [
  {
    title: "Floor Mat",
    href: "/floor-solutions/floor-mat",
    image: "/images/landing/floor-solution/57e9ba3f08e9becbf9b3d9c11be4bb6c027f1918.jpg",
    description: "Premium gym and fitness mats"
  },
  {
    title: "Flooring Solution",
    href: "/floor-solutions/flooring",
    image: "/images/landing/floor-solution/b54b7f7c87e2a09fb14f9ba6f305a970c2bcdacf.jpg",
    description: "Complete court and surface solutions"
  },
  {
    title: "Sports Equipments",
    href: "/floor-solutions/sports-equipment",
    image: "/images/landing/floor-solution/df5e4936e4ad26eabb5d4f68226f4b8e0cbd16f3.jpg",
    description: "Professional training gear"
  },
];

export function FloorSolutionsMegaMenu({ className }: { className?: string }) {
  return (
    <div className={cn("absolute left-0 top-full z-50 mt-0 w-full border-t border-gray-100 bg-white shadow-xl before:absolute before:-top-10 before:left-0 before:h-10 before:w-full before:bg-transparent", className)}>
      <div className="mx-auto max-w-[1400px] px-8 py-10">
        <div className="grid grid-cols-3 gap-8">
          {floorCategories.map((category) => (
            <Link
              key={category.title}
              href={category.href}
              className="group relative overflow-hidden rounded-lg bg-gray-50 transition-all duration-300 hover:shadow-2xl"
            >
              {/* Image Container */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                <Image
                  src={category.image}
                  alt={category.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-90" />
              </div>

              {/* Content Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="mb-2 text-2xl font-bold tracking-tight transition-transform duration-300 group-hover:translate-y-[-4px]">
                  {category.title}
                </h3>
                <p className="text-sm text-gray-200 opacity-90">
                  {category.description}
                </p>
                
                {/* Hover Indicator */}
                <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-[#ffb81e] opacity-0 transition-all duration-300 group-hover:opacity-100">
                  <span>Explore</span>
                  <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>

              {/* Top Badge */}
              <div className="absolute right-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#00072D] backdrop-blur-sm">
                New
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
