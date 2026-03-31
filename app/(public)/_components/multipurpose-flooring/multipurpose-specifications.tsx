'use client';

const specifications = [
  {
    title: 'Surface Treatment',
    items: ['Glaze+ Surface Treatment', 'Enhanced performance', 'Professional finish'],
  },
  {
    title: 'Construction',
    items: ['DW Tech Fibreglass Grid', 'Double density closed-cell foam', 'HD tech backing'],
  },
  {
    title: 'Performance',
    items: ['Versatile design', 'Multiple sport compatibility', 'Superior protection'],
  },
  {
    title: 'Durability',
    items: ['Professional-grade materials', 'Long-lasting performance', 'Easy maintenance'],
  },
];

export default function MultipurposeSpecifications() {
  return (
    <section className="py-16 md:py-24 bg-[#F3EFE9]">
      <div className="container mx-auto max-w-[1400px] px-6 md:px-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-black">
            Technical Specifications
          </h2>
          <p className="text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Comprehensive details about our multipurpose flooring specifications and features.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {specifications.map((spec, idx) => (
            <div key={idx} className="bg-white rounded-sm shadow-sm p-8">
              <h3 className="text-xl font-bold mb-6 text-black pb-4 border-b-2 border-[#ffb81e]">
                {spec.title}
              </h3>
              <ul className="space-y-3">
                {spec.items.map((item, itemIdx) => (
                  <li key={itemIdx} className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-[#ffb81e] mt-2 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
