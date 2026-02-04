import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

const CATEGORIES = [
  {
    id: 1,
    name: "Bike",
    image: "/images/landing/explore-categories/image-1.png",
    href: "/shop",
  },
  {
    id: 2,
    name: "Treadmill",
    image: "/images/landing/explore-categories/image-2.png",
    href: "/shop",
  },
  {
    id: 3,
    name: "Dumbbell",
    image: "/images/landing/explore-categories/image-3.png",
    href: "/shop",
  },
  {
    id: 4,
    name: "Weight Plate",
    image: "/images/landing/explore-categories/image-4.png",
    href: "/shop",
  },
];

export function ExploreCategories() {
  return (
    <section className="w-full bg-white py-12">
      <div className="mx-auto w-full max-w-[1400px]">
        <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <h2 className="text-3xl font-bold tracking-tight text-black">
            Explore Our Categories
          </h2>
          <div className="flex gap-2">
            <button className="flex h-10 w-10 items-center justify-center rounded-xs bg-gray-100 text-black transition-colors hover:bg-gray-200">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <button className="flex h-10 w-10 items-center justify-center rounded-xs bg-primary text-black transition-colors hover:bg-primary/90">
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map((category) => (
            <Link
              key={category.id}
              href={category.href}
              className="group relative block aspect-[4/5] overflow-hidden rounded-xs-lg bg-gray-100"
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
