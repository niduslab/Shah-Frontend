"use client";

import { useEffect, useRef } from "react";

/**
 * Navigation-safe scroll reveal using IntersectionObserver + CSS classes.
 * Elements start visible (no JS sets them invisible), then get the
 * "revealed" class when they enter the viewport. CSS handles the animation.
 * Survives Next.js client-side navigation because it never touches GSAP.
 */
export function useScrollReveal<T extends HTMLElement = HTMLElement>(
  options?: IntersectionObserverInit
) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("scroll-revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -60px 0px", ...options }
    );

    const targets = el.querySelectorAll<HTMLElement>("[data-reveal]");
    if (targets.length > 0) {
      targets.forEach((t) => observer.observe(t));
    } else {
      observer.observe(el);
    }

    return () => observer.disconnect();
  }, []);

  return ref as React.RefObject<T>;
}
