import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { ProductCard } from "../shared/product-card";

const CATEGORIES = [
  "All",
  "Treadmill",
  "Bike",
  "Rowing",
  "Elliptical",
  "Barbell",
  "Bench",
  "Dumbbell",
  "Hammer Series",
  "Weight Plate",
];

const PRODUCTS = [
  {
    id: 1,
    name: "NordicTrack Commercial 1750 Treadmill",
    image: "/images/landing/best-selling-products/product-1.png",
    price: 824.00,
    originalPrice: 1999.00,
    rating: 5,
    reviews: 12,
    badge: { text: "-25% off", className: "bg-red-500" },
  },
  {
    id: 2,
    name: "Reebok Fitness Training Deck RAP-15170RD",
    image: "/images/landing/best-selling-products/product-2.png",
    price: 180.99,
    originalPrice: 240.99,
    rating: 5,
    reviews: 12,
    badge: { text: "-25% off", className: "bg-red-500" },
  },
  {
    id: 3,
    name: "Adidas Wheel Roller ADAC-11404BK-NL",
    image: "/images/landing/best-selling-products/product-3.png",
    price: 19.99,
    originalPrice: 1999.00,
    rating: 5,
    reviews: 12,
    badge: { text: "-25% off", className: "bg-red-500" },
  },
  {
    id: 4,
    name: "Sole B 94 Upright Cardio Exercise Bike",
    image: "/images/landing/best-selling-products/product-4.png",
    price: 999.99,
    originalPrice: 1099.99,
    rating: 5,
    reviews: 12,
    badge: { text: "-25% off", className: "bg-red-500" },
  },
];

export function BestSellingProducts() {
  return (
    <section className="w-full bg-white py-12">
      <div className="mx-auto w-full max-w-[1400px]">
        <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <h2 className="text-3xl font-bold tracking-tight text-black">
            Best Selling Product
          </h2>
          <Link 
            href="/shop"
            className="flex items-center gap-1 text-[16px] font-semibold text-black hover:text-primary transition-colors"
          >
            View All Products <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Categories Tabs */}
        <div className="mb-8 flex flex-wrap gap-3">
          {CATEGORIES.map((category, index) => (
            <button
              key={category}
              className={`rounded-full px-6 py-2 text-sm font-medium transition-colors ${
                index === 0
                  ? "bg-primary text-black"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PRODUCTS.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
