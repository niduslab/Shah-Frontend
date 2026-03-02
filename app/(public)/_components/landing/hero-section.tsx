"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const HERO_IMAGES = {
  main: "/images/landing/hero-section/6da4e59475159602882c3fabee07c1388d618dbb.png",
  topRight: "/images/landing/hero-section/d7c609f1a7f9028a48f85f6b588e7ae4e6803c45.png",
  bottomRight: "/images/landing/hero-section/efc3fc0e7c591b4a8aaa86acf5dae5a7e6ef5118.png",
  tallRight: "/images/landing/hero-section/e2e807f93cc803b571ae315331b10d75e097223b.png",
};

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mainImageRef = useRef<HTMLDivElement>(null);
  const tallImageRef = useRef<HTMLDivElement>(null);
  const topRightImageRef = useRef<HTMLDivElement>(null);
  const bottomRightImageRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      defaults: { ease: "power3.out" }
    });

    // Initial entrance animation
    tl.fromTo(
      [mainImageRef.current, topRightImageRef.current, tallImageRef.current, bottomRightImageRef.current],
      {
        opacity: 0,
        y: 50,
        scale: 0.95,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1,
        stagger: 0.1,
      }
    );

    // Text animations
    const textElements = containerRef.current?.querySelectorAll("h2, h3, a");
    if (textElements) {
        tl.fromTo(
            textElements,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.8, stagger: 0.05 },
            "-=0.5"
        );
    }

    // Parallax effect on scroll
    // Only apply if user doesn't prefer reduced motion
    const mm = gsap.matchMedia();
    
    mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Parallax for images
        gsap.to(mainImageRef.current?.querySelector("img"), {
            yPercent: 10,
            ease: "none",
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top top",
                end: "bottom top",
                scrub: true,
            },
        });

        gsap.to(tallImageRef.current?.querySelector("img"), {
            yPercent: 15, // Move slightly faster
            ease: "none",
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top top",
                end: "bottom top",
                scrub: true,
            },
        });
    });

  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="w-full bg-white px-4 py-4 md:px-6 md:py-6 overflow-hidden">
      <div className="mx-auto grid w-full max-w-[1400px] grid-cols-1 gap-4 md:h-[600px] md:grid-cols-4">

        <div ref={mainImageRef} className="group relative col-span-1 overflow-hidden rounded-xs md:col-span-2 md:row-span-2">
          <div className="relative h-full w-full overflow-hidden">
            <Image
                src={HERO_IMAGES.main}
                alt="Elevate Your Fitness Journey"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105 will-change-transform"
                priority
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
          <div className="absolute bottom-8 left-8 max-w-md z-10">
            <h2 className="mb-6 text-2xl font-semibold leading-tight text-white sm:text-3xl md:text-[36px]">
              Elevate Your <br /> Fitness Journey
            </h2>
            <Link
              href="/shop"
              className="inline-flex h-12 items-center gap-2 rounded-md bg-primary px-6 text-[16px] font-semibold text-black transition-colors hover:bg-primary/90"
            >
              Shop Now <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div ref={topRightImageRef} className="group relative col-span-1 overflow-hidden rounded-xs md:col-span-1 md:row-span-1">
          <div className="relative h-full w-full overflow-hidden">
            <Image
                src={HERO_IMAGES.topRight}
                alt="Perfect Gear Awaits"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105 will-change-transform"
            />
          </div>
          <div className="absolute inset-0 bg-black/20 pointer-events-none" />
          <div className="absolute left-6 top-6 z-10">
            <h3 className="mb-2 text-xl font-semibold text-white sm:text-2xl">
              Perfect Gear <br /> Awaits
            </h3>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 text-[16px] font-semibold text-primary hover:text-primary/80"
            >
              Shop Now <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div ref={tallImageRef} className="group relative col-span-1 overflow-hidden rounded-xs md:col-span-1 md:row-span-2">
          <div className="relative h-full w-full overflow-hidden">
            <Image
                src={HERO_IMAGES.tallRight}
                alt="Top Picks"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105 will-change-transform"
            />
          </div>
          <div className="absolute inset-0 bg-black/20 pointer-events-none" />
          <div className="absolute bottom-8 left-0 right-0 text-center z-10">
            <h3 className="mb-1 text-3xl font-semibold italic tracking-wider text-white sm:text-4xl md:text-[48px]">
              TOP
            </h3>
            <h3 className="mb-8 text-3xl font-semibold italic tracking-wider text-white sm:text-4xl md:text-[48px]">
              PICKS
            </h3>
            <Link
              href="/shop"
              className="inline-flex h-12 items-center gap-2 rounded-md bg-primary px-6 text-[16px] font-semibold text-black transition-colors hover:bg-primary/90"
            >
              Shop Now <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div ref={bottomRightImageRef} className="group relative col-span-1 overflow-hidden rounded-xs md:col-span-1 md:row-span-1">
           <div className="relative h-full w-full overflow-hidden">
            <Image
                src={HERO_IMAGES.bottomRight}
                alt="Shine Bright with Weights"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105 will-change-transform"
            />
          </div>
          <div className="absolute inset-0 bg-black/20 pointer-events-none" />
          <div className="absolute bottom-6 left-6 z-10">
            <h3 className="mb-2 text-xl font-bold text-white">
              Shine Bright with <br /> Weights
            </h3>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 text-[16px] font-semibold text-primary hover:text-primary/80"
            >
              Shop Now <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
