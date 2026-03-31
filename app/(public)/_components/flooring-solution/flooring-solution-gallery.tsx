'use client';

import Image from 'next/image';
import { useState } from 'react';
import { ZoomIn, X } from 'lucide-react';

const galleryImages = [
  {
    src: '/images/flooring-solution-page/20190107113341666 (2).jpg',
    alt: 'Professional gym flooring installation',
  },
  {
    src: '/images/flooring-solution-page/20190107113342856 (1).jpg',
    alt: 'Sports court flooring',
  },
  {
    src: '/images/flooring-solution-page/20190107113343856 (1).jpg',
    alt: 'Indoor sports flooring',
  },
  {
    src: '/images/flooring-solution-page/2 (1).jpg',
    alt: 'Outdoor sports surface',
  },
  {
    src: '/images/flooring-solution-page/gallery01.jpg-700x466.jpg',
    alt: 'Fitness center flooring',
  },
  {
    src: '/images/flooring-solution-page/gallery532-700x466.jpg',
    alt: 'Multi-purpose sports flooring',
  },
];

export default function FlooringSolutionGallery() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto max-w-[1400px] px-6 md:px-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-black">
            Our Projects Gallery
          </h2>
          <p className="text-base text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Explore our successfully completed premium flooring installations across various high-end sports facilities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryImages.map((image, index) => (
            <div
              key={index}
              className="group relative h-[280px] overflow-hidden rounded-sm cursor-pointer shadow-sm hover:shadow-lg transition-all duration-300"
              onClick={() => setSelectedImage(index)}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="bg-[#ffb81e] text-black p-3 rounded-sm">
                  <ZoomIn className="w-5 h-5" />
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <p className="text-white font-semibold text-sm">{image.alt}</p>
              </div>
            </div>
          ))}
        </div>

        {selectedImage !== null && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 md:p-8 backdrop-blur-sm transition-all"
            onClick={() => setSelectedImage(null)}
          >
            <div className="relative w-full h-full max-w-6xl max-h-[85vh] flex items-center justify-center">
              <Image
                src={galleryImages[selectedImage].src}
                alt={galleryImages[selectedImage].alt}
                fill
                className="object-contain"
                sizes="100vw"
                priority
              />
              <button
                className="absolute top-4 right-4 md:-top-4 md:-right-4 h-12 w-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-yellow-400 hover:text-black text-white transition-colors duration-300"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImage(null);
                }}
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
