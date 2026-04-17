"use client";

import { useRef, useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { clsx } from "clsx";

interface PerformanceFrame {
  id: string;
  image: string;
  alt: string;
}

interface PerformanceFrameData {
  enabled: boolean;
  sectionTitle: string;
  frames: PerformanceFrame[];
}

const DEFAULT_FRAMES: PerformanceFrame[] = [
  { id: "frame-1", image: "/images/landing/performance-frame/image-1.jpg", alt: "Strength Training" },
  { id: "frame-2", image: "/images/landing/performance-frame/image-2.jpg", alt: "Boxing" },
  { id: "frame-3", image: "/images/landing/performance-frame/image-3.jpg", alt: "Cycling" },
  { id: "frame-4", image: "/images/landing/performance-frame/image-4.jpg", alt: "Cardio" },
  { id: "frame-5", image: "/images/landing/performance-frame/image-5.png", alt: "Tennis" },
];

const AUTOPLAY_DELAY = 3500;
const TRANSITION_DURATION = 0.9;

// Responsive position configs — returns px values based on container width
const getPositions = (containerWidth: number) => {
  const scale = Math.min(Math.max(containerWidth / 1200, 0.5), 1);

  // Generous spacing, no blur — images stay crisp
  const innerGap = 340 * scale;
  const outerGap = 620 * scale;

  return [
    { x: -outerGap, width: 200 * scale, height: 220 * scale, zIndex: 1,  opacity: 0.55, scale: 0.85, blur: 0 },
    { x: -innerGap, width: 240 * scale, height: 280 * scale, zIndex: 5,  opacity: 0.85, scale: 0.92, blur: 0 },
    { x: 0,         width: 340 * scale, height: 440 * scale, zIndex: 10, opacity: 1,    scale: 1,    blur: 0 },
    { x: innerGap,  width: 240 * scale, height: 280 * scale, zIndex: 5,  opacity: 0.85, scale: 0.92, blur: 0 },
    { x: outerGap,  width: 200 * scale, height: 220 * scale, zIndex: 1,  opacity: 0.55, scale: 0.85, blur: 0 },
  ];
};

export function PerformanceFrameSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [containerWidth, setContainerWidth] = useState(1200);
  const [isAnimating, setIsAnimating] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const touchStartX = useRef<number | null>(null);

  // Tracks each card's previous visible slot (0-4). -1 means hidden.
  const prevSlotsRef = useRef<Record<number, number>>({});

  const [frameData, setFrameData] = useState<PerformanceFrameData>({
    enabled: true,
    sectionTitle: "Performance in Every Frame",
    frames: DEFAULT_FRAMES,
  });
  const [loading, setLoading] = useState(true);

  // Fetch config from admin API
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/admin/hero-sections");
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled && data.performanceFrameSection) {
          setFrameData(data.performanceFrameSection);
          setActiveIndex(Math.floor((data.performanceFrameSection.frames?.length ?? 0) / 2));
        }
      } catch (err) {
        console.error("Error fetching performance frame data:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // Observe container width for responsive positioning
  useEffect(() => {
    if (!trackRef.current) return;
    const el = trackRef.current;
    const ro = new ResizeObserver(([entry]) => {
      setContainerWidth(entry.contentRect.width);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [loading]);

  const total = frameData.frames.length;

  const goTo = useCallback((idx: number) => {
    if (isAnimating || total === 0) return;
    const next = ((idx % total) + total) % total;
    setActiveIndex(next);
  }, [isAnimating, total]);

  const handlePrev = useCallback(() => goTo(activeIndex - 1), [goTo, activeIndex]);
  const handleNext = useCallback(() => goTo(activeIndex + 1), [goTo, activeIndex]);

  // Autoplay — pauses on hover, respects reduced motion
  useEffect(() => {
    if (loading || !frameData.enabled || isHovered || total <= 1) return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const id = window.setTimeout(handleNext, AUTOPLAY_DELAY);
    return () => window.clearTimeout(id);
  }, [activeIndex, isHovered, loading, frameData.enabled, handleNext, total]);

  // Keyboard navigation (arrow keys)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const focused = document.activeElement;
      const inside = containerRef.current?.contains(focused);
      if (!inside && focused !== document.body) return;
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handlePrev, handleNext]);

  // Memoized positions — only recompute when container width changes
  const positions = useMemo(() => getPositions(containerWidth), [containerWidth]);

  // Main GSAP animation — single source of truth for card layout
  useGSAP(() => {
    if (loading || !frameData.enabled || total === 0) return;

    setIsAnimating(true);
    const tl = gsap.timeline({
      defaults: { duration: TRANSITION_DURATION, ease: "expo.out" },
      onComplete: () => setIsAnimating(false),
    });

    frameData.frames.forEach((_, i) => {
      const card = cardsRef.current[i];
      if (!card) return;

      // Shortest circular distance from active card
      let offset = i - activeIndex;
      if (offset > total / 2) offset -= total;
      if (offset < -total / 2) offset += total;

      const slotIndex = offset + 2; // maps -2..2 → 0..4
      const isVisible = slotIndex >= 0 && slotIndex <= 4;
      const prevSlot = prevSlotsRef.current[i];

      // Detect wrap-around: card jumped more than 2 slots, or re-entered from hidden
      const isWrapping =
        prevSlot !== undefined &&
        isVisible &&
        (Math.abs(slotIndex - prevSlot) > 2 || prevSlot < 0 || prevSlot > 4);

      // Update tracker for next cycle
      prevSlotsRef.current[i] = isVisible ? slotIndex : -1;

      if (!isVisible) {
        // Fade out in place — no horizontal travel
        tl.to(card, { opacity: 0, duration: 0.3, overwrite: "auto" }, 0);
        return;
      }

      const pos = positions[slotIndex];

      if (isWrapping) {
        // Snap to new position instantly, then fade in — prevents sliding across
        gsap.set(card, {
          xPercent: -50,
          yPercent: -50,
          x: pos.x,
          width: pos.width,
          height: pos.height,
          scale: pos.scale,
          zIndex: pos.zIndex,
          filter: `blur(${pos.blur}px)`,
          opacity: 0,
        });
        tl.to(
          card,
          { opacity: pos.opacity, duration: 0.5, overwrite: "auto" },
          0.1
        );
      } else {
        // Normal smooth transition between adjacent slots
        tl.to(
          card,
          {
            xPercent: -50,
            yPercent: -50,
            x: pos.x,
            width: pos.width,
            height: pos.height,
            opacity: pos.opacity,
            scale: pos.scale,
            filter: `blur(${pos.blur}px)`,
            zIndex: pos.zIndex,
            overwrite: "auto",
          },
          0
        );
      }
    });
  }, { dependencies: [activeIndex, loading, frameData, positions, total], scope: containerRef });

  // Touch / swipe support
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 50) {
      if (delta > 0) handlePrev();
      else handleNext();
    }
    touchStartX.current = null;
  };

  if (!frameData.enabled || loading) return null;

  return (
    <section
      ref={containerRef}
      className="w-full bg-white py-20 overflow-hidden"
      aria-roledescription="carousel"
      aria-label={frameData.sectionTitle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="mx-auto w-full max-w-[1400px] px-4 md:px-6">
        <h2 className="mb-14 text-center text-2xl font-bold text-black sm:text-3xl md:text-4xl">
          {frameData.sectionTitle}
        </h2>

        <div className="relative flex flex-col items-center">
          {/* Track */}
          <div
            ref={trackRef}
            className="relative w-full h-[480px] max-w-[1200px] mx-auto"
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            {frameData.frames.map((frame, index) => {
              const isActive = index === activeIndex;
              return (
                <div
                  key={frame.id}
                  ref={(el) => { cardsRef.current[index] = el; }}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${index + 1} of ${total}: ${frame.alt}`}
                  aria-hidden={!isActive}
                  onClick={() => goTo(index)}
                  className={clsx(
                    "absolute top-1/2 left-1/2 overflow-hidden rounded-xl bg-gray-100 cursor-pointer",
                    "shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)]",
                    "will-change-transform",
                    "opacity-0" // GSAP takes over immediately
                  )}
                  style={{
                    transformOrigin: "center center",
                    backfaceVisibility: "hidden",
                  }}
                >
                  <Image
                    src={frame.image}
                    alt={frame.alt}
                    fill
                    className="object-cover select-none pointer-events-none"
                    sizes="(max-width: 768px) 60vw, (max-width: 1200px) 40vw, 340px"
                    priority={isActive}
                    draggable={false}
                  />

                  {/* Gradient overlay on inactive cards only */}
                  <div
                    className={clsx(
                      "absolute inset-0 transition-opacity duration-500 pointer-events-none",
                      "bg-gradient-to-t from-black/40 via-black/5 to-transparent",
                      isActive ? "opacity-0" : "opacity-100"
                    )}
                  />
                </div>
              );
            })}
          </div>

          {/* Dots indicator */}
          <div className="mt-8 flex items-center gap-2">
            {frameData.frames.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === activeIndex}
                className={clsx(
                  "h-1.5 rounded-full transition-all duration-500",
                  i === activeIndex ? "w-8 bg-[#FFC107]" : "w-1.5 bg-gray-300 hover:bg-gray-400"
                )}
              />
            ))}
          </div>

          {/* Navigation buttons */}
          <div className="mt-6 flex gap-3">
            <button
              onClick={handlePrev}
              aria-label="Previous slide"
              className="group flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-black transition-all duration-300 hover:bg-[#FFC107] hover:scale-105 active:scale-95"
            >
              <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-0.5" />
            </button>
            <button
              onClick={handleNext}
              aria-label="Next slide"
              className="group flex h-12 w-12 items-center justify-center rounded-full bg-[#FFC107] text-black transition-all duration-300 hover:bg-[#FFB300] hover:scale-105 active:scale-95"
            >
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}