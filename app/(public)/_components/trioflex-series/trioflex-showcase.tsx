'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const showcaseItems = [
  {
    title: 'MULTIPURPOSE',
    image: '/images/flooring-solution-page/trioflex-series/multipurpose-2-700x350.jpg',
    link: '/trioflex-multipurpose-flooring',
  },
  {
    title: 'TABLE TENNIS',
    image: '/images/flooring-solution-page/trioflex-series/badminton-02-400x267.jpg',
    link: '/table-tennis-flooring',
  },
  {
    title: 'BADMINTON',
    image: '/images/flooring-solution-page/trioflex-series/badminton-02-400x267.jpg',
    link: '/badminton-flooring',
  },
];

export default function TrioflexShowcase() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto max-w-[1400px] px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {showcaseItems.map((item, idx) => (
            <div
              key={idx}
              className="group relative h-[250px] md:h-[300px] overflow-hidden rounded-sm shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
              
              <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col justify-between h-full">
                <div />
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-white tracking-wider mb-4">
                    {item.title}
                  </h3>
                  <Link
                    href={item.link}
                    className="group/btn inline-flex h-10 items-center justify-center gap-2 rounded-sm bg-[#ffb81e] px-6 text-sm font-semibold text-black transition-all hover:bg-[#ffb81e]/90"
                  >
                    View
                    <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
