import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { ProductCard } from "../shared/product-card";

const DISCOUNTED_PRODUCTS = [
  {
    id: 1,
    name: "XPD Woven J-20",
    image: "/images/landing/discounted-products/3c81b2d5cfd837c1a87f80ecd4654d112931d943.png",
    price: 29.99,
    originalPrice: 34.99,
    rating: 5,
    reviews: 12,
    badge: { text: "-15% off", className: "bg-red-500" },
  },
  {
    id: 2,
    name: "Wave Men's Sport Swimming Boxer",
    image: "/images/landing/discounted-products/48ea1efb27d9c62811e189727ecd54692bf0e529.png",
    price: 16.00,
    originalPrice: 19.00,
    rating: 5,
    reviews: 39,
    badge: { text: "-25% off", className: "bg-red-500" },
  },
  {
    id: 3,
    name: "IREST LEG MASSAGER C 30A",
    image: "/images/landing/discounted-products/d28b697c5ffd69551d236e0311c369e1daa2111e.png",
    price: 599.00,
    originalPrice: 799.00,
    rating: 5,
    reviews: 39,
    badge: { text: "-25% off", className: "bg-red-500" },
  },
  {
    id: 4,
    name: "Xterra Adjustable Dumbbell 50kg Set",
    image: "/images/landing/discounted-products/d6d857a1c8f1272b3e4a3e6e66b8975e36f83230.png",
    price: 438.00,
    originalPrice: 473.00,
    rating: 5,
    reviews: 39,
    badge: { text: "-25% off", className: "bg-red-500" },
  },
];

export function DiscountedProducts() {
  return (
    <section className="w-full bg-white py-12">
      <div className="mx-auto w-full max-w-[1400px]">
        <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <h2 className="text-3xl font-bold tracking-tight text-black">
            Discount Products
          </h2>
          <Link 
            href="/shop?sort=discount"
            className="flex items-center gap-1 text-[16px] font-semibold text-black hover:text-primary transition-colors"
          >
            View Discount Products <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {DISCOUNTED_PRODUCTS.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
