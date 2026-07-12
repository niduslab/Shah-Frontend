'use client';

import { ArrowRight, Layers } from 'lucide-react';

interface PageTypeCardProps {
  pageType: {
    id: string;
    name: string;
    description: string;
    icon: string;
    color: string;
    sections: number;
    examples: string[];
  };
  onClick: () => void;
}

export default function PageTypeCard({ pageType, onClick }: PageTypeCardProps) {
  return (
    <div
      onClick={onClick}
      className="group relative overflow-hidden rounded-2xl bg-white p-4 sm:p-6 lg:p-8 shadow-lg ring-1 ring-gray-200 transition-all hover:shadow-2xl hover:ring-[#FF6F00]/30 cursor-pointer"
    >
      {/* Background Gradient */}
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${pageType.color} opacity-10 rounded-full blur-3xl transition-all group-hover:opacity-20 group-hover:scale-150`} />
      
      {/* Content */}
      <div className="relative">
        {/* Icon */}
        <div className="mb-4 flex items-center gap-3">
          <div className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${pageType.color} shadow-lg text-3xl`}>
            {pageType.icon}
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 group-hover:bg-[#FF6F00]/10 transition-colors">
            <Layers className="h-5 w-5 text-gray-600 group-hover:text-[#FF6F00] transition-colors" />
          </div>
        </div>

        {/* Title & Description */}
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{pageType.name}</h3>
        <p className="text-gray-600 mb-6">{pageType.description}</p>

        {/* Stats */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100">
              <span className="text-sm font-bold text-blue-600">{pageType.sections}</span>
            </div>
            <span className="text-sm text-gray-600">Sections</span>
          </div>
        </div>

        {/* Examples */}
        <div className="mb-6">
          <p className="text-xs font-medium text-gray-500 mb-2">EXAMPLES</p>
          <div className="flex flex-wrap gap-2">
            {pageType.examples.map((example, index) => (
              <span
                key={index}
                className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700"
              >
                {example}
              </span>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <span className="text-sm font-medium text-gray-600">Start Building</span>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#FF6F00] text-white transition-all group-hover:bg-[#E65100] group-hover:scale-110">
            <ArrowRight className="h-5 w-5" />
          </div>
        </div>
      </div>
    </div>
  );
}
