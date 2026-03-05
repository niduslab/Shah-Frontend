"use client";

import { Wrench, Phone, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useGSAPInit } from "@/lib/hooks/useGSAPInit";
import { useRef } from "react";

const STATS = [
  { value: "15K+", label: "Repairs Completed" },
  { value: "200+", label: "Gym Partners" },
  { value: "98%", label: "Satisfaction Rate" },
  { value: "24hr", label: "Avg Response Time" },
];

export function ServicesHero() {
  useGSAPInit();
  const containerRef = useRef<HTMLDivElement>(null);
  const bgImageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    // Initial Reveal
    tl.fromTo(
      bgImageRef.current,
      { scale: 1.1, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1.5 }
    );

    tl.fromTo(
      contentRef.current?.children || [],
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.1 },
      "-=1"
    );

    tl.fromTo(
      ".stat-card",
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.1 },
      "-=0.6"
    );

    // Parallax Effect
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.to(bgImageRef.current?.querySelector("img") as any, {
        yPercent: 20,
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
    <section 
      ref={containerRef} 
      className="relative w-full min-h-[90vh] flex flex-col items-center justify-center overflow-hidden bg-black"
    >
      {/* Background Image with Parallax */}
      <div ref={bgImageRef} className="absolute inset-0 z-0 h-[120%] w-full -top-[10%]">
        <Image
          src="/images/landing/our-service/3b9f1d99c30ba0e2b151f726eddf7c074a5f10fa.jpg"
          alt="Professional Fitness Equipment Repair"
          fill
          className="object-cover opacity-40"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/90" />
      </div>

      <div ref={contentRef} className="container relative z-10 mx-auto px-4 py-20 text-center">
        {/* Badge */}
        <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm font-medium text-primary backdrop-blur-md">
          <Wrench className="h-4 w-4" />
          <span className="uppercase tracking-wider">Professional Services</span>
        </div>

        {/* Title */}
        <h1 className="mx-auto mb-6 max-w-5xl text-5xl font-bold uppercase leading-none tracking-tight text-white md:text-7xl lg:text-[90px]">
          Expert <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-600">Repair</span> <br />
          & Maintenance
        </h1>

        {/* Description */}
        <p className="mx-auto mb-10 max-w-2xl text-lg font-light text-gray-300 md:text-xl leading-relaxed">
          From treadmills to complete gym setups — we keep your fitness equipment
          running at peak performance with genuine parts and certified technicians.
        </p>

        {/* Buttons */}
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row mb-20">
          <Link
            href="#services-list"
            className="group flex h-14 items-center gap-2 rounded-md bg-primary px-8 text-base font-bold text-black transition-all hover:bg-primary/90"
          >
            Explore Services
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href="/contact"
            className="group flex h-14 items-center gap-2 rounded-md border border-white/20 bg-white/5 px-8 text-base font-bold text-white backdrop-blur-sm transition-all hover:border-white/40 hover:bg-white/10"
          >
            <Phone className="h-5 w-5" />
            Call for Quote
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-4 md:grid-cols-4">
          {STATS.map((stat, index) => (
            <div
              key={index}
              className="stat-card group relative overflow-hidden rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-md transition-all hover:border-primary/50 hover:bg-white/10"
            >
              <div className="relative z-10">
                <div className="mb-2 text-3xl font-bold text-white md:text-4xl">
                  {stat.value}
                </div>
                <div className="text-xs font-bold uppercase tracking-widest text-gray-400 group-hover:text-primary transition-colors">
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
