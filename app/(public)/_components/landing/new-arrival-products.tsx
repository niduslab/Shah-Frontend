import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { ProductCard } from "../shared/product-card";

const NEW_ARRIVAL_PRODUCTS = [
  {
    id: 1,
    name: "Adidas EPP Foam Roller ADAC-11507",
    image: "/images/landing/new-arrival/3c81b2d5cfd837c1a87f80ecd4654d112931d943.png",
    price: 31.99,
    rating: 5,
    reviews: 39,
    badge: { text: "New Arrival", className: "bg-[#3E4C24]" },
  },
  {
    id: 2,
    name: "UFC Standard Heavy Bag",
    image: "/images/landing/new-arrival/48ea1efb27d9c62811e189727ecd54692bf0e529.png",
    price: 130.99,
    rating: 5,
    reviews: 56,
    badge: { text: "New Arrival", className: "bg-[#3E4C24]" },
  },
  {
    id: 3,
    name: "Reebok Training Speed Rope",
    image: "/images/landing/new-arrival/d28b697c5ffd69551d236e0311c369e1daa2111e.png",
    price: 12.25,
    rating: 5,
    reviews: 56,
    badge: { text: "New Arrival", className: "bg-[#3E4C24]" },
  },
  {
    id: 4,
    name: "Reebok Premium Push Up Bars",
    image: "/images/landing/new-arrival/d6d857a1c8f1272b3e4a3e6e66b8975e36f83230.png",
    price: 55.99,
    rating: 5,
    reviews: 56,
    badge: { text: "New Arrival", className: "bg-[#3E4C24]" },
  },
];

export function NewArrivalProducts() {
  return (
    <section className="w-full bg-white py-12">
      <div className="mx-auto w-full max-w-[1400px] px-4 md:px-6">
        <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <h2 className="text-3xl font-bold tracking-tight text-black">
            New Arrival Product
          </h2>
          <Link 
            href="/shop?sort=newest"
            className="flex items-center gap-1 text-[16px] font-semibold text-black hover:text-primary transition-colors"
          >
            View All Products <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {NEW_ARRIVAL_PRODUCTS.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
