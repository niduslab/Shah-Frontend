'use client';

import Image from 'next/image';
import { CheckCircle2 } from 'lucide-react';

export default function JoyfullOverview() {
  const features = [
    'Built to international standards',
    'High cost performance',
    'High flexibility for various sports',
    'Superior durability and reliability',
    'Professional-grade quality',
    'Optimal athletic performance',
  ];

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto max-w-[1400px] px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="relative h-[350px] md:h-[450px] rounded-sm overflow-hidden shadow-lg">
            <Image
              src="/images/flooring-solution-page/joyfull/table-tennis-1-400x270.jpg"
              alt="Joyfull Series Overview"
              fill
              className="object-cover"
            />
          </div>

          {/* Content */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-black">
              About Joyfull Series
            </h2>
            
            <p className="text-base text-gray-600 mb-8 leading-relaxed">
              Joyfull is an all-new series concentrating on the sports experience of athletes. The high cost performance and high flexibility offer more choices and conveniences to customers. Designed for professional indoor sports facilities with international standards compliance.
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
