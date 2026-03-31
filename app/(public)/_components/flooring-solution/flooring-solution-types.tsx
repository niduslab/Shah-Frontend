'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';

const flooringTypes = [
  {
    title: 'Gym Flooring Solutions',
    description: 'Our gym flooring options withstand heavy use and provide excellent shock absorption, reducing the risk of injury. We offer a variety of materials, including rubber, vinyl, and foam, each available in multiple thicknesses and finishes to suit different training environments.',
    features: [
      'Heavy-duty rubber flooring',
      'Excellent shock absorption',
      'Multiple thickness options',
      'Perfect for weight rooms & cardio areas',
    ],
    image: '/images/flooring-solution-page/20190107113338423 (1).jpg',
    link: '/shop?category=gym-flooring',
    badge: 'High Impact',
  },
  {
    title: 'Outdoor/Indoor Sports Flooring',
    description: 'For outdoor sports like basketball, volleyball, and multi-sport courts, our flooring solutions withstand the elements while maintaining performance. We offer modular tiles, synthetic turf, and cushioned acrylic surfaces.',
    features: [
      'Weather-resistant materials',
      'Excellent drainage system',
      'UV resistance',
      'Superior slip resistance',
    ],
    image: '/images/flooring-solution-page/20190107113339416 (1).jpg',
    link: '/shop?category=sports-flooring',
    badge: 'All Weather',
  },
  {
    title: 'Professional Table Tennis Flooring',
    description: 'Trioflex – ITTF Approved Table Tennis Flooring, trusted for professional play and certified to international standards. Joyfull – Regular Flooring, Built to International Standards.',
    features: [
      'ITTF approved options',
      'International standards',
      'Professional-grade quality',
      'Optimal ball bounce',
    ],
    image: '/images/flooring-solution-page/20190107113340446 (1).jpg',
    link: '/shop?category=table-tennis-flooring',
    badge: 'Pro Certified',
  },
];

export default function FlooringSolutionTypes() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto max-w-[1400px] px-6 md:px-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-black">
            Our Flooring Solutions
          </h2>
          <p className="text-base text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Explore our comprehensive range of high-performance flooring solutions engineered for different sports, fitness environments, and athletic needs.
          </p>
        </div>

        <div className="space-y-16">
          {flooringTypes.map((type, index) => (
            <div
              key={index}
              className={`flex flex-col gap-8 lg:gap-12 ${
                index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
              }`}
            >
              {/* Image Column */}
              <div className="lg:w-1/2">
                <div className="relative h-[350px] md:h-[400px] rounded-sm overflow-hidden group shadow-lg">
                  <Image
                    src={type.image}
                    alt={type.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  <div className="absolute top-6 left-6 bg-[#ffb81e] px-4 py-2 rounded-sm shadow-md">
                    <span className="text-xs font-bold text-black uppercase tracking-wider">{type.badge}</span>
                  </div>
                </div>
              </div>

              {/* Content Column */}
              <div className="lg:w-1/2 flex flex-col justify-center">
                <h3 className="text-2xl md:text-3xl font-bold text-black mb-4 leading-tight">
                  {type.title}
                </h3>
                
                <p className="text-gray-600 text-sm leading-relaxed mb-6">
                  {type.description}
                </p>
                
                <ul className="space-y-3">
                  {type.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <div className="h-6 w-6 rounded-sm bg-[#ffb81e] flex items-center justify-center flex-shrink-0">
                        <Check className="h-4 w-4 text-black stroke-[3]" />
                      </div>
                      <span className="text-black font-medium text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
