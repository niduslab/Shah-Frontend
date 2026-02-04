import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductCard } from "../shared/product-card";

const RECOMMENDED_PRODUCTS = [
  {
    id: 1,
    name: "Reebok Fitness Training Deck RAP-15170RD",
    image: "/images/landing/new-arrival/3c81b2d5cfd837c1a87f80ecd4654d112931d943.png",
    price: 180.99,
    originalPrice: 240.99,
    rating: 5,
    reviews: 39,
    badge: { text: "-25% off", className: "bg-red-500" },
  },
  {
    id: 2,
    name: "SPIRIT BACK EXTENSION / SKU: SP-4220",
    image: "/images/landing/new-arrival/48ea1efb27d9c62811e189727ecd54692bf0e529.png",
    price: 599.00,
    originalPrice: 799.00,
    rating: 5,
    reviews: 39,
    badge: { text: "-25% off", className: "bg-red-500" },
  },
  {
    id: 3,
    name: "UFC Contender Free Standing Bag UHA 69919",
    image: "/images/landing/new-arrival/d28b697c5ffd69551d236e0311c369e1daa2111e.png",
    price: 320.99,
    originalPrice: 449.00,
    rating: 5,
    reviews: 39,
    badge: { text: "-25% off", className: "bg-red-500" },
  },
  {
    id: 4,
    name: "GENESIS DS Chest / Shoulder - GD500",
    image: "/images/landing/new-arrival/d6d857a1c8f1272b3e4a3e6e66b8975e36f83230.png",
    price: 5250.99,
    originalPrice: 10500.99,
    rating: 5,
    reviews: 12,
    badge: { text: "-50% off", className: "bg-red-500" },
  },
];

export function RecommendedProducts() {
  return (
    <section className="w-full bg-white py-12">
      <div className="mx-auto w-full max-w-[1400px] px-4 md:px-6">
        <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <h2 className="text-3xl font-bold tracking-tight text-black">
            You May Also Like
          </h2>
          <div className="flex gap-2">
            <button className="flex h-10 w-10 items-center justify-center rounded-xs bg-gray-100 text-black transition-colors hover:bg-gray-200">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button className="flex h-10 w-10 items-center justify-center rounded-xs bg-[#D6F500] text-black transition-colors hover:bg-[#c4e000]">
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {RECOMMENDED_PRODUCTS.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
