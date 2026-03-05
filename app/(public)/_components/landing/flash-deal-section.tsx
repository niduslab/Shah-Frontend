"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Placeholder image until the correct one is located/provided
// User mentioned: public/images/landing/flash-deal
const BACKGROUND_IMAGE = "/images/landing/flash-deal/flash-deal.png";

export function FlashDealSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [timeLeft, setTimeLeft] = useState({
    days: 2,
    hours: 13,
    mins: 42,
    secs: 27,
  });

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 70%",
        toggleActions: "play none none reverse",
      },
    });

    // Background and Container Animation
    tl.from(".flash-deal-card", {
      opacity: 0,
      y: 50,
      scale: 0.98,
      duration: 1,
      ease: "power3.out",
    });

    // Content Animations
    tl.from(".flash-deal-content > *", {
      opacity: 0,
      x: -30,
      stagger: 0.1,
      duration: 0.8,
      ease: "power3.out",
    }, "-=0.6");

    // Discount Badge Pop-in
    tl.from(".discount-badge", {
      opacity: 0,
      scale: 0,
      rotation: -15,
      duration: 0.6,
      ease: "back.out(1.7)",
    }, "-=0.4");

    // Background Image Parallax
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(".flash-bg-img", 
            { scale: 1.1 },
            {
                scale: 1,
                ease: "none",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true,
                },
            }
        );
    });

  }, { scope: containerRef });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.secs > 0) {
          return { ...prev, secs: prev.secs - 1 };
        } else if (prev.mins > 0) {
          return { ...prev, mins: prev.mins - 1, secs: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, mins: 59, secs: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, mins: 59, secs: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section ref={containerRef} className="w-full bg-white px-4 py-8 md:px-6 md:py-12">
      <div className="mx-auto w-full max-w-[1400px] px-4 md:px-6">
        <div className="flash-deal-card relative h-[684px] w-full overflow-hidden rounded-xs md:h-[500px] lg:h-[684px]">
          {/* Background Image */}
          <div className="absolute inset-0 h-full w-full overflow-hidden">
            <Image
                src={BACKGROUND_IMAGE}
                alt="Flash Deal Runner"
                fill
                className="flash-bg-img object-cover object-center will-change-transform"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
                priority
            />
          </div>
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent pointer-events-none" />

          {/* Content */}
          <div className="flash-deal-content absolute inset-y-0 left-0 flex max-w-[600px] flex-col justify-center px-6 md:px-16 z-10">
            <span className="mb-2 text-lg font-medium italic text-yellow-400 md:text-xl">
              Flash Deal
            </span>
            
            <h2 className="mb-4 text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
              Grab it before <br /> it ends.
            </h2>
            
            <p className="mb-8 text-base text-gray-200 md:text-lg">
              Up to 50% off on premium fitness equipment.
            </p>

            {/* Countdown Timer */}
            <div className="mb-8 flex gap-3 md:gap-4">
              <TimeUnit value={timeLeft.days} label="Days" />
              <TimeUnit value={timeLeft.hours} label="Hours" />
              <TimeUnit value={timeLeft.mins} label="Mins" />
              <TimeUnit value={timeLeft.secs} label="Sec" />
            </div>

            <Link
              href="/flash-sale"
              className="inline-flex h-12 w-fit items-center gap-2 rounded-xs bg-yellow-400 px-8 text-[16px] font-semibold text-black transition-colors hover:bg-yellow-500"
            >
              Shop Now <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Discount Badge */}
          <div className="discount-badge absolute right-6 top-6 flex h-24 w-24 flex-col items-center justify-center rounded-full bg-orange-600 text-white md:right-16 md:top-16 md:h-32 md:w-32 z-10">
            <span className="text-sm font-medium md:text-base">Up to</span>
            <span className="text-2xl font-bold md:text-4xl">40%</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-sm bg-white text-lg font-bold text-black md:h-16 md:w-16 md:text-2xl">
        {value.toString().padStart(2, "0")}
      </div>
      <span className="mt-1 text-xs text-gray-300 md:text-sm">{label}</span>
    </div>
  );
}
