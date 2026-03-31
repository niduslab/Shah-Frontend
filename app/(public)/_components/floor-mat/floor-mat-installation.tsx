'use client';

import Image from 'next/image';
import { Zap, Scissors, Droplet, Clock } from 'lucide-react';

const installationSteps = [
  {
    icon: Clock,
    title: 'Quick Installation',
    description: 'Hassle-free process with convenient rolls that can be easily cut to fit any space.',
  },
  {
    icon: Scissors,
    title: 'Custom Fit Cutting',
    description: 'Flexible installation allows for quick setup, minimizing downtime and disruption.',
  },
  {
    icon: Droplet,
    title: 'Easy Cleaning',
    description: 'Regular sweeping and occasional mopping with mild detergent keeps mats clean.',
  },
  {
    icon: Zap,
    title: 'Long Lasting',
    description: 'Robust construction ensures they retain shape and functionality over time.',
  },
];

const installationImages = [
  '/images/floor-mat-page/WhatsApp-Image-2024-06-24-at-5.31.07-PM-400x267.jpeg',
  '/images/floor-mat-page/WhatsApp-Image-2024-06-24-at-5.31.07-PM-1-400x277.jpeg',
  '/images/floor-mat-page/RighInfo001278-img1.jpg',
  '/images/floor-mat-page/20190104170759677-700x307.jpg',
];

export default function FloorMatInstallation() {
  return (
    <section className="w-full bg-white py-12 md:py-16">
      <div className="mx-auto w-full max-w-[1400px] px-4 md:px-6">
        {/* Section Header */}
        <div className="mb-10 text-center md:mb-12">
          <h2 className="mb-3 text-3xl font-bold tracking-tight text-black md:text-4xl">
            HASSLE-FREE INSTALLATION
          </h2>
          <p className="mx-auto max-w-2xl text-base text-gray-600 md:text-lg">
            Installing Shah Sports' rubber floor mats is a hassle-free process. The mats come in convenient rolls that can be easily cut to fit any space. This flexibility allows for quick installation, minimizing downtime and disruption to your facility's operations.
          </p>
        </div>

        {/* Installation Steps Grid */}
        <div className="mb-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {installationSteps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={index}
                className="flex flex-col items-center rounded-lg border border-gray-200 bg-gray-50 p-6 text-center transition-all hover:border-primary hover:shadow-md"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                
                <h3 className="mb-2 text-lg font-bold text-black">
                  {step.title}
                </h3>
                
                <p className="text-sm leading-relaxed text-gray-600">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Installation Images */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {installationImages.map((image, index) => (
            <div
              key={index}
              className="group relative h-[200px] overflow-hidden rounded-lg"
            >
              <Image
                src={image}
                alt={`Installation example ${index + 1}`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-10 rounded-lg bg-blue-50 p-6 text-center">
          <p className="text-sm text-gray-700 md:text-base">
            Maintenance is equally straightforward. Regular sweeping and occasional mopping with mild detergent will keep the mats clean and looking new. Their robust construction ensures they retain their shape and functionality over time, even with heavy use.
          </p>
        </div>
      </div>
    </section>
  );
}
