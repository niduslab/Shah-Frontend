"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useScrollReveal } from "@/lib/hooks/useScrollReveal";

interface GalleryItem {
  id: string;
  title: string;
  image: string;
  href: string;
}

interface RdxGalleryData {
  enabled: boolean;
  sectionTitle: string;
  items: GalleryItem[];
}

const DEFAULT_GALLERY_ITEMS: GalleryItem[] = [
  {
    id: "training",
    title: "Training",
    image: "/images/landing/rdx-gallery/9006e7dd80ecf645e78b83702112aee120de3a11.png",
    href: "/shop/training",
  },
  {
    id: "apparel",
    title: "Apparel",
    image: "/images/landing/rdx-gallery/12297c9eef97e322f7c7a0fa9318ed7d1d10ec28.png",
    href: "/shop/apparel",
  },
  {
    id: "boxing",
    title: "Boxing",
    image: "/images/landing/rdx-gallery/9126b5c957ee5df27dff7a87011a99f338fd0203.png",
    href: "/shop/boxing",
  },
  {
    id: "yoga",
    title: "Yoga",
    image: "/images/landing/rdx-gallery/09869b02227fe933f21baa27ed5b13a449885fed.png",
    href: "/shop/yoga",
  },
  {
    id: "weight-lifting",
    title: "Weight Lifting",
    image: "/images/landing/rdx-gallery/eed8082ab239304497367efe632ede29a9b94f41.png",
    href: "/shop/weight-lifting",
  },
];

export function RdxGallerySection() {
  const sectionRef = useScrollReveal();
  const [galleryData, setGalleryData] = useState<RdxGalleryData>({
    enabled: true,
    sectionTitle: "Shop From Our New RDX Gallery",
    items: DEFAULT_GALLERY_ITEMS,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchGalleryData = async () => {
      try {
        const response = await fetch("/api/admin/hero-sections");
        if (response.ok) {
          const data = await response.json();
          if (data.rdxGallerySection) {
            setGalleryData(data.rdxGallerySection);
          }
        }
      } catch (error) {
        console.error("Error fetching RDX gallery data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGalleryData();
  }, []);

  if (!galleryData.enabled || loading) {
    return null;
  }

  const items = galleryData.items.length >= 5 ? galleryData.items : DEFAULT_GALLERY_ITEMS;

  return (
    <section ref={sectionRef as React.RefObject<HTMLElement>} className="w-full bg-white py-12">
      <div className="mx-auto w-full max-w-[1400px] px-4 md:px-6">
        <h2 data-reveal className="mb-8 text-center text-3xl font-bold tracking-tight text-black md:text-4xl">
          {galleryData.sectionTitle}
        </h2>

        <div data-reveal-stagger className="grid grid-cols-1 gap-4 px-4 md:grid-cols-[2fr_1fr] md:px-0">
          {/* Left side: 2x2 grid */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-[60fr_40fr] md:grid-rows-2">
            {/* Training */}
            <div data-reveal className="gallery-item group relative block h-[280px] overflow-hidden rounded-[2px] bg-gray-100">
              <Image
                src={items[0].image}
                alt={items[0].title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105 will-change-transform"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 z-10 md:bottom-6 md:left-6">
                <h3 className="text-xl font-semibold text-white md:text-2xl">{items[0].title}</h3>
              </div>
            </div>

            {/* Apparel */}
            <div data-reveal className="gallery-item group relative block h-[280px] overflow-hidden rounded-[2px] bg-gray-100">
              <Image
                src={items[1].image}
                alt={items[1].title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105 will-change-transform"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 z-10 md:bottom-6 md:left-6">
                <h3 className="text-xl font-semibold text-white md:text-2xl">{items[1].title}</h3>
              </div>
            </div>

            {/* Yoga */}
            <div data-reveal className="gallery-item group relative block h-[280px] overflow-hidden rounded-[2px] bg-gray-100">
              <Image
                src={items[3].image}
                alt={items[3].title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105 will-change-transform"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 z-10 md:bottom-6 md:left-6">
                <h3 className="text-xl font-semibold text-white md:text-2xl">{items[3].title}</h3>
              </div>
            </div>

            {/* Weight Lifting */}
            <div data-reveal className="gallery-item group relative block h-[280px] overflow-hidden rounded-[2px] bg-gray-100">
              <Image
                src={items[4].image}
                alt={items[4].title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105 will-change-transform"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 z-10 md:bottom-6 md:left-6">
                <h3 className="text-xl font-semibold text-white md:text-2xl">{items[4].title}</h3>
              </div>
            </div>
          </div>

          {/* Boxing — tall right card */}
          <div data-reveal="right" className="gallery-item group relative block h-[280px] overflow-hidden rounded-[2px] bg-gray-100 md:h-full">
            <Image
              src={items[2].image}
              alt={items[2].title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105 will-change-transform"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 z-10 md:bottom-6 md:left-6">
              <h3 className="text-xl font-semibold text-white md:text-2xl">{items[2].title}</h3>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
