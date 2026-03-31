'use client';

import Image from 'next/image';

export default function TrioflexMultipurposeProducts() {
  const products = [
    { id: '9134', image: '/images/flooring-solution-page/trioflex-series/multipurpose/9134-main-430x430.jpg' },
    { id: '9135', image: '/images/flooring-solution-page/trioflex-series/multipurpose/9135-main-430x430.jpg' },
    { id: '9136', image: '/images/flooring-solution-page/trioflex-series/multipurpose/9136-main-430x430.jpg' },
    { id: '9146', image: '/images/flooring-solution-page/trioflex-series/multipurpose/9146-main-430x430.jpg' },
    { id: '9183', image: '/images/flooring-solution-page/trioflex-series/multipurpose/9183-main-430x430.jpg' },
    { id: '9430', image: '/images/flooring-solution-page/trioflex-series/multipurpose/9430-main-430x430.jpg' },
    { id: '9431', image: '/images/flooring-solution-page/trioflex-series/multipurpose/9431-main-430x430.jpg' },
    { id: '9432', image: '/images/flooring-solution-page/trioflex-series/multipurpose/9432-main-430x430.jpg' },
    { id: '9433', image: '/images/flooring-solution-page/trioflex-series/multipurpose/9433-main-430x430.jpg' },
    { id: '9445', image: '/images/flooring-solution-page/trioflex-series/multipurpose/9445-main-430x430.jpg' },
    { id: '9570', image: '/images/flooring-solution-page/trioflex-series/multipurpose/9570-main-430x430.jpg' },
    { id: '9758', image: '/images/flooring-solution-page/trioflex-series/multipurpose/9758-main-430x430.jpg' },
  ];

  return (
    <section className="py-16 md:py-24 bg-[#F3EFE9]">
      <div className="container mx-auto max-w-[1400px] px-6 md:px-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
            Trioflex Multipurpose Collection
          </h2>
          <p className="text-base text-gray-600 max-w-2xl mx-auto">
            Explore our complete range of Trioflex multipurpose flooring designs
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="group relative bg-white rounded-sm overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
            >
              <div className="relative h-[180px] md:h-[220px] overflow-hidden bg-gray-100">
                <Image
                  src={product.image}
                  alt={`Trioflex ${product.id}`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              
              <div className="p-4 text-center">
                <h3 className="text-lg md:text-xl font-bold text-black">
                  {product.id}
                </h3>
                <p className="text-xs md:text-sm text-gray-600 mt-1">
                  8.0mm x 1.8m x 15m/20m
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
