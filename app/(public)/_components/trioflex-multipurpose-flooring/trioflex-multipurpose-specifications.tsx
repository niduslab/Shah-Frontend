'use client';

export default function TrioflexMultipurposeSpecifications() {
  const specifications = [
    {
      category: 'Surface Treatment',
      specs: [
        { label: 'Coating', value: 'Glaze+ Surface Treatment' },
        { label: 'Durability', value: 'Long-lasting protection' },
        { label: 'Finish', value: 'Professional-grade' },
      ],
    },
    {
      category: 'Structure',
      specs: [
        { label: 'Grid System', value: 'DW Tech Fibreglass Grid' },
        { label: 'Backing', value: 'Double Density Closed-Cell Foam (HD Tech)' },
        { label: 'Stability', value: 'Enhanced structural support' },
      ],
    },
    {
      category: 'Dimensions',
      specs: [
        { label: 'Thickness', value: '8.0mm' },
        { label: 'Width', value: '1.8m' },
        { label: 'Length', value: '15m or 20m' },
      ],
    },
    {
      category: 'Performance',
      specs: [
        { label: 'Impact Resistance', value: 'Excellent' },
        { label: 'Indentation Resistance', value: 'High' },
        { label: 'Load Capacity', value: 'Heavy loads' },
      ],
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-[#F3EFE9]">
      <div className="container mx-auto max-w-[1400px] px-6 md:px-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
            Technical Specifications
          </h2>
          <p className="text-base text-gray-600 max-w-2xl mx-auto">
            Detailed specifications for Trioflex multipurpose flooring
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {specifications.map((spec, idx) => (
            <div
              key={idx}
              className="bg-white rounded-sm p-6 shadow-sm hover:shadow-lg transition-all duration-300"
            >
              <h3 className="text-lg font-bold text-black mb-4 pb-4 border-b border-gray-200">
                {spec.category}
              </h3>
              
              <div className="space-y-3">
                {spec.specs.map((item, itemIdx) => (
                  <div key={itemIdx}>
                    <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
                      {item.label}
                    </p>
                    <p className="text-sm text-black font-medium">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
