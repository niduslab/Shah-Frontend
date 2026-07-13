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

interface HeroSection {
  id: string;
  title: string;
  buttonText: string;
  buttonUrl: string;
  image: string;
  position: "main" | "topRight" | "bottomRight" | "tallRight";
  discountBadge?: {
    enabled: boolean;
    text: string;
    percentage: string;
  };
}

type HeroLayout = "grid" | "video";

interface HeroVideo {
  video: string;
  title: string;
  buttonText: string;
  buttonUrl: string;
  discountBadge?: {
    enabled: boolean;
    text: string;
    percentage: string;
  };
}

const DEFAULT_HERO_VIDEO: HeroVideo = {
  video: "",
  title: "Elevate Your\nFitness Journey",
  buttonText: "Shop Now",
  buttonUrl: "/shop",
  discountBadge: {
    enabled: false,
    text: "Up to",
    percentage: "40%",
  },
};

const DEFAULT_SECTIONS: HeroSection[] = [
  {
    id: "main",
    position: "main",
    title: "Elevate Your\nFitness Journey",
    buttonText: "Shop Now",
    buttonUrl: "/shop",
    image: "/images/landing/hero-section/6da4e59475159602882c3fabee07c1388d618dbb.png",
    discountBadge: {
      enabled: true,
      text: "Up to",
      percentage: "40%",
    },
  },
  {
    id: "topRight",
    position: "topRight",
    title: "Perfect Gear\nAwaits",
    buttonText: "Shop Now",
    buttonUrl: "/shop",
    image: "/images/landing/hero-section/d7c609f1a7f9028a48f85f6b588e7ae4e6803c45.png",
  },
  {
    id: "bottomRight",
    position: "bottomRight",
    title: "Shine Bright with\nWeights",
    buttonText: "Shop Now",
    buttonUrl: "/shop",
    image: "/images/landing/hero-section/efc3fc0e7c591b4a8aaa86acf5dae5a7e6ef5118.png",
  },
  {
    id: "tallRight",
    position: "tallRight",
    title: "TOP\nPICKS",
    buttonText: "Shop Now",
    buttonUrl: "/shop",
    image: "/images/landing/hero-section/e2e807f93cc803b571ae315331b10d75e097223b.png",
  },
];

export function HeroSection() {
  const [sections, setSections] = useState<HeroSection[]>(DEFAULT_SECTIONS);
  const [heroLayout, setHeroLayout] = useState<HeroLayout>("grid");
  const [heroVideo, setHeroVideo] = useState<HeroVideo>(DEFAULT_HERO_VIDEO);

  useEffect(() => {
    const fetchHeroSections = async () => {
      try {
        const response = await fetch("/api/hero-sections");
        if (response.ok) {
          const data = await response.json();
          if (data.sections && data.sections.length > 0) {
            setSections(data.sections);
          }
          if (data.heroLayout === "video" || data.heroLayout === "grid") {
            setHeroLayout(data.heroLayout);
          }
          if (data.heroVideo) {
            setHeroVideo({ ...DEFAULT_HERO_VIDEO, ...data.heroVideo });
          }
        }
      } catch (error) {
        console.error("Error fetching hero sections:", error);
      }
    };

    fetchHeroSections();
  }, []);
  const containerRef = useRef<HTMLDivElement>(null);
  const mainImageRef = useRef<HTMLDivElement>(null);
  const tallImageRef = useRef<HTMLDivElement>(null);
  const topRightImageRef = useRef<HTMLDivElement>(null);
  const bottomRightImageRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // The grid refs are not mounted in video mode; animating null targets throws.
    if (heroLayout === "video") return;

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
        gsap.to(mainImageRef.current?.querySelector("img") as any, {
            yPercent: 10,
            ease: "none",
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top top",
                end: "bottom top",
                scrub: true,
            },
        });

        gsap.to(tallImageRef.current?.querySelector("img") as any, {
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

  }, { scope: containerRef, dependencies: [heroLayout] });

  const mainSection = sections.find((s) => s.position === "main");
  const topRightSection = sections.find((s) => s.position === "topRight");
  const bottomRightSection = sections.find((s) => s.position === "bottomRight");
  const tallRightSection = sections.find((s) => s.position === "tallRight");

  const renderTitle = (title: string) => {
    return title.split("\n").map((line, index) => (
      <span key={index}>
        {line}
        {index < title.split("\n").length - 1 && <br />}
      </span>
    ));
  };

  // Full-width video hero. Falls back to the grid if the admin selected video mode
  // but has not uploaded a file yet, so the homepage is never left blank.
  if (heroLayout === "video" && heroVideo.video) {
    return (
      <div ref={containerRef} className="w-full bg-white py-4 md:py-6 overflow-hidden">
        <div className="mx-auto w-full max-w-[1400px] px-4 md:px-6">
          <div className="relative h-[400px] w-full overflow-hidden rounded-xs md:h-[600px]">
            <video
              src={heroVideo.video}
              className="h-full w-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

            <div className="absolute bottom-8 left-8 max-w-md z-10">
              {heroVideo.title && (
                <h2 className="mb-6 text-2xl font-semibold leading-tight text-white sm:text-3xl md:text-[36px]">
                  {renderTitle(heroVideo.title)}
                </h2>
              )}
              {heroVideo.buttonText && (
                <Link
                  href={heroVideo.buttonUrl || "/shop"}
                  className="inline-flex h-12 items-center gap-2 rounded-md bg-primary px-6 text-[16px] font-semibold text-black transition-colors hover:bg-primary/90"
                >
                  {heroVideo.buttonText} <ArrowRight className="h-4 w-4" />
                </Link>
              )}
            </div>

            {heroVideo.discountBadge?.enabled && (
              <div className="absolute bottom-8 right-8 z-10 flex h-32 w-32 items-center justify-center rounded-full bg-[#FF5722] shadow-2xl transition-transform duration-300 hover:scale-110 md:h-40 md:w-40">
                <div className="text-center">
                  <div className="text-sm font-medium text-white md:text-base">
                    {heroVideo.discountBadge.text}
                  </div>
                  <div className="text-4xl font-bold leading-none text-white md:text-5xl">
                    {heroVideo.discountBadge.percentage}
                  </div>
                  <div className="text-sm font-medium text-white md:text-base">Discounts</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="w-full bg-white py-4 md:py-6 overflow-hidden">
      <div className="mx-auto grid w-full max-w-[1400px] grid-cols-1 gap-4 px-4 md:px-6 md:h-[600px] md:grid-cols-4">

        {/* Main Section */}
        {mainSection && (
          <div ref={mainImageRef} className="group relative col-span-1 h-[400px] overflow-hidden rounded-xs md:col-span-2 md:row-span-2 md:h-full">
            <div className="relative h-full w-full overflow-hidden">
              <Image
                  src={mainSection.image}
                  alt={mainSection.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105 will-change-transform"
                  priority
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-8 left-8 max-w-md z-10">
              <h2 className="mb-6 text-2xl font-semibold leading-tight text-white sm:text-3xl md:text-[36px]">
                {renderTitle(mainSection.title)}
              </h2>
              <Link
                href={mainSection.buttonUrl}
                className="inline-flex h-12 items-center gap-2 rounded-md bg-primary px-6 text-[16px] font-semibold text-black transition-colors hover:bg-primary/90"
              >
                {mainSection.buttonText} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            
            {/* Discount Badge */}
            {mainSection.discountBadge?.enabled && (
              <div className="absolute bottom-8 right-8 z-10 flex h-32 w-32 items-center justify-center rounded-full bg-[#FF5722] shadow-2xl transition-transform duration-300 hover:scale-110 md:h-40 md:w-40">
                <div className="text-center">
                  <div className="text-sm font-medium text-white md:text-base">
                    {mainSection.discountBadge.text}
                  </div>
                  <div className="text-4xl font-bold leading-none text-white md:text-5xl">
                    {mainSection.discountBadge.percentage}
                  </div>
                  <div className="text-sm font-medium text-white md:text-base">Discounts</div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Top Right Section */}
        {topRightSection && (
          <div ref={topRightImageRef} className="group relative col-span-1 h-[250px] overflow-hidden rounded-xs md:col-span-1 md:row-span-1 md:h-full">
            <div className="relative h-full w-full overflow-hidden">
              <Image
                  src={topRightSection.image}
                  alt={topRightSection.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105 will-change-transform"
              />
            </div>
            <div className="absolute inset-0 bg-black/20 pointer-events-none" />
            <div className="absolute left-6 top-6 z-10">
              <h3 className="mb-2 text-xl font-semibold text-white sm:text-2xl">
                {renderTitle(topRightSection.title)}
              </h3>
              <Link
                href={topRightSection.buttonUrl}
                className="inline-flex items-center gap-2 text-[16px] font-semibold text-primary hover:text-primary/80"
              >
                {topRightSection.buttonText} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        )}

        {/* Tall Right Section */}
        {tallRightSection && (
          <div ref={tallImageRef} className="group relative col-span-1 h-[450px] overflow-hidden rounded-xs md:col-span-1 md:row-span-2 md:h-full">
            <div className="relative h-full w-full overflow-hidden">
              <Image
                  src={tallRightSection.image}
                  alt={tallRightSection.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105 will-change-transform"
              />
            </div>
            <div className="absolute inset-0 bg-black/20 pointer-events-none" />
            <div className="absolute bottom-8 left-0 right-0 text-center z-10">
              <h3 className="mb-8 text-3xl font-semibold italic tracking-wider text-white sm:text-4xl md:text-[48px]">
                {renderTitle(tallRightSection.title)}
              </h3>
              <Link
                href={tallRightSection.buttonUrl}
                className="inline-flex h-12 items-center gap-2 rounded-md bg-primary px-6 text-[16px] font-semibold text-black transition-colors hover:bg-primary/90"
              >
                {tallRightSection.buttonText} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        )}

        {/* Bottom Right Section */}
        {bottomRightSection && (
          <div ref={bottomRightImageRef} className="group relative col-span-1 h-[250px] overflow-hidden rounded-xs md:col-span-1 md:row-span-1 md:h-full">
             <div className="relative h-full w-full overflow-hidden">
              <Image
                  src={bottomRightSection.image}
                  alt={bottomRightSection.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105 will-change-transform"
              />
            </div>
            <div className="absolute inset-0 bg-black/20 pointer-events-none" />
            <div className="absolute bottom-6 left-6 z-10">
              <h3 className="mb-2 text-xl font-bold text-white">
                {renderTitle(bottomRightSection.title)}
              </h3>
              <Link
                href={bottomRightSection.buttonUrl}
                className="inline-flex items-center gap-2 text-[16px] font-semibold text-primary hover:text-primary/80"
              >
                {bottomRightSection.buttonText} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
