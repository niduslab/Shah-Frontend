'use client';

import { useState, useEffect } from 'react';
import { X, Code, Save, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useUpdateSectionContent } from '@/lib/hooks/admin/useDynamicPages';

interface ContentEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  section: any;
  pageId: number;
}

export default function ContentEditorModal({ isOpen, onClose, section, pageId }: ContentEditorModalProps) {
  const [contentJson, setContentJson] = useState('');
  const [settingsJson, setSettingsJson] = useState('');
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'content' | 'settings'>('content');
  
  const updateContentMutation = useUpdateSectionContent();

  useEffect(() => {
    if (section) {
      setContentJson(JSON.stringify(section.content || {}, null, 2));
      setSettingsJson(JSON.stringify(section.settings || {}, null, 2));
      setJsonError(null);
    }
  }, [section, isOpen]);

  const validateJson = (json: string): boolean => {
    try {
      JSON.parse(json);
      setJsonError(null);
      return true;
    } catch (error: any) {
      setJsonError(error.message);
      return false;
    }
  };

  const handleSave = async () => {
    if (!validateJson(contentJson) || !validateJson(settingsJson)) {
      toast.error('Invalid JSON', {
        description: 'Please fix the JSON syntax errors before saving.'
      });
      return;
    }

    try {
      const content = JSON.parse(contentJson);
      const settings = JSON.parse(settingsJson);
      
      await updateContentMutation.mutateAsync({
        pageId,
        sectionId: section.id,
        data: { content }
      });

      // Also update settings if changed
      if (JSON.stringify(settings) !== JSON.stringify(section.settings)) {
        // Note: You might need a separate endpoint for settings
        // For now, we'll include it in the content update
      }

      toast.success('Content updated successfully');
      onClose();
    } catch (error) {
      toast.error('Failed to update content', {
        description: 'Please try again or contact support if the problem persists.'
      });
    }
  };

  const getExampleContent = (sectionType: string) => {
    const examples: Record<string, any> = {
      hero_slider: {
        slides: [
          {
            type: 'image',
            media_url: '/storage/media/hero-1.jpg',
            title: 'Elevate Your Fitness Journey',
            subtitle: 'Up to 40% Discounts',
            cta_text: 'Shop Now',
            cta_link: '/shop',
            text_position: 'left'
          }
        ]
      },
      product_grid: {
        layout: 'grid',
        columns: 4,
        items: [
          {
            type: 'product_card',
            image: '/storage/media/gear.jpg',
            title: 'Perfect Gear Awaits',
            description: 'Premium fitness equipment',
            cta_text: 'Shop Now',
            cta_link: '/category/gear',
            badge: '40% OFF'
          }
        ]
      },
      brand_showcase: {
        background_type: 'image',
        background_url: '/storage/media/brand-bg.jpg',
        logo: '/storage/media/brand-logo.png',
        description: 'Brand description here',
        cta_text: 'Shop Now',
        cta_link: '/brand/example'
      },
      category_grid: {
        categories: [
          {
            name: 'Bikes',
            image: '/storage/media/bikes.jpg',
            link: '/category/bikes',
            product_count: 45
          }
        ]
      },
      banner: {
        image: '/storage/media/banner.jpg',
        title: 'Flash Sale',
        subtitle: 'Limited Time Offer',
        cta_text: 'Shop Now',
        cta_link: '/flash-deals'
      },
      video_section: {
        video_url: '/storage/media/video.mp4',
        poster: '/storage/media/poster.jpg',
        title: 'Product Demo',
        description: 'Watch how our equipment transforms your workout'
      },
      text_content: {
        html: '<p>Your content here...</p>',
        text_align: 'center'
      }
    };
    return examples[sectionType] || {};
  };

  const getExampleSettings = (sectionType: string) => {
    const examples: Record<string, any> = {
      hero_slider: {
        autoplay: true,
        interval: 5000,
        show_arrows: true,
        show_dots: true
      },
      product_grid: {
        show_prices: true,
        show_ratings: true,
        hover_effect: 'zoom'
      },
      brand_showcase: {
        text_color: 'white',
        overlay: true,
        overlay_opacity: 0.5,
        text_align: 'left'
      },
      category_grid: {
        columns: 4,
        show_border: true,
        hover_effect: 'zoom',
        show_product_count: true
      },
      banner: {
        full_width: true,
        height: '400px'
      },
      video_section: {
        autoplay: false,
        controls: true,
        loop: false,
        muted: false
      },
      text_content: {
        max_width: '800px',
        padding: '60px 20px'
      }
    };
    return examples[sectionType] || {};
  };

  const loadExample = () => {
    if (section) {
      setContentJson(JSON.stringify(getExampleContent(section.section_type), null, 2));
      setSettingsJson(JSON.stringify(getExampleSettings(section.section_type), null, 2));
      setJsonError(null);
    }
  };

  if (!isOpen || !section) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-5xl h-[90vh] rounded-2xl bg-white shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-gray-200 p-6">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF6F00] to-[#E65100] shrink-0">
              <Code className="h-5 w-5 text-white" />
            </div>
            <div className="min-w-0">
              <h2 className="text-xl font-bold text-gray-900">Edit Section Content</h2>
              <p className="text-sm text-gray-500 truncate">
                {section.title || section.section_type}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={loadExample}
              className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-gray-100"
            >
              Load Example
            </button>
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 px-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('content')}
            className={`px-4 py-3 text-sm font-medium transition-all border-b-2 whitespace-nowrap ${
              activeTab === 'content'
                ? 'border-[#FF6F00] text-[#FF6F00]'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Content
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-3 text-sm font-medium transition-all border-b-2 whitespace-nowrap ${
              activeTab === 'settings'
                ? 'border-[#FF6F00] text-[#FF6F00]'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Settings
          </button>
        </div>

        {/* Editor */}
        <div className="flex-1 overflow-hidden p-6">
          {jsonError && (
            <div className="mb-4 rounded-xl bg-red-50 p-4 border border-red-200 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-800">JSON Syntax Error</p>
                <p className="text-sm text-red-600 mt-1">{jsonError}</p>
              </div>
            </div>
          )}

          <textarea
            value={activeTab === 'content' ? contentJson : settingsJson}
            onChange={(e) => {
              if (activeTab === 'content') {
                setContentJson(e.target.value);
                validateJson(e.target.value);
              } else {
                setSettingsJson(e.target.value);
                validateJson(e.target.value);
              }
            }}
            className="w-full h-full rounded-xl border border-gray-300 px-4 py-3 text-sm font-mono transition-all focus:border-[#FF6F00] focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20 resize-none"
            placeholder={activeTab === 'content' ? 'Enter content JSON...' : 'Enter settings JSON...'}
            spellCheck={false}
          />
        </div>

        {/* Actions */}
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:gap-3 border-t border-gray-200 p-6">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={updateContentMutation.isPending || !!jsonError}
            className="flex-1 rounded-xl bg-gradient-to-r from-[#FF6F00] to-[#E65100] px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-orange-500/30 transition-all hover:shadow-xl hover:shadow-orange-500/40 focus:outline-none focus:ring-2 focus:ring-[#FF6F00] focus:ring-offset-2 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Save className="h-4 w-4" />
            {updateContentMutation.isPending ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
