'use client';

import Image from 'next/image';
import { CheckCircle2 } from 'lucide-react';

export default function MultipurposeOverview() {
  const features = [
    'Ideal for schools and training gyms',
    'Perfect for sports clubs',
    'Suitable for recreational venues',
    'Excellent durability',
    'Easy maintenance and cleaning',
    'Superior protection and safety',
  ];

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto max-w-[1400px] px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="relative h-[350px] md:h-[450px] rounded-sm overflow-hidden shadow-lg">
            <Image
              src="/images/flooring-solution-page/joyfull/𝙼𝚞𝚕𝚝𝚒𝙿𝚞𝚛𝚙𝚘𝚜𝚎 𝙵𝚕𝚘𝚘𝚛𝚒𝚗𝚐/multipurpose-scaled.jpg-768x384.jpg"
              alt="Multipurpose Flooring Overview"
              fill
              className="object-cover"
            />
          </div>

          {/* Content */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-black">
              Multi-Purpose Flooring
            </h2>
            
            <p className="text-base text-gray-600 mb-8 leading-relaxed">
              JOYFULL multi-purpose collection, which are ideal for schools, training gym, sports club, recreational venue, etc. Durability and easy maintenance couples with protection and safety will provide the best performance for your specific needs.
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
