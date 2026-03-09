'use client';

import { Plus, Trash2, Edit2, GripVertical } from 'lucide-react';

interface SectionGridProps {
  sections: any[];
  selectedSections: any[];
  onAddSection: (section: any) => void;
  onSelectSection: (section: any) => void;
  onRemoveSection: (instanceId: string) => void;
  editingSection: any;
}

export default function SectionGrid({
  sections,
  selectedSections,
  onAddSection,
  onSelectSection,
  onRemoveSection,
  editingSection
}: SectionGridProps) {
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      hero: 'bg-purple-100 text-purple-700',
      content: 'bg-blue-100 text-blue-700',
      product: 'bg-green-100 text-green-700',
      cta: 'bg-orange-100 text-orange-700',
    };
    return colors[category] || colors.content;
  };

  return (
    <div className="space-y-6">
      {/* Available Sections */}
      <div className="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-gray-200">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Available Sections</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sections.map((section) => (
            <div
              key={section.id}
              className="group relative overflow-hidden rounded-xl border-2 border-gray-200 bg-white p-4 transition-all hover:border-[#FF6F00] hover:shadow-lg cursor-pointer"
              onClick={() => onAddSection(section)}
            >
              {/* Preview Placeholder */}
              <div className="mb-3 h-32 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <div className="text-center">
                  <Plus className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-xs text-gray-500">Click to add</p>
                </div>
              </div>

              {/* Section Info */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="font-bold text-gray-900 text-sm line-clamp-1">{section.name}</h3>
                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${getCategoryColor(section.category)}`}>
                  {section.category}
                </span>
              </div>
              <p className="text-xs text-gray-600 line-clamp-2">{section.description}</p>

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-[#FF6F00]/90 opacity-0 transition-opacity group-hover:opacity-100 flex items-center justify-center">
                <div className="text-center text-white">
                  <Plus className="h-8 w-8 mx-auto mb-2" />
                  <p className="text-sm font-medium">Add Section</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Selected Sections */}
      {selectedSections.length > 0 && (
        <div className="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Your Page Sections</h2>
            <span className="text-sm text-gray-600">{selectedSections.length} sections</span>
          </div>

          <div className="space-y-3">
            {selectedSections.map((section, index) => (
              <div
                key={section.instanceId}
                className={`group relative rounded-xl border-2 p-4 transition-all cursor-pointer ${
                  editingSection?.instanceId === section.instanceId
                    ? 'border-[#FF6F00] bg-orange-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
                onClick={() => onSelectSection(section)}
              >
                <div className="flex items-start gap-3">
                  {/* Drag Handle */}
                  <div className="mt-1 text-gray-400 cursor-grab active:cursor-grabbing">
                    <GripVertical className="h-5 w-5" />
                  </div>

                  {/* Section Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="flex h-6 w-6 items-center justify-center rounded bg-gray-100 text-xs font-bold text-gray-600">
                        {index + 1}
                      </span>
                      <h3 className="font-bold text-gray-900 text-sm truncate">{section.name}</h3>
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${getCategoryColor(section.category)}`}>
                        {section.category}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 line-clamp-1">{section.description}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectSection(section);
                      }}
                      className="rounded-lg p-2 text-[#FF6F00] transition-all hover:bg-orange-50"
                      title="Edit section"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveSection(section.instanceId);
                      }}
                      className="rounded-lg p-2 text-red-600 transition-all hover:bg-red-50"
                      title="Remove section"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Active Indicator */}
                {editingSection?.instanceId === section.instanceId && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#FF6F00] rounded-l-xl" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {selectedSections.length === 0 && (
        <div className="rounded-2xl bg-white p-12 shadow-lg ring-1 ring-gray-200 text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200">
            <Plus className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No sections added yet</h3>
          <p className="text-gray-600 mb-6">Click on any section above to add it to your page</p>
        </div>
      )}
    </div>
  );
}
