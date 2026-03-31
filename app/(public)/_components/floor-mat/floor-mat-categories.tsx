'use client';

import Image from 'next/image';
import { ArrowRight, Zap, Waves, Layers, MessageCircle } from 'lucide-react';

const categories = [
  {
    title: 'Rubber Roll',
    series: 'BS-2000/3000/5000/7000 series',
    bestFor: 'WEIGHT ROOMS & CARDIO AREAS',
    description: 'Enhance your gym and indoor sports facilities with premium rubber roll floor mats. Designed to provide superior cushioning, slip resistance, and durability, ensuring a safe and comfortable environment for athletes of all levels. Ideal for weight rooms, cardio areas, and multipurpose sports courts.',
    image: '/images/floor-mat-page/20190104170759677-700x307.jpg',
    features: ['Superior Cushioning', 'Slip Resistant', 'Easy to Install', 'High Traffic Ready'],
    icon: Waves,
    whatsappMessage: 'Hello! I am interested in the Rubber Roll flooring (BS-2000/3000/5000/7000 series) for my gym. Can you provide more details and a quotation?',
  },
  {
    title: 'BS Interlocking Tiles',
    series: 'BS-2000/3000/5000/7000 series',
    bestFor: 'MODULAR INSTALLATIONS',
    description: 'Transform your gym and indoor sports spaces with durable, easy-to-install tiles. Provide excellent shock absorption and slip resistance, ensuring a safe and comfortable workout environment.',
    image: '/images/floor-mat-page/20190104170811427.jpg',
    features: ['Easy Assembly', 'Shock Absorption', 'Customizable Layout', 'Durable'],
    icon: Layers,
    whatsappMessage: 'Hello! I am interested in the BS Interlocking Tiles (BS-2000/3000/5000/7000 series) for my facility. Can you provide more details and a quotation?',
  },
  {
    title: 'BS Laminated Interlocking',
    series: 'BS-2000/3000/5000/7000 series',
    bestFor: 'ANTI-FATIGUE AREAS',
    description: 'Made with two-piece construction featuring a durable recycled rubber top with foam backing for anti-fatigue purposes. Enhances shock absorption and offers superior underfoot comfort.',
    image: '/images/floor-mat-page/20190105094427558.jpg',
    features: ['Anti-Fatigue', 'Foam Backing', 'Shock Absorption', 'Comfort'],
    icon: Zap,
    whatsappMessage: 'Hello! I am interested in the BS Laminated Interlocking flooring (BS-2000/3000/5000/7000 series) for my gym. Can you provide more details and a quotation?',
  },
  {
    title: 'BS Rubber Tiles',
    series: 'BS-2000/3000/5000/7000 series',
    bestFor: 'INDOOR & OUTDOOR',
    description: 'Designed to attenuate shock and reduce injury risk. Made from recycled rubber and EPDM flecks, making them elastic, anti-slip, and durable for both indoor and outdoor applications.',
    image: '/images/floor-mat-page/20190105100110520.jpg',
    features: ['Elastic Material', 'Anti-Slip', 'Eco-Friendly', 'Versatile'],
    icon: Layers,
    whatsappMessage: 'Hello! I am interested in the BS Rubber Tiles (BS-2000/3000/5000/7000 series) for my facility. Can you provide more details and a quotation?',
  },
  {
    title: 'Treadmill Mat',
    series: 'BS-2000/3000/5000/7000 series',
    bestFor: 'CARDIO EQUIPMENT',
    description: 'Available in different sizes and thickness to fit your applications for spinning, treadmill, cross trainer and more. Provides excellent floor protection and equipment balance.',
    image: '/images/floor-mat-page/20190105102215842.jpg',
    features: ['Multiple Sizes', 'Equipment Protection', 'Noise Reduction', 'Stability'],
    icon: Waves,
    whatsappMessage: 'Hello! I am interested in the Treadmill Mat (BS-2000/3000/5000/7000 series) for my gym equipment. Can you provide more details and a quotation?',
  },
];

export default function FloorMatCategories() {
  const handleWhatsAppClick = (message: string) => {
    window.open(
      `https://web.whatsapp.com/send?phone=8801615550080&text=${encodeURIComponent(message)}`,
      '_blank'
    );
  };

  return (
    <section id="flooring-collection" className="w-full bg-gray-50 py-12 md:py-16">
      <div className="mx-auto w-full max-w-[1400px] px-4 md:px-6">
        {/* Section Header */}
        <div className="mb-10 text-center md:mb-12">
          <h2 className="mb-3 text-3xl font-bold tracking-tight text-black md:text-4xl">
            OUR FLOORING COLLECTION
          </h2>
          <p className="mx-auto max-w-2xl text-base text-gray-600 md:text-lg">
            Choose from our range of premium flooring solutions designed for every fitness environment.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <div
                key={index}
                className="group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white transition-all hover:shadow-xl hover:border-primary/50"
              >
                {/* Image */}
                <div className="relative h-[200px] w-full overflow-hidden">
                  <Image
                    src={category.image}
                    alt={category.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {/* Best For Badge */}
                  <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-black/80 backdrop-blur-sm px-3 py-1.5">
                    <Icon className="h-3.5 w-3.5 text-primary" />
                    <span className="text-xs font-semibold text-white">{category.bestFor}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-col justify-between p-5 flex-1">
                  <div>
                    <div className="mb-2 inline-block rounded-md bg-primary/10 px-2.5 py-1">
                      <span className="text-xs font-semibold text-black">{category.series}</span>
                    </div>
                    
                    <h3 className="mb-2 text-xl font-bold text-black">
                      {category.title}
                    </h3>
                    
                    <p className="mb-4 text-sm leading-relaxed text-gray-600 line-clamp-3">
                      {category.description}
                    </p>

                    {/* Features */}
                    <div className="mb-4 grid grid-cols-2 gap-2">
                      {category.features.map((feature, i) => (
                        <div key={i} className="flex items-center gap-1.5">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                          <span className="text-xs text-gray-600">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* WhatsApp Button */}
                  <button
                    onClick={() => handleWhatsAppClick(category.whatsappMessage)}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#25D366] px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-[#20BA5A] hover:shadow-lg"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Request Quotation
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
