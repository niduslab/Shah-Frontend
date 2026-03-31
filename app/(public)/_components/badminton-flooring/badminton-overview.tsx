'use client';

import Image from 'next/image';
import { CheckCircle2 } from 'lucide-react';

export default function BadmintonOverview() {
  const features = [
    'Higher coefficient of friction in every direction',
    'Good grip to avoid skidding and slipping',
    'Good shock absorption',
    'Reduce long-term impact and injury to knees',
    'Balance between grip and slip',
    'Professional-grade quality',
  ];

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto max-w-[1400px] px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="relative h-[350px] md:h-[450px] rounded-sm overflow-hidden shadow-lg">
            <Image
              src="/images/flooring-solution-page/joyfull/badminton/badminton-flooring-scaled-1-768x384.jpg"
              alt="Badminton Flooring Overview"
              fill
              className="object-cover"
            />
          </div>

          {/* Content */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-black">
              Badminton Flooring
            </h2>
            
            <p className="text-base text-gray-600 mb-8 leading-relaxed">
              Racquet sports, mainly badminton, require the floor to find a balance between grip and slip, allowing players to perform better in frequent acceleration and direction changes. JOYFULL gives the right answers. JOYFULL Badminton flooring provides a better grip when sliding.
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
