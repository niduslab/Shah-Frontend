'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

const flooringSeries = [
  {
    title: 'JOYFULL SERIES',
    subtitle: 'Regular Flooring',
    description: 'Built to International Standards for professional indoor sports facilities. Delivering optimal performance, safety, and durability for all athletes.',
    image: '/images/flooring-solution-page/20190107113339416 (1).jpg',
    color: 'cyan',
    link: '/joyfull-series',
    features: ['International Standards', 'Professional Indoor', 'Optimal Performance'],
  },
  {
    title: 'TRIOFLEX SERIES',
    subtitle: 'ITTF Approved',
    description: 'Table Tennis Flooring trusted for professional play and certified to international standards. Experience the ultimate grip and perfect ball bounce.',
    image: '/images/flooring-solution-page/20190107113340446 (1).jpg',
    color: 'yellow',
    link: '/trioflex-series',
    features: ['ITTF Certified', 'Perfect Ball Bounce', 'Ultimate Grip'],
  },
];

export default function FlooringSolutionSeries() {
  return (
    <section className="py-16 md:py-24 bg-[#F3EFE9]">
      <div className="container mx-auto max-w-[1400px] px-6 md:px-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-black">
            Our Premium Flooring Series
          </h2>
          <p className="text-base text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover our internationally certified flooring series, engineered for professional sports facilities and peak athletic performance.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {flooringSeries.map((series, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-sm overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
            >
              {/* Image Section */}
              <div className="relative h-[280px] overflow-hidden">
                <Image
                  src={series.image}
                  alt={series.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                
                <div className="absolute top-6 left-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-sm bg-white/90 backdrop-blur-sm">
                  <span className={`w-1.5 h-1.5 rounded-full ${series.color === 'cyan' ? 'bg-cyan-500' : 'bg-yellow-500'} animate-pulse`} />
                  <span className="text-xs font-bold text-black tracking-wide uppercase">
                    {series.subtitle}
                  </span>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-8">
                <h3 className="text-2xl font-bold text-black mb-3">
                  {series.title}
                </h3>
                
                <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                  {series.description}
                </p>

                <div className="space-y-2 mb-6">
                  {series.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#ffb81e] flex-shrink-0" />
                      <span className="text-black font-medium text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                <Link
                  href={series.link}
                  className="group/btn inline-flex h-12 items-center justify-center gap-2 rounded-sm bg-black px-6 text-sm font-semibold text-white transition-all hover:bg-[#ffb81e] hover:text-black"
                >
                  View {series.title.split(' ')[0]}
                  <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
