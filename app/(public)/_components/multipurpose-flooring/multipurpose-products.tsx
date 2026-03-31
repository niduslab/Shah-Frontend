'use client';

import Image from 'next/image';

const products = [
  {
    name: '68020-L',
    design: 'Uni',
    format: 'Rolls',
    specification: '4.5/6.0mm x 1.8m x 20m',
    image: '/images/flooring-solution-page/joyfull/𝙼𝚞𝚕𝚝𝚒𝙿𝚞𝚛𝚙𝚘𝚜𝚎 𝙵𝚕𝚘𝚘𝚛𝚒𝚗𝚐/68020-L-main-430x430.jpg',
  },
  {
    name: '68021-L',
    design: 'Uni',
    format: 'Rolls',
    specification: '4.5/6.0mm x 1.8m x 20m',
    image: '/images/flooring-solution-page/joyfull/𝙼𝚞𝚕𝚝𝚒𝙿𝚞𝚛𝚙𝚘𝚜𝚎 𝙵𝚕𝚘𝚘𝚛𝚒𝚗𝚐/68021-L-main-430x430.jpg',
  },
  {
    name: '68022-L',
    design: 'Uni',
    format: 'Rolls',
    specification: '4.5/6.0mm x 1.8m x 20m',
    image: '/images/flooring-solution-page/joyfull/𝙼𝚞𝚕𝚝𝚒𝙿𝚞𝚛𝚙𝚘𝚜𝚎 𝙵𝚕𝚘𝚘𝚛𝚒𝚗𝚐/68022-L-main-430x430.jpg',
  },
  {
    name: '68023-L',
    design: 'Uni',
    format: 'Rolls',
    specification: '4.5mm x 1.8m x 20m',
    image: '/images/flooring-solution-page/joyfull/𝙼𝚞𝚕𝚝𝚒𝙿𝚞𝚛𝚙𝚘𝚜𝚎 𝙵𝚕𝚘𝚘𝚛𝚒𝚗𝚐/68023-L-main-430x430.jpg',
  },
  {
    name: '68025-L',
    design: 'Uni',
    format: 'Rolls',
    specification: '4.5/6.0mm x 1.8m x 20m',
    image: '/images/flooring-solution-page/joyfull/𝙼𝚞𝚕𝚝𝚒𝙿𝚞𝚛𝚙𝚘𝚜𝚎 𝙵𝚕𝚘𝚘𝚛𝚒𝚗𝚐/68025-L-main-430x430.jpg',
  },
  {
    name: '68030-L',
    design: 'Uni',
    format: 'Rolls',
    specification: '4.5/6.0mm x 1.8m x 15m',
    image: '/images/flooring-solution-page/joyfull/𝙼𝚞𝚕𝚝𝚒𝙿𝚞𝚛𝚙𝚘𝚜𝚎 𝙵𝚕𝚘𝚘𝚛𝚒𝚗𝚐/68030-L-main-430x430.jpg',
  },
  {
    name: '68080-L',
    design: 'Uni',
    format: 'Rolls',
    specification: '4.5/6.0mm x 1.8m x 20m',
    image: '/images/flooring-solution-page/joyfull/𝙼𝚞𝚕𝚝𝚒𝙿𝚞𝚛𝚙𝚘𝚜𝚎 𝙵𝚕𝚘𝚘𝚛𝚒𝚗𝚐/68080-L-main-430x430.jpg',
  },
  {
    name: '68020-J',
    design: 'Uni',
    format: 'Rolls',
    specification: '4.5/8.0mm x 1.8m x 20m',
    image: '/images/flooring-solution-page/joyfull/𝙼𝚞𝚕𝚝𝚒𝙿𝚞𝚛𝚙𝚘𝚜𝚎 𝙵𝚕𝚘𝚘𝚛𝚒𝚗𝚐/68020-J-main-1-430x430.jpg',
  },
  {
    name: '68021-J',
    design: 'Uni',
    format: 'Rolls',
    specification: '4.5/8.0mm x 1.8m x 20m',
    image: '/images/flooring-solution-page/joyfull/𝙼𝚞𝚕𝚝𝚒𝙿𝚞𝚛𝚙𝚘𝚜𝚎 𝙵𝚕𝚘𝚘𝚛𝚒𝚗𝚐/68021-J-main-430x430.jpg',
  },
  {
    name: '68022-J',
    design: 'Uni',
    format: 'Rolls',
    specification: '4.5/8.0mm x 1.8m x 20m',
    image: '/images/flooring-solution-page/joyfull/𝙼𝚞𝚕𝚝𝚒𝙿𝚞𝚛𝚙𝚘𝚜𝚎 𝙵𝚕𝚘𝚘𝚛𝚒𝚗𝚐/68022-J-main-430x430.jpg',
  },
  {
    name: '68023-J',
    design: 'Uni',
    format: 'Rolls',
    specification: '4.5mm x 1.8m x 20m',
    image: '/images/flooring-solution-page/joyfull/𝙼𝚞𝚕𝚝𝚒𝙿𝚞𝚛𝚙𝚘𝚜𝚎 𝙵𝚕𝚘𝚘𝚛𝚒𝚗𝚐/68023-J-main-430x430.jpg',
  },
  {
    name: '68025-J',
    design: 'Uni',
    format: 'Rolls',
    specification: '4.5/8.0mm x 1.8m x 20m',
    image: '/images/flooring-solution-page/joyfull/𝙼𝚞𝚕𝚝𝚒𝙿𝚞𝚛𝚙𝚘𝚜𝚎 𝙵𝚕𝚘𝚘𝚛𝚒𝚗𝚐/68025-J-main-430x430.jpg',
  },
];

export default function MultipurposeProducts() {
  return (
    <section className="py-16 md:py-24 bg-[#F3EFE9]">
      <div className="container mx-auto max-w-[1400px] px-6 md:px-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-black">
            Product Range
          </h2>
          <p className="text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Choose from our versatile multipurpose flooring options, each engineered for optimal performance and durability.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
