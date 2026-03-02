"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const SERVICES = [
  { title: "New Motor", price: "৳12,000 - ৳25,000" },
  { title: "Circuit MCB", price: "৳12,000 - ৳25,000" },
  { title: "Running Belt", price: "৳12,000 - ৳25,000" },
  { title: "Treadmill Deck", price: "৳12,000 - ৳25,000" },
  { title: "Drive Belt", price: "৳25,000 - ৳45,000" },
  { title: "Sensor", price: "৳25,000 - ৳45,000" },
  { title: "Repairing Motor", price: "৳7,500 - ৳12,000" },
  { title: "Repairing Circuit MCB", price: "৳7,500 - ৳12,000" },
];

export function OurServicesSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 75%",
        toggleActions: "play none none reverse",
      },
    });

    // Image Animation
    tl.from(imageRef.current, {
      opacity: 0,
      x: -50,
      duration: 1,
      ease: "power3.out",
    });

    // Content Animation
    tl.from(".service-content > *", {
      opacity: 0,
      x: 30,
      stagger: 0.1,
      duration: 0.8,
      ease: "power3.out",
    }, "-=0.6");

    // Services Grid Animation
    const serviceItems = containerRef.current?.querySelectorAll(".service-item");
    if (serviceItems) {
      tl.from(serviceItems, {
        opacity: 0,
        y: 20,
        stagger: 0.05,
        duration: 0.6,
        ease: "power2.out",
      }, "-=0.4");
    }

  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="w-full bg-white py-12">
      <div className="mx-auto w-full max-w-[1400px]">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-12">
          {/* Left Image */}
          <div ref={imageRef} className="relative h-[400px] w-full overflow-hidden rounded-[2px] lg:h-[697px] lg:w-[658px]">
            <Image
              src="/images/landing/our-service/3b9f1d99c30ba0e2b151f726eddf7c074a5f10fa.jpg"
              alt="Technician repairing a treadmill"
              fill
              className="object-cover will-change-transform"
            />
          </div>

          {/* Right Content */}
          <div className="service-content flex w-full flex-col lg:w-1/2">
            <h2 className="mb-4 text-3xl font-bold uppercase tracking-tight text-black md:text-4xl">
              OUR SERVICES
            </h2>
            <p className="mb-8 text-gray-600">
              Expert repair and maintenance services for all your fitness
              equipment. Quality parts, certified technicians, guaranteed
              satisfaction.
            </p>

            {/* Services Grid */}
            <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {SERVICES.map((service, index) => (
                <div
                  key={index}
                  className="service-item flex flex-col justify-center rounded-[2px] bg-gray-100 p-6 transition-colors hover:bg-gray-200 lg:h-[99px] lg:w-[283px]"
                >
                  <h3 className="mb-1 text-lg font-bold text-black">
                    {service.title}
                  </h3>
                  <p className="text-gray-600">{service.price}</p>
                </div>
              ))}
            </div>

            {/* Buttons */}
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                href="/contact"
                className="flex flex-1 items-center justify-center gap-2 rounded-md bg-[#FFB81C] px-6 py-3 font-semibold text-black transition-colors hover:bg-[#E5A519]"
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
              <Link
                href="/services"
                className="flex flex-1 items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-6 py-3 font-semibold text-black transition-colors hover:bg-gray-50"
              >
                View All Services
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
