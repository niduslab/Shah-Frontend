"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface ShopCard {
  id: string;
  image: string;
  title: string;
  buttonText: string;
  buttonUrl: string;
  badge?: {
    enabled: boolean;
    value: string;
    label: string;
  };
}

interface DynamicShopBySectionProps {
  data: {
    cards: ShopCard[];
  };
}

export function DynamicShopBySection({ data }: DynamicShopBySectionProps) {
  if (!data.cards || data.cards.length === 0) {
    return null;
  }

  return (
    <section className="w-full bg-white pb-16 md:pb-24">
      <div className="container mx-auto px-4 md:px-0 max-w-[1400px]">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {data.cards.map((card) => (
            <div
              key={card.id}
              className="group relative h-[400px] w-full overflow-hidden rounded-sm bg-gradient-to-b from-[#EAEAEA] to-[#B8B8B8] md:h-[500px]"
            >
              {/* Background Image */}
              <Image
                src={card.image}
                alt={card.title}
                fill
                className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center p-8 text-center">
                {/* Speed Badge (Optional) */}
                {card.badge?.enabled && (
                  <div className="absolute bottom-[140px] right-8 flex h-24 w-24 flex-col items-center justify-center rounded-2xl bg-[#1A1A1A] text-white shadow-lg md:right-12">
                    <span className="text-3xl font-bold">{card.badge.value}</span>
                    <span className="text-xs font-medium uppercase tracking-wider">
                      {card.badge.label}
                    </span>
                  </div>
                )}

                <h3 className="mb-6 text-2xl font-bold text-white md:text-3xl">
                  {card.title}
                </h3>

                <Link
                  href={card.buttonUrl}
                  className="inline-flex h-12 items-center gap-2 rounded-md bg-[#FFC107] px-8 text-base font-semibold text-black transition-colors hover:bg-[#FFC107]/90"
                >
                  {card.buttonText}
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
