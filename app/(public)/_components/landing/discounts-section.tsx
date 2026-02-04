import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const DISCOUNTS = [
  {
    id: 1,
    title: "Cardio Equipment's",
    description: "Burn calories and boost endurance with our premium cardio machines",
    image: "/images/landing/discounts/a50664626eecf2cf40632e0dbb9e6575a1f03777.jpg",
    discount: "45%",
    badgeText: "Sale off",
    link: "/shop/cardio",
  },
  {
    id: 2,
    title: "Free Weight Equipment's",
    description: "Burn calories and boost endurance with our premium cardio machines",
    image: "/images/landing/discounts/90712f9864d66ccaf16d572f3692189ac2991659.jpg",
    discount: "30%",
    badgeText: "Up to",
    link: "/shop/free-weights",
  },
];

export function DiscountsSection() {
  return (
    <section className="w-full bg-white py-12">
      <div className="mx-auto w-full max-w-[1400px]">
        <div className="grid gap-6 md:grid-cols-2">
          {DISCOUNTS.map((item) => (
            <div
              key={item.id}
              className="group relative h-[360px] w-full overflow-hidden rounded-xs sm:h-[430px]"
            >
              {/* Background Image */}
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              {/* Discount Badge */}
              <div className="absolute left-8 top-8 flex h-20 w-20 flex-col items-center justify-center rounded-full bg-[#3E2405]/90 text-center text-primary backdrop-blur-sm">
                <span className="text-xs font-medium text-primary/80">{item.badgeText}</span>
                <span className="text-xl font-bold">{item.discount}</span>
              </div>

              {/* Content */}
              <div className="absolute bottom-0 left-0 p-8">
                <h3 className="mb-2 text-3xl font-bold text-white">
                  {item.title}
                </h3>
                <p className="mb-6 max-w-md text-gray-200">
                  {item.description}
                </p>
                
                <Link
                  href={item.link}
                  className="inline-flex items-center gap-2 text-[16px] font-semibold text-primary transition-colors hover:text-white"
                >
                  Shop Now <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
