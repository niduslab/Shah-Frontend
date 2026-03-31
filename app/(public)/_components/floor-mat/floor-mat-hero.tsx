'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Shield, Zap, Heart, CheckCircle } from 'lucide-react';

export default function FloorMatHero() {
  return (
    <section className="relative w-full overflow-hidden bg-white">
      <div className="mx-auto w-full max-w-[1400px] px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6 lg:space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2">
                <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                <span className="text-sm font-semibold text-black">
                  Premium Gym Flooring Solutions
                </span>
              </div>
              
              <h1 className="text-4xl font-bold text-black sm:text-5xl lg:text-6xl leading-tight">
                FLOOR MAT
              </h1>
              
              <p className="text-lg text-gray-600 leading-relaxed max-w-xl">
                Transform your gym and sports facility with Shah Sports' premium rubber floor mats — engineered for safety, durability, and peak performance.
              </p>
            </div>

            {/* Key Features */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Shield, text: 'Superior Cushioning' },
                { icon: Zap, text: 'Slip Resistant' },
                { icon: Heart, text: 'Easy to Install' },
                { icon: CheckCircle, text: 'High Traffic Ready' },
              ].map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">{feature.text}</span>
                  </div>
                );
              })}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                href="#flooring-collection"
                className="inline-flex h-12 items-center gap-2 rounded-lg bg-black px-8 text-[16px] font-semibold text-white transition-all hover:bg-black/90 hover:shadow-lg"
              >
                Get a Quote <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex h-12 items-center gap-2 rounded-lg border-2 border-gray-300 bg-white px-8 text-[16px] font-semibold text-black transition-all hover:border-black hover:bg-gray-50"
              >
                Contact Us
              </Link>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-2xl">
              <Image
                src="/images/floor-mat-page/20190105095355589-1.jpg"
                alt="Premium Rubber Floor Mats"
                fill
                className="object-cover"
                priority
              />
              {/* Overlay Badge */}
              <div className="absolute bottom-6 left-6 right-6 rounded-xl bg-white/95 backdrop-blur-sm p-4 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Trusted by</p>
                    <p className="text-2xl font-bold text-black">500+ Facilities</p>
                  </div>
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-10 w-10 rounded-full border-2 border-white bg-primary/20 flex items-center justify-center">
                        <CheckCircle className="h-5 w-5 text-primary" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Decorative Elements */}
            <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-primary/10 blur-2xl -z-10" />
            <div className="absolute -bottom-4 -left-4 h-32 w-32 rounded-full bg-primary/10 blur-2xl -z-10" />
          </div>
        </div>
      </div>
    </section>
  );
}
