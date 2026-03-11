'use client';

import { Eye, Copy, Info } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ReactElement } from 'react';

interface TemplateCardProps {
  template: any;
  onPreview: (template: any) => void;
  getCategoryBadge: (category: string) => ReactElement;
}

export default function TemplateCard({ template, onPreview, getCategoryBadge }: TemplateCardProps) {
  const router = useRouter();

  const handleUseTemplate = () => {
    // Store template in session storage for use in page creation
    sessionStorage.setItem('selectedTemplate', JSON.stringify(template));
    router.push('/admin/dynamic-pages?action=create&template=' + template.id);
    toast.success('Template selected', {
      description: 'Create a new page to use this template'
    });
  };

  const getPageTypeBadges = (pageTypes: string[]) => {
    if (!pageTypes || pageTypes.length === 0) return null;
    
    const colors: Record<string, string> = {
      landing: 'bg-blue-50 text-blue-700',
      brand: 'bg-purple-50 text-purple-700',
      flash_deal: 'bg-orange-50 text-orange-700',
      gallery: 'bg-teal-50 text-teal-700',
      custom: 'bg-gray-50 text-gray-700',
    };

    return (
      <div className="flex flex-wrap gap-1">
        {pageTypes.map((type) => (
          <span
            key={type}
            className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium ${colors[type] || colors.custom}`}
          >
            {type.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white transition-all hover:shadow-xl hover:border-[#FF6F00]/30">
      {/* Template Preview Image/Placeholder */}
      <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
        {template.preview_image ? (
          <img
            src={template.preview_image}
            alt={template.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <div className="mb-2 inline-flex h-16 w-16 items-center justify-center rounded-xl bg-white shadow-lg">
                <Info className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-sm font-medium text-gray-500">{template.name}</p>
            </div>
          </div>
        )}
        
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100">
          <div className="absolute bottom-4 left-4 right-4 flex gap-2">
            <button
              onClick={() => onPreview(template)}
              className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-white/90 backdrop-blur-sm px-4 py-2 text-sm font-medium text-gray-900 transition-all hover:bg-white"
            >
              <Eye className="h-4 w-4" />
              Preview
            </button>
            <button
              onClick={handleUseTemplate}
              className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-[#FF6F00] px-4 py-2 text-sm font-medium text-white transition-all hover:bg-[#E65100]"
            >
              <Copy className="h-4 w-4" />
              Use
            </button>
          </div>
        </div>
      </div>

      {/* Template Info */}
      <div className="p-4">
        <div className="mb-2 flex items-start justify-between gap-2">
          <h3 className="font-bold text-gray-900 line-clamp-1">{template.name}</h3>
          {getCategoryBadge(template.category)}
        </div>

        <p className="mb-3 text-sm text-gray-600 line-clamp-2">
          {template.description}
        </p>

        {/* Page Types */}
        {template.page_types && template.page_types.length > 0 && (
          <div className="mb-3">
            <p className="mb-1 text-xs font-medium text-gray-500">Compatible with:</p>
            {getPageTypeBadges(template.page_types)}
          </div>
        )}

        {/* Schema Info */}
        {template.schema && (
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <span className="font-medium">
                {Object.keys(template.schema.content || {}).length}
              </span>
              content fields
            </span>
            {template.schema.settings && (
              <span className="flex items-center gap-1">
                <span className="font-medium">
                  {Object.keys(template.schema.settings || {}).length}
                </span>
                settings
              </span>
            )}
          </div>
        )}
      </div>

      {/* Featured Badge */}
      {template.featured && (
        <div className="absolute top-3 right-3">
          <span className="inline-flex items-center gap-1 rounded-full bg-yellow-400 px-2.5 py-1 text-xs font-bold text-gray-900 shadow-lg">
            ⭐ Featured
          </span>
        </div>
      )}
    </div>
  );
}
