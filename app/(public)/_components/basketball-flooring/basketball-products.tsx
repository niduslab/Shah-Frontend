'use client';

import Image from 'next/image';

const products = [
  {
    name: '88010',
    design: 'Wood',
    format: 'Rolls',
    specification: '4.5/6.0/8.0mm x 1.8m x 15m/20m',
    image: '/images/flooring-solution-page/joyfull/Basketball Flooring/88010-main-img-430x430.jpg',
  },
  {
    name: '88011',
    design: 'Wood',
    format: 'Rolls',
    specification: '4.5mm x 1.8m x 20m',
    image: '/images/flooring-solution-page/joyfull/Basketball Flooring/88011-main-img-430x430.jpg',
  },
  {
    name: '88017',
    design: 'Wood',
    format: 'Rolls',
    specification: '4.5/6.0mm x 1.8m x 15m/20m',
    image: '/images/flooring-solution-page/joyfull/Basketball Flooring/88017-main-img-430x430.jpg',
  },
  {
    name: '88018',
    design: 'Wood',
    format: 'Rolls',
    specification: '4.5mm x 1.8m x 20m',
    image: '/images/flooring-solution-page/joyfull/Basketball Flooring/88018-main-img-430x430.jpg',
  },
  {
    name: '88019',
    design: 'Wood',
    format: 'Rolls',
    specification: '4.5/6.0/8.0mm x 1.8m x 20m',
    image: '/images/flooring-solution-page/joyfull/Basketball Flooring/88019-main-img-430x430.jpg',
  },
];

export default function BasketballProducts() {
  return (
    <section className="py-16 md:py-24 bg-[#F3EFE9]">
      <div className="container mx-auto max-w-[1400px] px-6 md:px-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-black">
            Product Range
          </h2>
          <p className="text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Choose from our professional basketball flooring options, each engineered for optimal performance and durability.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {products.map((product, idx) => (
            <div key={idx} className="bg-white rounded-sm shadow-sm hover:shadow-lg transition-shadow overflow-hidden">
              <div className="relative h-[220px] overflow-hidden bg-gray-100">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-4 text-black">
                  {product.name}
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Design:</span>
                    <span className="font-semibold text-black">{product.design}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Format:</span>
                    <span className="font-semibold text-black">{product.format}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Specification:</span>
                    <span className="font-semibold text-black text-xs">{product.specification}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
