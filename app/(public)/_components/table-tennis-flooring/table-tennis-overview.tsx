'use client';

import Image from 'next/image';
import { CheckCircle2 } from 'lucide-react';

export default function TableTennisOverview() {
  const features = [
    'ITTF Certified and approved',
    'Superior grip and slide balance',
    'Optimal ball bounce characteristics',
    'Double density closed-cell foam backing',
    'Excellent shock absorption',
    'Professional-grade quality',
  ];

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto max-w-[1400px] px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="relative h-[350px] md:h-[450px] rounded-sm overflow-hidden shadow-lg">
            <Image
              src="/images/flooring-solution-page/joyfull/table-tennis/table-tennis-flooring-scaled-1-768x384.jpg"
              alt="Table Tennis Flooring Overview"
              fill
              className="object-cover"
            />
          </div>

          {/* Content */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-black">
              ITTF Certified Excellence
            </h2>
            
            <p className="text-base text-gray-600 mb-8 leading-relaxed">
              Racquet sports, mainly table tennis, require the floor to find a balance between grip and slip, allowing players to perform better in frequent acceleration and direction changes. Our ITTF certified table tennis flooring provides the right answers with superior grip when sliding and excellent shock absorption.
            </p>

            <div className="space-y-3">
              {features.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#ffb81e] flex-shrink-0" />
                  <span className="text-black font-medium text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
