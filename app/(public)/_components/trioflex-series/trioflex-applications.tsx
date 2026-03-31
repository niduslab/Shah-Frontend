'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const applications = [
  {
    title: 'Professional Table Tennis',
    description: 'ITTF certified flooring for professional table tennis tournaments with optimal ball bounce and player performance.',
    image: '/images/flooring-solution-page/trioflex-series/badminton-02-400x267.jpg',
    link: '/table-tennis-flooring',
  },
  {
    title: 'Competitive Badminton',
    description: 'High-performance surface designed for competitive badminton courts with superior traction and durability.',
    image: '/images/flooring-solution-page/trioflex-series/badminton-02-400x267.jpg',
    link: '/badminton-flooring',
  },
  {
    title: 'Professional Basketball',
    description: 'Professional basketball court flooring with excellent shock absorption and tournament-grade performance.',
    image: '/images/flooring-solution-page/trioflex-series/multipurpose-2-700x350.jpg',
    link: '/basketball-flooring',
  },
  {
    title: 'Multi-Sport Venues',
    description: 'Versatile high-end flooring solution suitable for multiple professional sports and competitive events.',
    image: '/images/flooring-solution-page/trioflex-series/multipurpose-2-700x350.jpg',
    link: '/multipurpose-flooring',
  },
];

export default function TrioflexApplications() {
  return (
    <section className="py-16 md:py-24 bg-[#F3EFE9]">
      <div className="container mx-auto max-w-[1400px] px-6 md:px-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-black">
            Professional Applications
          </h2>
          <p className="text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Trioflex Series flooring is engineered for professional sports facilities and competitive tournaments.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {applications.map((app, idx) => (
            <Link
              key={idx}
              href={app.link}
              className="group bg-white rounded-sm shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
            >
              <div className="relative h-[200px] overflow-hidden">
                <Image
                  src={app.image}
                  alt={app.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-black group-hover:text-[#ffb81e] transition-colors">
                  {app.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-4">
                  {app.description}
                </p>
                <div className="flex items-center gap-2 text-[#ffb81e] font-semibold text-sm">
                  Learn More
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
