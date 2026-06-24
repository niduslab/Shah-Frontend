"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useScrollReveal } from "@/lib/hooks/useScrollReveal";

const IMAGES = {
  floorMat: "/images/landing/floor-solution/57e9ba3f08e9becbf9b3d9c11be4bb6c027f1918.jpg",
  flooringSolution: "/images/landing/floor-solution/b54b7f7c87e2a09fb14f9ba6f305a970c2bcdacf.jpg",
  sportsEquipments: "/images/landing/floor-solution/df5e4936e4ad26eabb5d4f68226f4b8e0cbd16f3.jpg",
};

export function FloorSolution() {
  const sectionRef = useScrollReveal<HTMLDivElement>();

  return (
    <div ref={sectionRef} className="w-full bg-white px-4 py-4 md:px-6 md:py-6">
      <div data-reveal-stagger className="mx-auto grid w-full max-w-[1400px] grid-cols-1 gap-4 md:grid-cols-2">
        {/* Floor Mat */}
        <div data-reveal className="group relative h-[300px] overflow-hidden rounded-xs md:h-[620px]">
          <Image
            src={IMAGES.floorMat}
            alt="Floor Mat"
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105 will-change-transform"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
          <div className="absolute bottom-8 left-0 right-0 flex flex-col items-center justify-end text-center z-10">
            <h3 className="mb-4 text-3xl font-semibold text-white md:text-4xl">
              Floor Mat
            </h3>
            <Link
              href="/floor-mat"
              className="inline-flex h-12 w-fit items-center gap-2 rounded-xs bg-yellow-400 px-8 text-[16px] font-semibold text-black transition-colors hover:bg-yellow-500"
            >
              Shop Now <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Flooring Solution */}
        <div data-reveal className="group relative h-[300px] overflow-hidden rounded-xs md:h-[620px]">
          <Image
            src={IMAGES.flooringSolution}
            alt="Flooring Solution"
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105 will-change-transform"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
          <div className="absolute bottom-8 left-0 right-0 flex flex-col items-center justify-end text-center z-10">
            <h3 className="mb-4 text-3xl font-semibold text-white md:text-4xl">
              Flooring Solution
            </h3>
            <Link
              href="/flooring-solution"
              className="inline-flex h-12 w-fit items-center gap-2 rounded-xs bg-yellow-400 px-8 text-[16px] font-semibold text-black transition-colors hover:bg-yellow-500"
            >
              Learn More <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Sports Equipments */}
        <div data-reveal className="col-span-1 group relative h-[300px] overflow-hidden rounded-xs md:col-span-2 md:h-[620px]">
          <Image
            src={IMAGES.sportsEquipments}
            alt="Sports Equipments"
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105 will-change-transform"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
          <div className="absolute bottom-12 left-0 right-0 flex flex-col items-center justify-end text-center z-10">
            <h3 className="mb-4 text-3xl font-semibold text-white md:text-5xl">
              Sports Equipments
            </h3>
            <Link
              href="/shop"
              className="inline-flex h-12 w-fit items-center gap-2 rounded-xs bg-yellow-400 px-8 text-[16px] font-semibold text-black transition-colors hover:bg-yellow-500"
            >
              Shop Now <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
