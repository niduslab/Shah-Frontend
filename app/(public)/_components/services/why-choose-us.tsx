"use client";

import { ShieldCheck, Award, Clock, MapPin } from "lucide-react";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const FEATURES = [
  {
    icon: ShieldCheck,
    title: "90-Day Warranty",
    description: "Every service backed by our comprehensive 90-day warranty on parts and labor",
  },
  {
    icon: Award,
    title: "Certified Technicians",
    description: "Factory-trained experts with 10+ years of experience in fitness equipment",
  },
  {
    icon: Clock,
    title: "Quick Turnaround",
    description: "Most repairs completed within 24-48 hours to minimize your downtime",
  },
  {
    icon: MapPin,
    title: "On-Site Service",
    description: "We come to you — home, gym, or commercial facility across Bangladesh",
  },
];

export function WhyChooseUs() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 80%",
        toggleActions: "play none none reverse",
      },
    });

    tl.fromTo(
      ".section-header",
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
    );

    tl.fromTo(
      ".feature-card",
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power3.out" },
      "-=0.4"
    );
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="w-full bg-white py-20">
      <div className="mx-auto px-4 md:px-0 max-w-[1400px] container ">
        {/* Header */}
        <div className="section-header mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold uppercase tracking-tight text-black md:text-4xl">
            WHY <span className="text-[#FF6B00]">CHOOSE US</span>
          </h2>
          <p className="mx-auto max-w-2xl text-gray-500">
            Trusted by 200+ gyms and fitness centers across Bangladesh
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature, index) => (
            <div
              key={index}
              className="feature-card group flex flex-col items-start rounded-2xl border border-gray-100 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-orange-300 hover:shadow-md"
            >
              {/* Icon Box */}
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-[#FFF0E0] text-[#FF6B00] transition-colors group-hover:bg-[#FF6B00] group-hover:text-white">
                <feature.icon className="h-7 w-7" strokeWidth={1.5} />
              </div>

              {/* Content */}
              <h3 className="mb-3 text-lg font-bold text-gray-900">
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed text-gray-500">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
