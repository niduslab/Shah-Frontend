'use client';

import { useState } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'sonner';
import SectionGrid from '@/app/admin/page-templates/_components/SectionGrid';
import SectionEditor from '@/app/admin/page-templates/_components/SectionEditor';
import { useCreatePage, useCreateSection } from '@/lib/hooks/admin/useDynamicPages';

// Define section templates for each page type
const LANDING_SECTIONS = [
  {
    id: 'landing_hero_grid',
    name: 'Hero Grid (4 Sections)',
    description: '1 large hero + 3 small cards with CTAs',
    category: 'hero',
    preview: '/images/sections/landing-hero-grid.png'
  },
  {
    id: 'category_cards_two_column',
    name: 'Category Cards',
    description: 'Two large category cards side-by-side',
    category: 'content',
    preview: '/images/sections/category-cards.png'
  },
  {
    id: 'preorder_showcase',
    name: 'Pre-Order Showcase',
    description: 'Product grid with badges and carousel',
    category: 'product',
    preview: '/images/sections/preorder-showcase.png'
  }
];

const BRAND_SECTIONS = [
  {
    id: 'brand_full_width_cta',
    name: 'Full Width CTA Banner',
    description: 'Hero banner with brand story',
    category: 'hero',
    preview: '/images/sections/brand-cta.png'
  },
  {
    id: 'brand_category_grid',
    name: 'Category Grid',
    description: 'Equipment categories on dark background',
    category: 'content',
    preview: '/images/sections/brand-categories.png'
  },
  {
    id: 'brand_featured_products',
    name: 'Featured Products',
    description: 'Two large product cards with badges',
    category: 'product',
    preview: '/images/sections/brand-products.png'
  },
  {
    id: 'brand_content_with_images',
    name: 'Content with Images',
    description: 'Brand story with stats and image collage',
    category: 'content',
    preview: '/images/sections/brand-content.png'
  },
  {
    id: 'brand_product_hero',
    name: 'Product Hero',
    description: 'Side-by-side product showcase',
    category: 'product',
    preview: '/images/sections/brand-hero.png'
  }
];

export default function PageBuilderPage() {
  const router = useRouter();
  const params = useParams();
  const pageType = params?.type as string;

  const [selectedSections, setSelectedSections] = useState<any[]>([]);
  const [editingSection, setEditingSection] = useState<any>(null);
  const [pageTitle, setPageTitle] = useState('');
  const [pageSlug, setPageSlug] = useState('');

  // Mutations
  const createPageMutation = useCreatePage();
  const createSectionMutation = useCreateSection();

  // Get sections based on page type
  const availableSections = pageType === 'landing' ? LANDING_SECTIONS : BRAND_SECTIONS;
  const pageTypeName = pageType === 'landing' ? 'Landing Page' : 'Brand Page';

  const handleAddSection = (section: any) => {
    const newSection = {
      ...section,
      instanceId: `${section.id}_${Date.now()}`,
      content: {},
      settings: {},
      sort_order: selectedSections.length + 1
    };
    setSelectedSections([...selectedSections, newSection]);
    setEditingSection(newSection);
    toast.success('Section added', {
      description: `${section.name} has been added to your page`
    });
  };

  const handleUpdateSection = (instanceId: string, content: any, settings: any) => {
    setSelectedSections(selectedSections.map(s =>
      s.instanceId === instanceId ? { ...s, content, settings } : s
    ));
  };

  const handleRemoveSection = (instanceId: string) => {
    setSelectedSections(selectedSections.filter(s => s.instanceId !== instanceId));
    if (editingSection?.instanceId === instanceId) {
      setEditingSection(null);
    }
    toast.success('Section removed');
  };

  const handleSavePage = async () => {
    if (!pageTitle || !pageSlug) {
      toast.error('Please fill in page title and slug');
      return;
    }

    if (selectedSections.length === 0) {
      toast.error('Please add at least one section');
      return;
    }

    try {
      // Create the page
      const pageData = await createPageMutation.mutateAsync({
        title: pageTitle,
        slug: pageSlug,
        type: pageType as 'landing' | 'brand' | 'flash_deal' | 'gallery' | 'custom',
        is_active: true,
        sort_order: 0
      });

      // Extract page ID from response
      const pageId = pageData?.id || pageData?.data?.id;

      if (!pageId) {
        throw new Error('Page ID not returned from API');
      }

      // Create sections
      for (let i = 0; i < selectedSections.length; i++) {
        const section = selectedSections[i];
        await createSectionMutation.mutateAsync({
          pageId,
          data: {
            section_type: section.id,
            title: section.name,
            content: section.content || {},
            settings: section.settings || {},
            sort_order: i + 1,
            is_active: true
          }
        });
      }

      toast.success('Page saved successfully!', {
        description: `Your ${pageTypeName.toLowerCase()} has been created`
      });
      
      // Redirect to page templates
      setTimeout(() => {
        router.push('/admin/page-templates');
      }, 1500);
    } catch (error) {
      console.error('Error saving page:', error);
      toast.error('Failed to save page', {
        description: error instanceof Error ? error.message : 'Please try again or check the console for errors'
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto max-w-[1800px] px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/admin/page-templates')}
                className="flex items-center gap-2 text-sm text-gray-600 transition-colors hover:text-gray-900"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>
              <div className="h-8 w-px bg-gray-300" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">{pageTypeName} Builder</h1>
                <p className="text-sm text-gray-600">{selectedSections.length} sections added</p>
              </div>
            </div>

            <button
              onClick={handleSavePage}
              disabled={createPageMutation.isPending || createSectionMutation.isPending}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#FF6F00] to-[#E65100] px-6 py-2.5 text-sm font-medium text-white shadow-lg shadow-orange-500/30 transition-all hover:shadow-xl hover:shadow-orange-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="h-4 w-4" />
              {createPageMutation.isPending || createSectionMutation.isPending ? 'Saving...' : 'Save Page'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-[1800px] p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Section Grid */}
          <div className="lg:col-span-2">
            <SectionGrid
              sections={availableSections}
              selectedSections={selectedSections}
              onAddSection={handleAddSection}
              onSelectSection={setEditingSection}
              onRemoveSection={handleRemoveSection}
              editingSection={editingSection}
            />
          </div>

          {/* Right: Section Editor */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <SectionEditor
                section={editingSection}
                pageTitle={pageTitle}
                pageSlug={pageSlug}
                onUpdatePageTitle={setPageTitle}
                onUpdatePageSlug={setPageSlug}
                onUpdateSection={handleUpdateSection}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
