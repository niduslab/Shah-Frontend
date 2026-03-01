"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

const teamSports = [
  { name: "Cricket", href: "#", image: "/images/landing/sports-gear/right-1.png" },
  { name: "Football", href: "#", image: "/images/landing/sports-gear/right-2.png" },
  { name: "Basketball", href: "#", image: "/images/landing/sports-gear/right-3.png" },
  { name: "Hockey", href: "#", image: "/images/landing/sports-gear/right-4.png" },
];

const indoorSports = [
  { name: "Table Tennis", href: "#" },
  { name: "Billiard", href: "#" },
  { name: "Swimming", href: "#" },
  { name: "Boxing", href: "#" },
  { name: "Badminton", href: "#" },
  { name: "Squash", href: "#" },
];

export function SportsMegaMenu({ className }: { className?: string }) {
  return (
    <div className={cn("absolute left-0 top-full z-50 mt-0 w-full border-t border-gray-100 bg-white shadow-xl before:absolute before:-top-10 before:left-0 before:h-10 before:w-full before:bg-transparent", className)}>
      <div className="mx-auto max-w-[1400px] px-8 py-8">
        <div className="grid grid-cols-4 gap-8">
          {/* Column 1: Team Sports */}
          <div>
            <h3 className="mb-6 text-sm font-bold uppercase tracking-wider text-[#00072D] border-b border-gray-100 pb-2">
              Team Sports
            </h3>
            <ul className="flex flex-col gap-3">
              {teamSports.map((sport) => (
                <li key={sport.name}>
                  <Link
                    href={sport.href}
                    className="group flex items-center justify-between text-sm font-medium text-gray-600 transition-all hover:text-black hover:font-bold"
                  >
                    <span>{sport.name}</span>
                    <ChevronRight className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100 text-[#ffb81e]" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: Indoor & Individual */}
          <div>
            <h3 className="mb-6 text-sm font-bold uppercase tracking-wider text-[#00072D] border-b border-gray-100 pb-2">
              Indoor & Individual
            </h3>
            <ul className="flex flex-col gap-3">
              {indoorSports.map((sport) => (
                <li key={sport.name}>
                  <Link
                    href={sport.href}
                    className="group flex items-center justify-between text-sm font-medium text-gray-600 transition-all hover:text-black hover:font-bold"
                  >
                    <span>{sport.name}</span>
                    <ChevronRight className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100 text-[#ffb81e]" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

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
                href="#" 
                className="inline-flex items-center text-sm font-bold text-white transition-colors hover:text-[#ffb81e]"
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
              {teamSports.slice(0, 4).map((sport, index) => (
                <Link key={index} href={sport.href} className="group relative block h-32 overflow-hidden rounded-lg bg-gray-50">
                  <Image
                    src={sport.image}
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
