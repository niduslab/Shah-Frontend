'use client';

import { CheckCircle2 } from 'lucide-react';

export default function TrioflexMultipurposeOverview() {
  const highlights = [
    'Eco-friendly raw material',
    'Double density closed-cell foam technology',
    'Superior safety and protection',
    'Ideal for multiple sports applications',
    'Easy maintenance and durability',
    'Professional-grade performance',
  ];

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto max-w-[1400px] px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-6 leading-tight">
              Premium Trioflex Multipurpose Flooring
            </h2>
            
            <p className="text-base text-gray-700 mb-8 leading-relaxed">
              TRIOFLEX has a multi-purpose collection, which are ideal for schools, training gyms, sports clubs, recreational venues, and more. Durability and easy maintenance coupled with protection and safety will provide the best performance for your specific needs.
            </p>

            <div className="space-y-3">
              {highlights.map((highlight, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#ffb81e] flex-shrink-0 mt-0.5" />
                  <span className="text-base text-gray-700">{highlight}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - Key Features */}
          <div className="bg-[#F3EFE9] rounded-sm p-8 md:p-12">
            <h3 className="text-2xl font-bold text-black mb-8">Key Technologies</h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-bold text-black mb-2">Glaze+ Surface Treatment</h4>
                <p className="text-sm text-gray-700">Advanced surface coating for enhanced durability and performance</p>
              </div>
              
              <div>
                <h4 className="text-lg font-bold text-black mb-2">DW Tech Fibreglass Grid</h4>
                <p className="text-sm text-gray-700">Reinforced structure for superior stability and support</p>
              </div>
              
              <div>
                <h4 className="text-lg font-bold text-black mb-2">Double Density Closed-Cell Foam Backing (HD Tech)</h4>
                <p className="text-sm text-gray-700">Provides exceptional cushioning, impact resistance, and protection</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
