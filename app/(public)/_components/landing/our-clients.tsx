"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const CLIENTS_ROW_1 = [
  { id: 1, name: "Bangladesh Army", image: "/images/landing/our-clients/client 1 (1).png" },
  { id: 2, name: "Bangladesh Air Force", image: "/images/landing/our-clients/client 1 (2).png" },
  { id: 3, name: "DGFI", image: "/images/landing/our-clients/client 1 (3).png" },
  { id: 4, name: "Bangladesh Navy", image: "/images/landing/our-clients/client 1 (4).png" },
];

const CLIENTS_ROW_2 = [
  { id: 5, name: "Kurmitola Golf Club", image: "/images/landing/our-clients/client 1 (5).png" },
  { id: 6, name: "Gulshan Club", image: "/images/landing/our-clients/client 1 (6).png" },
  { id: 7, name: "Bangladesh Police", image: "/images/landing/our-clients/client 1 (7).png" },
  { id: 8, name: "Bangladesh Rab", image: "/images/landing/our-clients/client 1 (8).png" },
];

// Duplicate items to ensure smooth scrolling on wide screens
const ROW_1_ITEMS = [...CLIENTS_ROW_1, ...CLIENTS_ROW_1, ...CLIENTS_ROW_1, ...CLIENTS_ROW_1];
const ROW_2_ITEMS = [...CLIENTS_ROW_2, ...CLIENTS_ROW_2, ...CLIENTS_ROW_2, ...CLIENTS_ROW_2];

export function OurClients() {
  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Row 1: Left to Right
    if (row1Ref.current) {
      const totalWidth = row1Ref.current.scrollWidth;
      const singleSetWidth = totalWidth / 2;
      
      // Start from -singleSetWidth and move to 0
      gsap.fromTo(row1Ref.current, 
        { x: -singleSetWidth },
        {
          x: 0,
          duration: 60,
          ease: "none",
          repeat: -1,
        }
      );
    }

    // Row 2: Right to Left
    if (row2Ref.current) {
      const totalWidth = row2Ref.current.scrollWidth;
      const singleSetWidth = totalWidth / 2;

      // Start from 0 and move to -singleSetWidth
      gsap.to(row2Ref.current, {
        x: -singleSetWidth,
        duration: 60,
        ease: "none",
        repeat: -1,
      });
    }
  }, { scope: row1Ref }); // Scope doesn't matter much here as we use explicit refs, but good practice

  return (
    <section className="w-full bg-white py-12 overflow-hidden">
      <div className="mx-auto w-full max-w-[1400px] px-4 md:px-6">
        <div className="mb-8 flex flex-col items-start justify-between gap-4 px-6 sm:flex-row sm:items-center">
          <h2 className="text-3xl font-bold tracking-tight text-black">
            Our Proud Clients
          </h2>
          <Link 
            href="/our-proud-clients"
            className="flex items-center gap-1 text-[16px] font-semibold text-black hover:text-primary transition-colors"
          >
            View All Clients <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="flex flex-col gap-6">
          {/* Row 1 */}
          <div className="relative w-full overflow-hidden">
            <div ref={row1Ref} className="flex w-max gap-6">
              {/* First Set */}
              {ROW_1_ITEMS.map((client, index) => (
                <ClientCard key={`row1-1-${index}`} client={client} />
              ))}
              {/* Duplicate Set for Loop */}
              {ROW_1_ITEMS.map((client, index) => (
                <ClientCard key={`row1-2-${index}`} client={client} />
              ))}
            </div>
          </div>

          {/* Row 2 */}
          <div className="relative w-full overflow-hidden">
            <div ref={row2Ref} className="flex w-max gap-6">
              {/* First Set */}
              {ROW_2_ITEMS.map((client, index) => (
                <ClientCard key={`row2-1-${index}`} client={client} />
              ))}
              {/* Duplicate Set for Loop */}
              {ROW_2_ITEMS.map((client, index) => (
                <ClientCard key={`row2-2-${index}`} client={client} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ClientCard({ client }: { client: { name: string; image: string } }) {
  return (
    <div className="flex w-[280px] flex-col items-center justify-center gap-4 rounded-xs border border-gray-100 bg-gray-50 p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="relative h-20 w-20">
        <Image
          src={client.image}
          alt={client.name}
          fill
          className="object-contain"
        />
      </div>
      <span className="text-center text-sm font-bold text-black">
        {client.name}
      </span>
    </div>
  );
}
