'use client';

import Image from 'next/image';
import { CheckCircle } from 'lucide-react';

const benefits = [
  'Slip-resistant surfaces help prevent accidents and injuries',
  'High-quality materials withstand heavy foot traffic and equipment use',
  'Cushioned surfaces reduce strain on joints for comfortable workouts',
  'Proper flooring minimizes noise from equipment and footfall',
  'Clean, professional flooring enhances the look of your facility',
  'Easy to clean and maintain for optimal hygiene',
];

const projects = [
  '/images/floor-mat-page/WhatsApp-Image-2024-06-24-at-5.31.07-PM-400x267.jpeg',
  '/images/floor-mat-page/WhatsApp-Image-2024-06-24-at-5.31.07-PM-1-400x277.jpeg',
  '/images/floor-mat-page/RighInfo001278-img1.jpg',
  '/images/floor-mat-page/20190104170759677-700x307.jpg',
  '/images/floor-mat-page/20190104170811427.jpg',
  '/images/floor-mat-page/20190105094427558.jpg',
];

export default function FloorMatBenefits() {
  return (
    <>
      {/* Benefits Section */}
      <section className="w-full bg-white py-12 md:py-16">
        <div className="mx-auto w-full max-w-[1400px] px-4 md:px-6">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-12 items-center">
            {/* Content */}
            <div className="space-y-5">
              <h2 className="text-3xl font-bold tracking-tight text-black md:text-4xl">
                WHY QUALITY FLOORING MATTERS
              </h2>
              
              <p className="text-base leading-relaxed text-gray-600 md:text-lg">
                The right floor mat significantly impacts safety, performance, and overall aesthetics of your facility.
              </p>

              <div className="space-y-3 pt-2">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex gap-3">
                    <div className="flex-shrink-0 pt-0.5">
                      <CheckCircle className="h-5 w-5 text-primary" />
                    </div>
                    <p className="text-sm text-gray-700 md:text-base">{benefit}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Image Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="relative h-[200px] overflow-hidden rounded-lg md:h-[240px]">
                <Image
                  src="/images/floor-mat-page/WhatsApp-Image-2024-06-24-at-5.31.07-PM-400x267.jpeg"
                  alt="Floor Mat Installation"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="relative h-[200px] overflow-hidden rounded-lg md:h-[240px]">
                <Image
                  src="/images/floor-mat-page/WhatsApp-Image-2024-06-24-at-5.31.07-PM-1-400x277.jpeg"
                  alt="Gym Floor Mat"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="relative h-[200px] overflow-hidden rounded-lg col-span-2 md:h-[240px]">
                <Image
                  src="/images/floor-mat-page/RighInfo001278-img1.jpg"
                  alt="Sports Facility Floor"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section className="w-full bg-gray-50 py-12 md:py-16">
        <div className="mx-auto w-full max-w-[1400px] px-4 md:px-6">
          {/* Section Header */}
          <div className="mb-10 text-center md:mb-12">
            <h2 className="mb-3 text-3xl font-bold tracking-tight text-black md:text-4xl">
              OUR PORTFOLIO
            </h2>
            <p className="mx-auto max-w-2xl text-base text-gray-600 md:text-lg">
              See how our premium flooring solutions have transformed gyms and sports facilities across Bangladesh.
            </p>
          </div>

          {/* Projects Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, index) => (
              <div
                key={index}
                className="group relative h-[250px] overflow-hidden rounded-lg"
              >
                <Image
                  src={project}
                  alt={`Completed project ${index + 1}`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/20" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
