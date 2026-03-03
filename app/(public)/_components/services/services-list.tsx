"use client";

import { useState, useRef } from "react";
import { ArrowRight, Wrench, Settings, Activity, Hammer } from "lucide-react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useGSAPInit } from "@/lib/hooks/useGSAPInit";

// Service Categories and Data
const CATEGORIES = [
  { id: "all", label: "All Services" },
  { id: "treadmill", label: "Treadmill Services" },
  { id: "repair", label: "Repair Services" },
  { id: "parts", label: "Gym Equipment Parts" },
  { id: "strength", label: "Strength Equipment" },
];

const SERVICES = [
  {
    id: 1,
    title: "New Motor",
    category: "treadmill",
    price: "৳12,000 - ৳25,000",
    description: "High-performance motor replacement for all treadmill brands",
    popular: true,
  },
  {
    id: 2,
    title: "Circuit MCB",
    category: "treadmill",
    price: "৳12,000 - ৳25,000",
    description: "Main circuit board replacement with OEM-grade components",
    popular: false,
  },
  {
    id: 3,
    title: "Running Belt",
    category: "treadmill",
    price: "৳12,000 - ৳25,000",
    description: "Premium quality running belt for smooth, quiet operation",
    popular: true,
  },
  {
    id: 4,
    title: "Treadmill Deck",
    category: "treadmill",
    price: "৳12,000 - ৳25,000",
    description: "Durable deck replacement for extended machine life",
    popular: false,
  },
  {
    id: 5,
    title: "Drive Belt",
    category: "treadmill",
    price: "৳2,500 - ৳4,500",
    description: "Precision drive belt for optimal power transmission",
    popular: false,
  },
  {
    id: 6,
    title: "Sensor",
    category: "treadmill",
    price: "৳2,500 - ৳4,500",
    description: "Heart rate & speed sensor replacement and calibration",
    popular: false,
  },
  {
    id: 7,
    title: "Motor Repair",
    category: "repair",
    price: "৳7,500 - ৳12,000",
    description: "Complete motor overhaul including brushes, bearings & rewinding",
    popular: true,
  },
  {
    id: 8,
    title: "Circuit MCB Repair",
    category: "repair",
    price: "৳7,500 - ৳12,000",
    description: "Board-level repair with component replacement and testing",
    popular: false,
  },
  {
    id: 9,
    title: "Gym Cable (Per Feet)",
    category: "parts",
    price: "৳150 - ৳250",
    description: "Heavy-duty steel cables with nylon coating for smooth operation",
    popular: false,
  },
  {
    id: 10,
    title: "Gym Pully (Per Ps)",
    category: "parts",
    price: "৳500 - ৳1,200",
    description: "Precision-machined pulleys for friction-free cable movement",
    popular: true,
  },
  {
    id: 11,
    title: "Gym Foam (Per Ps)",
    category: "parts",
    price: "৳500 - ৳1,200",
    description: "High-density comfort foam for seats, pads and grips",
    popular: false,
  },
  {
    id: 12,
    title: "Gym Bar/Nut/Bushings",
    category: "parts",
    price: "৳500 - ৳2,000",
    description: "Chrome-plated bars, nuts, and self-lubricating bushings",
    popular: false,
  },
  {
    id: 13,
    title: "Weight Stack Components",
    category: "strength",
    price: "৳500 - ৳2,000",
    description: "Guide rods, selector pins, and stack plates for weight machines",
    popular: false,
  },
  {
    id: 14,
    title: "Frame Parts",
    category: "strength",
    price: "৳500 - ৳2,000",
    description: "Structural frame components, end caps, and hardware kits",
    popular: true,
  },
];

export function ServicesList() {
  useGSAPInit();
  const [activeCategory, setActiveCategory] = useState("all");
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredServices = activeCategory === "all" 
    ? SERVICES 
    : SERVICES.filter(service => service.category === activeCategory);

  useGSAP(() => {
    // Animate cards when category changes
    gsap.fromTo(
      ".service-card",
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.4, stagger: 0.05, ease: "power2.out" }
    );
  }, { scope: containerRef, dependencies: [activeCategory] });

  return (
    <section ref={containerRef} id="services-list" className="w-full bg-gray-50 py-20">
      <div className="container mx-auto px-4 md:px-0 max-w-[1400px]">
        
        {/* Section Header */}
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold uppercase tracking-tight text-black md:text-5xl">
            ALL <span className="text-[#FF6B00]">SERVICES</span>
          </h2>
          <p className="mx-auto max-w-2xl text-gray-500">
            Browse our complete range of repair, maintenance, and parts services
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-12 flex flex-wrap justify-center gap-3">
          {CATEGORIES.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`rounded-full px-6 py-2.5 text-sm font-semibold transition-all duration-300 ${
                activeCategory === category.id
                  ? "bg-[#FF6B00] text-white shadow-lg shadow-orange-200 transform scale-105"
                  : "bg-white text-gray-600 hover:bg-gray-100 hover:text-black border border-gray-100"
              }`}
            >
              {activeCategory === category.id && (
                <span className="mr-2 inline-block">
                  {category.id === "treadmill" && <Activity className="h-4 w-4" />}
                  {category.id === "repair" && <Wrench className="h-4 w-4" />}
                  {category.id === "parts" && <Settings className="h-4 w-4" />}
                  {category.id === "strength" && <Hammer className="h-4 w-4" />}
                </span>
              )}
              {category.label}
            </button>
          ))}
        </div>

        {/* Category Banner (Optional - Dynamic based on selection) */}
        {activeCategory !== "all" && (
          <div className="mb-12 overflow-hidden rounded-2xl bg-gradient-to-r from-[#FF6B00] to-[#ff8f40] p-8 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <div className="mb-2 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                  {activeCategory === "treadmill" && <Activity className="h-6 w-6" />}
                  {activeCategory === "repair" && <Wrench className="h-6 w-6" />}
                  {activeCategory === "parts" && <Settings className="h-6 w-6" />}
                  {activeCategory === "strength" && <Hammer className="h-6 w-6" />}
                </div>
                <h3 className="text-2xl font-bold mb-1">
                  {CATEGORIES.find(c => c.id === activeCategory)?.label}
                </h3>
                <p className="text-white/80 max-w-xl">
                  {activeCategory === "treadmill" && "Complete treadmill maintenance, repair & parts replacement for all major brands"}
                  {activeCategory === "repair" && "Expert diagnostics and repair services with genuine parts and warranty"}
                  {activeCategory === "parts" && "Quality replacement parts for commercial and home gym equipment"}
                  {activeCategory === "strength" && "Professional-grade strength machine components and accessories"}
                </p>
              </div>
              <div className="hidden md:block">
                <span className="rounded-full bg-white/20 px-4 py-1 text-sm font-medium backdrop-blur-sm">
                  {filteredServices.length} Services Available
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Services Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="service-card group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-md hover:border-orange-100 border border-transparent"
            >
              <div className="absolute top-0 right-0 p-4">
                 {service.popular && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-3 py-1 text-xs font-medium text-[#FF6B00] border border-orange-100">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#FF6B00]"></span>
                    Popular
                  </span>
                )}
              </div>

              <div>
                <div className="mb-4 flex items-center gap-3">
                  <span className="flex h-3 w-3 rounded-full bg-[#FF6B00]"></span>
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#FF6B00] transition-colors">
                    {service.title}
                  </h3>
                </div>
                
                <p className="mb-6 text-gray-500 leading-relaxed">
                  {service.description}
                </p>
              </div>

              <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-6">
                <div className="text-lg font-bold text-[#FF6B00]">
                  {service.price}
                </div>
                <Link 
                  href={`https://wa.me/880123456789?text=Hi, I am interested in ${service.title} service.`}
                  target="_blank"
                  className="flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-2 text-sm font-bold text-white transition-all hover:bg-[#128C7E] hover:scale-105 shadow-sm"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                    className="h-4 w-4"
                  >
                    <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z" />
                  </svg>
                  Book Now
                </Link>
              </div>
            </div>
          ))}
        </div>

        {filteredServices.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-gray-500">No services found in this category.</p>
          </div>
        )}

      </div>
    </section>
  );
}
