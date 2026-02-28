import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ProductCard } from "../shared/product-card";

const PERFORMANCE_PRODUCTS = [
  {
    id: 1,
    name: "Shah Muscle Chargers Boxing Gloves",
    image: "/images/landing/sports-gear/right-1.png",
    price: 21.99,
    rating: 0,
    reviews: 0,
  },
  {
    id: 2,
    name: "XPD Badminton Shoes J-15",
    image: "/images/landing/sports-gear/right-2.png",
    price: 39.99,
    rating: 0,
    reviews: 0,
  },
  {
    id: 3,
    name: "Friendship 729 5 Table Tennis Racket",
    image: "/images/landing/sports-gear/right-3.png",
    price: 16.99,
    rating: 0,
    reviews: 0,
  },
  {
    id: 4,
    name: "Billard Pool Table",
    image: "/images/landing/sports-gear/right-4.png",
    price: 250.99,
    rating: 0,
    reviews: 0,
  },
];

export function PerformanceSection() {
  return (
    <section className="w-full bg-white py-12">
      <div className="mx-auto w-full max-w-[1400px]">
        <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <h2 className="text-3xl font-bold text-black">
            Play Better with the Right Gear
          </h2>
          <Link
            href="/shop"
            className="flex items-center gap-2 text-[16px] font-bold text-[#3E4C24] hover:underline"
          >
            View All Products
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="relative h-[360px] overflow-hidden rounded-lg bg-gray-100 sm:h-[480px] md:h-[600px] lg:h-[800px]">
            <Image
              src="/images/landing/sports-gear/left-side-image.png"
              alt="Pickleball Gear"
              fill
              className="object-cover"
            />
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            
            {/* Content */}
            <div className="absolute bottom-0 left-0 p-8 text-white">
              <h3 className="mb-2 text-3xl font-bold">Pickleball</h3>
              <p className="mb-6 max-w-md text-sm text-gray-200">
                Lightweight paddles and gear built for fast rallies and smooth gameplay.
              </p>
              <Link 
                href="/shop" 
                className="flex items-center gap-2 rounded bg-[#FFC107] px-6 py-3 text-[16px] font-semibold text-black transition-colors hover:bg-[#FFC107]/90 w-fit"
              >
                Shop Now
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Right Product Grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {PERFORMANCE_PRODUCTS.map((product) => (
              <ProductCard key={product.id} product={product} imageHeight="h-[288px]" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
