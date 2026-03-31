'use client';

import { Shield, Zap, Leaf, Wrench } from 'lucide-react';

export default function TrioflexMultipurposeFeatures() {
  const features = [
    {
      icon: Shield,
      title: 'Superior Protection',
      description: 'Double density closed-cell foam backing provides exceptional cushioning and impact resistance for athlete safety',
    },
    {
      icon: Zap,
      title: 'High Performance',
      description: 'Glaze+ surface treatment and DW Tech Fibreglass grid ensure consistent performance across all sports applications',
    },
    {
      icon: Leaf,
      title: 'Eco-Friendly',
      description: 'Made from sustainable, eco-friendly raw materials without compromising on durability or performance',
    },
    {
      icon: Wrench,
      title: 'Easy Maintenance',
      description: 'Simple cleaning and maintenance procedures keep your flooring looking new for years to come',
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto max-w-[1400px] px-6 md:px-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
            Why Choose Trioflex Multipurpose
          </h2>
          <p className="text-base text-gray-600 max-w-2xl mx-auto">
            Premium features designed for professional sports facilities
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="group p-6 bg-[#F3EFE9] rounded-sm hover:shadow-lg transition-all duration-300"
              >
                <div className="mb-4">
                  <Icon className="w-8 h-8 text-[#ffb81e]" />
                </div>
                <h3 className="text-lg font-bold text-black mb-3">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-700 leading-relaxed">
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
