"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  useGSAP(() => {
    if (isVisible) {
      gsap.to(".scroll-to-top", {
        opacity: 1,
        y: 0,
        duration: 0.3,
        display: "flex",
        ease: "power2.out",
      });
    } else {
      gsap.to(".scroll-to-top", {
        opacity: 0,
        y: 20,
        duration: 0.3,
        display: "none",
        ease: "power2.in",
      });
    }
  }, [isVisible]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className="scroll-to-top fixed bottom-24 right-8 z-50 hidden h-12 w-12 items-center justify-center rounded-full bg-[#ffb81e] text-black transition-all hover:bg-[#e5a519] hover:scale-110 md:bottom-28 md:right-12 cursor-pointer"
      aria-label="Scroll to top"
    >
      <ArrowUp className="h-6 w-6" strokeWidth={2.5} />
    </button>
  );
}
