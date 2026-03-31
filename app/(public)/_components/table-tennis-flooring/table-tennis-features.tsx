'use client';

import { Zap, Shield, Award, Layers } from 'lucide-react';

const features = [
  {
    icon: Zap,
    title: 'Glaze+ Surface Treatment',
    description: 'Advanced surface treatment for superior grip and performance characteristics.',
  },
  {
    icon: Layers,
    title: 'DW Tech Fibreglass Grid',
    description: 'Reinforced fibreglass grid for enhanced durability and stability.',
  },
  {
    icon: Shield,
    title: 'Double Density Foam Backing',
    description: 'HD tech closed-cell foam provides excellent shock absorption and comfort.',
  },
  {
    icon: Award,
    title: 'ITTF Certified',
    description: 'Meets all international standards for professional table tennis competition.',
  },
];

export default function TableTennisFeatures() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto max-w-[1400px] px-6 md:px-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-black">
            Advanced Technology
          </h2>
          <p className="text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Our table tennis flooring features cutting-edge technology for professional performance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-[#F3EFE9] p-8 rounded-sm"
              >
                <div className="bg-white w-12 h-12 rounded-lg flex items-center justify-center mb-6 shadow-sm">
                  <Icon className="h-6 w-6 text-black" />
                </div>
                
                <h3 className="text-xl font-bold mb-3 text-black">
                  {feature.title}
                </h3>
                
                <p className="text-gray-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
