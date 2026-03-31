'use client';

import Image from 'next/image';
import { CheckCircle2 } from 'lucide-react';

export default function BasketballOverview() {
  const features = [
    'Ball rebound rate > 90%',
    'Good shock absorption',
    'Protects athletes effectively',
    'Helps retain physical strength',
    'Reduces player fatigue',
    'Professional-grade quality',
  ];

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto max-w-[1400px] px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="relative h-[350px] md:h-[450px] rounded-sm overflow-hidden shadow-lg">
            <Image
              src="/images/flooring-solution-page/joyfull/Basketball Flooring/basketball-scaled.jpg-768x384.jpg"
              alt="Basketball Flooring Overview"
              fill
              className="object-cover"
            />
          </div>

          {/* Content */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-black">
              Basketball Flooring
            </h2>
            
            <p className="text-base text-gray-600 mb-8 leading-relaxed">
              Unlike racquet sports, ball games usually require the sports flooring with high ball rebound coefficient and good shock absorption to protect athletes effectively while they playing on it. JOYFULL gives the right solution with Basketball flooring collections. Basketball floor is mainly assessed in two aspects: first, the ball rebound rate is good enough; Then, the floor should have a good shock absorption, can well protect the athletes.
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
