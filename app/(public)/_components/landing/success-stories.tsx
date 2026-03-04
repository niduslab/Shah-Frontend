"use client";

import Image from "next/image";
import { ArrowLeft, ArrowRight, Play } from "lucide-react";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const STORIES = [
  {
    id: 1,
    name: "Bangladesh Navy",
    image: "/images/landing/success-stories/536c8bf6ec7eb35b36b1b8ec1953f4c098029a49.png",
    description: "The quality of equipment is exceptional, and their customer service is outstanding.",
  },
  {
    id: 2,
    name: "Huawei Enterprise",
    image: "/images/landing/success-stories/91409c62d10476f009ceb549f50a2ad82eecdbf1.png",
    description: "The durability and performance of their equipment is unmatched in the market.",
  },
  {
    id: 3,
    name: "Gulshan Club",
    image: "/images/landing/success-stories/c720ec2c5e57a0bc8d6ddfb287ceee26a9140229.png",
    description: "The yoga and flexibility equipment from Shah Sports is top-notch. Great value for money!",
  },
  {
    id: 4,
    name: "Cocord Real-Estate",
    image: "/images/landing/success-stories/cfa8138ad5135723dcedad5236627bc4d080c002.png",
    description: "The quality of equipment is exceptional, and their customer service is outstanding.",
  },
];

export function SuccessStories() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 75%",
        toggleActions: "play none none reverse",
      },
    });

    // Header animation
    tl.from("h2", {
      opacity: 0,
      x: -30,
      duration: 0.8,
      ease: "power3.out",
    })
    .from(".nav-button", {
      opacity: 0,
      x: 30,
      stagger: 0.1,
      duration: 0.8,
      ease: "power3.out",
    }, "<");

    // Stories grid animation
    const storyCards = containerRef.current?.querySelectorAll(".story-card");
    if (storyCards) {
      tl.from(storyCards, {
        opacity: 0,
        y: 50,
        stagger: 0.15,
        duration: 0.8,
        ease: "power3.out",
      }, "-=0.4");
    }

  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="w-full bg-[#FFF9F0] py-16 px-4 md:px-6">
      <div className="mx-auto w-full max-w-[1400px]">
        {/* Header */}
        <div className="mb-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <h2 className="max-w-lg text-4xl font-semibold leading-tight text-black md:text-5xl">
            Success Stories That Inspire Us
          </h2>
          <div className="flex gap-3">
            <button className="nav-button flex h-12 w-12 items-center justify-center rounded-xs bg-[#F3F4F6] text-black transition-colors hover:bg-gray-200">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <button className="nav-button flex h-12 w-12 items-center justify-center rounded-xs bg-primary text-black transition-colors hover:bg-primary/90">
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STORIES.map((story) => (
            <div
              key={story.id}
              className="story-card group relative h-[400px] overflow-hidden rounded-xs bg-gray-100"
            >
              <Image
                src={story.image}
                alt={story.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105 will-change-transform"
              />
              
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />

              {/* Play Button */}
              <div className="absolute inset-0 flex items-center justify-center opacity-80 transition-opacity group-hover:opacity-100 z-10">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/30 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
                  <Play className="h-5 w-5 fill-white text-white ml-0.5" />
                </div>
              </div>

              {/* Content */}
              <div className="absolute bottom-6 left-6 right-6 z-10">
                <h3 className="mb-2 text-xl font-bold text-white">
                  {story.name}
                </h3>
                <p className="text-sm leading-relaxed text-gray-200">
                  {story.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
