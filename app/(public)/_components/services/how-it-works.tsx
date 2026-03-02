"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Phone, Stethoscope, Wrench, ShieldCheck, ArrowRight } from "lucide-react";
import Link from "next/link";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const STEPS = [
  {
    id: "01",
    title: "Request Service",
    description: "Submit your service request online or call our support team directly.",
    icon: Phone,
  },
  {
    id: "02",
    title: "Expert Diagnosis",
    description: "Certified technicians assess the issue and provide a transparent quote.",
    icon: Stethoscope,
  },
  {
    id: "03",
    title: "Professional Repair",
    description: "We fix your equipment on-site using genuine manufacturer parts.",
    icon: Wrench,
  },
  {
    id: "04",
    title: "Quality Assurance",
    description: "Comprehensive testing ensures peak performance before we leave.",
    icon: ShieldCheck,
  },
];

export function HowItWorks() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 75%",
        toggleActions: "play none none reverse",
      },
    });

    // Header Stagger
    tl.fromTo(
      ".section-header > *",
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power3.out" }
    );

    // Cards Stagger
    tl.fromTo(
      ".step-card",
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, stagger: 0.15, ease: "power2.out" },
      "-=0.4"
    );

    // CTA Animation
    tl.fromTo(
      ".cta-container",
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" },
      "-=0.2"
    );

  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="w-full bg-gradient-to-b from-white to-gray-50 py-24 lg:py-32 overflow-hidden">
      <div className="container mx-auto px-4 md:px-0 max-w-[1400px]">
        
        {/* Header */}
        <div className="section-header mb-20 text-center max-w-3xl mx-auto">
          <span className="mb-4 inline-block rounded-full bg-orange-50 px-4 py-1.5 text-sm font-bold uppercase tracking-wider text-[#FF6B00] border border-orange-100">
            Process
          </span>
          <h2 className="mb-6 text-4xl font-black uppercase tracking-tight text-gray-900 md:text-5xl lg:text-6xl">
            Streamlined <span className="text-[#FF6B00]">Service Flow</span>
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            We've simplified equipment maintenance into four easy steps. From your first call to the final test run, experience hassle-free professional service.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 mb-20">
          {STEPS.map((step, index) => (
            <div
              key={step.id}
              className="step-card group relative flex flex-col items-start rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-100 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:ring-orange-100"
            >
              {/* Step Number Background */}
              <span className="absolute right-4 top-4 text-6xl font-black text-gray-50 opacity-50 transition-colors group-hover:text-orange-50/80">
                {step.id}
              </span>

              {/* Icon */}
              <div className="mb-6 relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FFF0E0] text-[#FF6B00] transition-colors duration-300 group-hover:bg-[#FF6B00] group-hover:text-white">
                <step.icon className="h-8 w-8" strokeWidth={1.5} />
              </div>

              {/* Content */}
              <h3 className="mb-3 text-xl font-bold text-gray-900 group-hover:text-[#FF6B00] transition-colors relative z-10">
                {step.title}
              </h3>
              <p className="text-gray-500 leading-relaxed relative z-10">
                {step.description}
              </p>

              {/* Connector (Desktop Only) */}
              {index !== STEPS.length - 1 && (
                <div className="absolute -right-4 top-1/2 hidden h-8 w-8 -translate-y-1/2 text-gray-200 lg:block z-20">
                  <ArrowRight className="h-full w-full opacity-50" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="cta-container relative overflow-hidden rounded-3xl bg-gray-900 px-6 py-16 text-center shadow-2xl md:px-12 lg:py-20">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
            </svg>
          </div>
          
          <div className="relative z-10 max-w-3xl mx-auto">
            <h3 className="mb-6 text-3xl font-bold text-white md:text-4xl">
              Ready to Restore Your Equipment?
            </h3>
            <p className="mb-10 text-lg text-gray-300">
              Don't let broken machines slow you down. Book a certified technician today and get your gym back in action.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/contact"
                className="group inline-flex h-14 items-center justify-center gap-2 rounded-full bg-[#FF6B00] px-8 text-base font-bold text-white transition-all hover:bg-[#e66000] hover:scale-105"
              >
                Book a Service
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="https://wa.me/880123456789"
                className="group inline-flex h-14 items-center justify-center gap-2 rounded-full bg-[#FFB81C] px-8 text-base font-bold text-black transition-all hover:bg-[#E5A519] hover:scale-105"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                  className="h-5 w-5"
                >
                  <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z" />
                </svg>
                Contact Us
              </Link>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
