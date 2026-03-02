"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const BACKGROUND_IMAGE = "/images/flash-sell-now/hero-img.png";

export function FlashSaleHero() {
  const [timeLeft, setTimeLeft] = useState({
    days: 2,
    hours: 13,
    mins: 42,
    secs: 27,
  });

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
    <section className="relative w-full h-[600px] md:h-[700px] overflow-hidden bg-black text-white">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={BACKGROUND_IMAGE}
          alt="Flash Sale Runner"
          fill
          className="object-cover object-center"
          priority
        />
        {/* Dark Gradient Overlay - stronger on the left for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto h-full w-full max-w-[1400px] flex flex-col justify-center">
        <div className="max-w-2xl">
          {/* Main Title */}
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-2">
            Flash Sale Now
          </h1>
          
          {/* Subtitle / Discount */}
          <p className="text-4xl md:text-6xl font-bold italic text-yellow-500 mb-10">
            Up To 40%
          </p>

          {/* Countdown Timer */}
          <div className="flex gap-4 mb-4">
            <TimeUnit value={timeLeft.days} label="Days" />
            <TimeUnit value={timeLeft.hours} label="Hours" />
            <TimeUnit value={timeLeft.mins} label="Mins" />
            <TimeUnit value={timeLeft.secs} label="Sec" />
          </div>

          {/* Items Count */}
          <p className="text-lg md:text-xl text-gray-300 font-medium mt-6 mb-8">
            Total: 56+ Items
          </p>

          {/* CTA Button */}
          <Link
            href="#products"
            className="inline-flex h-12 items-center justify-center rounded-sm bg-yellow-500 px-8 text-base font-bold text-black transition-transform hover:scale-105 hover:bg-yellow-400"
          >
            Shop Now
          </Link>
        </div>
      </div>
    </section>
  );
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  // Format number to always be 2 digits
  const formattedValue = value < 10 ? `0${value}` : value;

  return (
    <div className="flex flex-col items-center">
      <div className="flex h-16 w-16 md:h-20 md:w-20 items-center justify-center bg-white text-black text-2xl md:text-4xl font-bold rounded-sm shadow-lg">
        {formattedValue}
      </div>
      <span className="mt-2 text-sm md:text-base font-medium text-gray-300 uppercase tracking-wide">
        {label}
      </span>
    </div>
  );
}
