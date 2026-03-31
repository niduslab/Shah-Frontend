'use client';

import { Shield, Zap, Heart, Volume2, Sparkles, Wrench } from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'Safety First',
    description: 'Slip-resistant surfaces prevent accidents and injuries during intense workouts.',
  },
  {
    icon: Zap,
    title: 'Superior Durability',
    description: 'High-quality rubber withstands heavy foot traffic and equipment drops.',
  },
  {
    icon: Heart,
    title: 'Optimal Comfort',
    description: 'Cushioned surfaces reduce strain on joints for a comfortable workout experience.',
  },
  {
    icon: Volume2,
    title: 'Noise Reduction',
    description: 'Proper flooring minimizes noise from equipment and footfall significantly.',
  },
  {
    icon: Sparkles,
    title: 'Easy Maintenance',
    description: 'Simple cleaning keeps your space spotless and germ-free with minimal effort.',
  },
  {
    icon: Wrench,
    title: 'Professional Look',
    description: 'Clean, professional flooring enhances the overall aesthetics of your facility.',
  },
];

export default function FloorMatFeatures() {
  return (
    <section className="w-full bg-gray-50 py-12 md:py-16">
      <div className="mx-auto w-full max-w-[1400px] px-4 md:px-6">
        {/* Section Header */}
        <div className="mb-10 text-center md:mb-12">
          <h2 className="mb-3 text-3xl font-bold tracking-tight text-black md:text-4xl">
            WHY QUALITY FLOORING MATTERS
          </h2>
          <p className="mx-auto max-w-2xl text-base text-gray-600 md:text-lg">
            The right floor mat significantly impacts safety, performance, and overall aesthetics of your facility.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group flex flex-col items-center rounded-lg border border-gray-200 bg-white p-6 text-center transition-all hover:border-primary hover:shadow-md"
              >
                <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary">
                  <Icon className="h-7 w-7 text-black transition-colors group-hover:text-white" />
                </div>
                
                <h3 className="mb-2 text-lg font-bold text-black md:text-xl">
                  {feature.title}
                </h3>
                
                <p className="text-sm leading-relaxed text-gray-600 md:text-base">
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


