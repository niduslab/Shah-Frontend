'use client';

import { useState } from 'react';
import { FileText, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import PageTypeCard from './_components/PageTypeCard';

export default function PageTemplatesPage() {
  const router = useRouter();

  const pageTypes = [
    {
      id: 'landing',
      name: 'Landing Page',
      description: 'Create homepage and marketing campaign pages with hero sections, product grids, and CTAs',
      icon: '🏠',
      color: 'from-blue-500 to-blue-600',
      sections: 3,
      examples: ['Homepage', 'Summer Sale', 'Black Friday']
    },
    {
      id: 'brand',
      name: 'Brand Page',
      description: 'Showcase brand stories, products, and categories with rich content sections',
      icon: '🏷️',
      color: 'from-purple-500 to-purple-600',
      sections: 5,
      examples: ['NordicTrack', 'Peloton', 'ProForm']
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF6F00] to-[#E65100] shadow-lg shadow-orange-500/30 shrink-0">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Page Builder</h1>
                <p className="text-sm text-gray-600">Choose a page type to start building</p>
              </div>
            </div>

            <button
              onClick={() => router.push('/admin/pages')}
              className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border-2 border-[#FF6F00] bg-white px-5 py-2.5 text-sm font-medium text-[#FF6F00] transition-all hover:bg-[#FF6F00] hover:text-white"
            >
              <FileText className="h-4 w-4" />
              Manage Pages
            </button>
          </div>
        </div>

        {/* Page Types Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pageTypes.map((pageType) => (
            <PageTypeCard
              key={pageType.id}
              pageType={pageType}
              onClick={() => router.push(`/admin/page-templates/${pageType.id}`)}
            />
          ))}
        </div>

        {/* Info Section */}
        <div className="mt-8 rounded-2xl bg-white p-6 shadow-lg ring-1 ring-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">How it works</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600 font-bold flex-shrink-0">
                1
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Choose Page Type</h4>
                <p className="text-sm text-gray-600">Select Landing or Brand page template</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 text-purple-600 font-bold flex-shrink-0">
                2
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Build Sections</h4>
                <p className="text-sm text-gray-600">Add and customize sections with visual editor</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 text-green-600 font-bold flex-shrink-0">
                3
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Publish Page</h4>
                <p className="text-sm text-gray-600">Preview and publish your page live</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
