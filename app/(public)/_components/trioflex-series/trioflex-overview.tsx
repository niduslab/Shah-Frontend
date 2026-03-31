'use client';

import Image from 'next/image';
import { CheckCircle2 } from 'lucide-react';

export default function TrioflexOverview() {
  const features = [
    'ITTF approved and certified',
    'High-end professional grade',
    'Purpose-built for high performance',
    'Superior ball bounce characteristics',
    'Excellent shock absorption',
    'Professional tournament standard',
  ];

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto max-w-[1400px] px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="relative h-[350px] md:h-[450px] rounded-sm overflow-hidden shadow-lg">
            <Image
              src="/images/flooring-solution-page/trioflex-series/20230516162457.png-ezgif.com-resize.jpg"
              alt="Trioflex Series Overview"
              fill
              className="object-cover"
            />
          </div>

          {/* Content */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-black">
              About Trioflex Series
            </h2>
            
            <p className="text-base text-gray-600 mb-8 leading-relaxed">
              TRIOFLEX Series is high-end line of indoor sports flooring which is purpose built to meet the requirement of high performance indoor sports flooring. Engineered for professional athletes and competitive tournaments with international standards compliance.
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
