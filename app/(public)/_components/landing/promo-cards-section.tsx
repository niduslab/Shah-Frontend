"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface PromoCard {
  id: string;
  title: string;
  description: string;
  buttonText: string;
  buttonUrl: string;
  image: string;
  badge: {
    enabled: boolean;
    text: string;
    percentage: string;
  };
}

interface PromoCardsData {
  enabled: boolean;
  cards: PromoCard[];
}

const DEFAULT_DATA: PromoCardsData = {
  enabled: true,
  cards: [
    {
      id: "cardio",
      title: "Cardio Equipment's",
      description: "Burn calories and boost endurance with our premium cardio machines",
      buttonText: "Shop Now",
      buttonUrl: "/shop?has_discount=true",
      image: "/images/landing/discounts/a50664626eecf2cf40632e0dbb9e6575a1f03777.jpg",
      badge: {
        enabled: true,
        text: "Sale off",
        percentage: "45%",
      },
    },
    {
      id: "free-weight",
      title: "Free Weight Equipment's",
      description: "Burn calories and boost endurance with our premium cardio machines",
      buttonText: "Shop Now",
      buttonUrl: "/shop?has_promotion=true",
      image: "/images/landing/discounts/90712f9864d66ccaf16d572f3692189ac2991659.jpg",
      badge: {
        enabled: true,
        text: "Up to",
        percentage: "30%",
      },
    },
  ],
};

export function PromoCardsSection() {
  const [data, setData] = useState<PromoCardsData>(DEFAULT_DATA);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/hero-sections");
        if (response.ok) {
          const result = await response.json();
          if (result.promoCardsSection) {
            setData(result.promoCardsSection);
          }
        }
      } catch (error) {
        console.error("Error fetching promo cards data:", error);
      }
    };

    fetchData();
  }, []);

  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const cards = containerRef.current?.querySelectorAll(".promo-card");
    
    if (cards && cards.length > 0) {
      gsap.from(cards, {
        opacity: 0,
        y: 50,
        stagger: 0.2,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 75%",
          toggleActions: "play none none reverse",
        },
      });
    }
  }, { scope: containerRef });

  if (!data.enabled) {
    return null;
  }

  return (
    <section ref={containerRef} className="w-full bg-white py-12">
      <div className="mx-auto w-full max-w-[1400px] px-4 md:px-6">
        <div className="grid gap-6 md:grid-cols-2">
          {data.cards.map((card) => (
            <div
              key={card.id}
              className="discount-card group relative h-[360px] w-full overflow-hidden rounded-xs sm:h-[430px]"
            >
              {/* Background Image */}
              <Image
                src={card.image}
                alt={card.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105 will-change-transform"
              />

              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

              {/* Discount Badge */}
              {card.badge.enabled && (
                <div className="absolute left-8 top-8 flex h-20 w-20 flex-col items-center justify-center rounded-full bg-[#3E2405]/90 text-center text-primary backdrop-blur-sm z-10">
                  <span className="text-xs font-medium text-primary/80">{card.badge.text}</span>
                  <span className="text-xl font-bold">{card.badge.percentage}</span>
                </div>
              )}

              {/* Content */}
              <div className="absolute bottom-0 left-0 p-8 z-10">
                <h3 className="mb-2 text-3xl font-bold text-white">
                  {card.title}
                </h3>
                <p className="mb-6 max-w-md text-gray-200">
                  {card.description}
                </p>
                
                <Link
                  href={card.buttonUrl}
                  className="inline-flex items-center gap-2 text-[16px] font-semibold text-primary transition-colors hover:text-white"
                >
                  {card.buttonText} <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
