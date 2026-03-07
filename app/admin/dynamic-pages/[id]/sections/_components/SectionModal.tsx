'use client';

import { useState, useEffect } from 'react';
import { X, Layers, Wand2 } from 'lucide-react';
import VisualSectionEditor from './VisualSectionEditor';

interface SectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  section: any;
  pageId: number;
  onSubmit: (data: any) => Promise<void>;
}

export default function SectionModal({ isOpen, onClose, section, pageId, onSubmit }: SectionModalProps) {
  const [formData, setFormData] = useState({
    section_type: 'hero_slider',
    title: '',
    content: { placeholder: 'Edit content after creation' },
    settings: {},
    sort_order: 1,
    is_active: true,
  });
  const [contentJson, setContentJson] = useState('');
  const [settingsJson, setSettingsJson] = useState('');
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'basic' | 'visual' | 'content' | 'settings'>('basic');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get default content based on section type
  const getDefaultContent = (sectionType: string) => {
    const defaults: Record<string, any> = {
      hero_slider: { slides: [] },
      product_grid: { layout: 'grid', columns: 4, items: [] },
      brand_showcase: { background_type: 'image', background_url: '', description: '' },
      category_grid: { categories: [] },
      banner: { image: '', title: '', cta_text: 'Shop Now', cta_link: '/' },
      video_section: { video_url: '', title: '' },
      text_content: { html: '', text_align: 'left' },
      custom: { component_name: '', props: {} }
    };
    return defaults[sectionType] || {};
  };

  useEffect(() => {
    if (section) {
      const content = section.content || getDefaultContent(section.section_type);
      const settings = section.settings || {};
      setFormData({
        section_type: section.section_type || 'hero_slider',
        title: section.title || '',
        content,
        settings,
        sort_order: section.sort_order || 1,
        is_active: section.is_active ?? true,
      });
      setContentJson(JSON.stringify(content, null, 2));
      setSettingsJson(JSON.stringify(settings, null, 2));
    } else {
      const defaultContent = getDefaultContent('hero_slider');
      setFormData({
        section_type: 'hero_slider',
        title: '',
        content: defaultContent,
        settings: {},
        sort_order: 1,
        is_active: true,
      });
      setContentJson(JSON.stringify(defaultContent, null, 2));
      setSettingsJson(JSON.stringify({}, null, 2));
    }
    setJsonError(null);
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

  const handleVisualChange = (newContent: any, newSettings: any) => {
    setFormData(prev => ({ ...prev, content: newContent, settings: newSettings }));
    setContentJson(JSON.stringify(newContent, null, 2));
    setSettingsJson(JSON.stringify(newSettings, null, 2));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // If on JSON tabs, validate JSON before submitting
    if (activeTab === 'content' || activeTab === 'settings') {
      if (!validateJson(contentJson) || !validateJson(settingsJson)) {
        setActiveTab('content'); // Switch to content tab to show error
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const submitData = {
        ...formData,
        content: activeTab === 'visual' ? formData.content : JSON.parse(contentJson),
        settings: activeTab === 'visual' ? formData.settings : JSON.parse(settingsJson)
      };
      await onSubmit(submitData);
    } finally {
      setIsSubmitting(false);
    }
  };

  const loadExampleContent = () => {
    const examples = getExampleContent(formData.section_type);
    setContentJson(JSON.stringify(examples.content, null, 2));
    setSettingsJson(JSON.stringify(examples.settings, null, 2));
    setJsonError(null);
  };

  const getExampleContent = (sectionType: string) => {
    const examples: Record<string, any> = {
      hero_slider: {
        content: {
          slides: [
            {
              type: 'image',
              media_url: '/storage/media/hero.jpg',
              title: 'Elevate Your Fitness Journey',
              subtitle: 'Up to 40% Off',
              cta_text: 'Shop Now',
              cta_link: '/shop',
              text_position: 'left'
            }
          ]
        },
        settings: {
          autoplay: true,
          interval: 5000,
          show_arrows: true,
          show_dots: true
        }
      },
      product_grid: {
        content: {
          layout: 'grid',
          columns: 4,
          items: [
            {
              type: 'product_card',
              image: '/storage/media/product.jpg',
              title: 'Product Name',
              description: 'Product description',
              cta_text: 'Shop Now',
              cta_link: '/product/slug',
              badge: '40% OFF'
            }
          ]
        },
        settings: {
          show_prices: true,
          show_ratings: true,
          hover_effect: 'zoom'
        }
      },
      category_grid: {
        content: {
          categories: [
            {
              name: 'Bikes',
              image: '/storage/media/bikes.jpg',
              link: '/category/bikes',
              product_count: 45
            }
          ]
        },
        settings: {
          columns: 4,
          show_border: true,
          hover_effect: 'zoom'
        }
      },
      banner: {
        content: {
          image: '/storage/media/banner.jpg',
          title: 'Flash Sale',
          subtitle: 'Limited Time Offer',
          cta_text: 'Shop Now',
          cta_link: '/flash-deals'
        },
        settings: {
          full_width: true,
          height: '400px'
        }
      },
      brand_showcase: {
        content: {
          background_type: 'image',
          background_url: '/storage/media/brand-bg.jpg',
          logo: '/storage/media/brand-logo.png',
          description: 'Brand description here',
          cta_text: 'Shop Brand',
          cta_link: '/brand/name'
        },
        settings: {
          text_color: 'white',
          overlay: true,
          overlay_opacity: 0.5
        }
      },
      video_section: {
        content: {
          video_url: '/storage/media/video.mp4',
          poster: '/storage/media/poster.jpg',
          title: 'See It In Action',
          description: 'Watch our product demo'
        },
        settings: {
          autoplay: false,
          controls: true,
          loop: false
        }
      },
      text_content: {
        content: {
          html: '<h2>About Us</h2><p>Your content here...</p>',
          text_align: 'center'
        },
        settings: {
          max_width: '800px',
          padding: '60px 20px'
        }
      },
      custom: {
        content: {
          component_name: 'NewsletterSignup',
          props: {}
        },
        settings: {}
      }
    };
    return examples[sectionType] || { content: {}, settings: {} };
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
      <div className="w-full max-w-4xl my-8 rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF6F00] to-[#E65100]">
              <Layers className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {section ? 'Edit Section' : 'Add Section'}
              </h2>
              <p className="text-sm text-gray-500">
                {section ? 'Update section information' : 'Add a new section to the page'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {activeTab !== 'basic' && (
              <button
                type="button"
                onClick={loadExampleContent}
                className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-gray-100"
              >
                Load Example
              </button>
            )}
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 px-6">
          <button
            type="button"
            onClick={() => setActiveTab('basic')}
            className={`px-4 py-3 text-sm font-medium transition-all border-b-2 ${
              activeTab === 'basic'
                ? 'border-[#FF6F00] text-[#FF6F00]'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Basic Info
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('visual')}
            className={`px-4 py-3 text-sm font-medium transition-all border-b-2 flex items-center gap-2 ${
              activeTab === 'visual'
                ? 'border-[#FF6F00] text-[#FF6F00]'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <Wand2 className="h-4 w-4" />
            Visual Editor
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('content')}
            className={`px-4 py-3 text-sm font-medium transition-all border-b-2 ${
              activeTab === 'content'
                ? 'border-[#FF6F00] text-[#FF6F00]'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Content (JSON)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-3 text-sm font-medium transition-all border-b-2 ${
              activeTab === 'settings'
                ? 'border-[#FF6F00] text-[#FF6F00]'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Settings (JSON)
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Basic Info Tab */}
          {activeTab === 'basic' && (
            <div className="space-y-5">
              {/* Section Type */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Section Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.section_type}
                  onChange={(e) => {
                    const newType = e.target.value;
                    setFormData({ 
                      ...formData, 
                      section_type: newType,
                      content: section ? formData.content : getDefaultContent(newType)
                    });
                    if (!section) {
                      const examples = getExampleContent(newType);
                      setContentJson(JSON.stringify(examples.content, null, 2));
                      setSettingsJson(JSON.stringify(examples.settings, null, 2));
                    }
                  }}
                  className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm transition-all focus:border-[#FF6F00] focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
                  required
                  disabled={!!section}
                >
                  <option value="hero_slider">Hero Slider</option>
                  <option value="product_grid">Product Grid</option>
                  <option value="brand_showcase">Brand Showcase</option>
                  <option value="category_grid">Category Grid</option>
                  <option value="banner">Banner</option>
                  <option value="video_section">Video Section</option>
                  <option value="text_content">Text Content</option>
                  <option value="custom">Custom</option>
                </select>
                {section && (
                  <p className="mt-1 text-xs text-gray-500">Section type cannot be changed after creation</p>
                )}
              </div>

              {/* Title */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Section Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm transition-all focus:border-[#FF6F00] focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
                  placeholder="e.g., Main Hero Section"
                />
                <p className="mt-1 text-xs text-gray-500">Optional display name for this section</p>
              </div>

              {/* Sort Order */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Sort Order
                </label>
                <input
                  type="number"
                  value={formData.sort_order}
                  onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 1 })}
                  className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm transition-all focus:border-[#FF6F00] focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
                  min="1"
                />
                <p className="mt-1 text-xs text-gray-500">Lower numbers appear first (or drag to reorder)</p>
              </div>

              {/* Active Status */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300 text-[#FF6F00] focus:ring-2 focus:ring-[#FF6F00]/20"
                />
                <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
                  Active (visible to users)
                </label>
              </div>

              {/* Info Box */}
              <div className="rounded-xl bg-blue-50 p-4 border border-blue-200">
                <p className="text-sm text-blue-800">
                  <strong>Tip:</strong> Switch to the "Visual Editor" tab to add content using an easy-to-use form builder. No coding required!
                </p>
              </div>
            </div>
          )}

          {/* Visual Editor Tab */}
          {activeTab === 'visual' && (
            <div className="max-h-[60vh] overflow-y-auto">
              <VisualSectionEditor
                sectionType={formData.section_type}
                content={formData.content}
                settings={formData.settings}
                onChange={handleVisualChange}
              />
            </div>
          )}

          {/* Content Tab */}
          {activeTab === 'content' && (
            <div className="space-y-4">
              {jsonError && (
                <div className="rounded-xl bg-red-50 p-4 border border-red-200">
                  <p className="text-sm font-medium text-red-800">JSON Syntax Error</p>
                  <p className="text-sm text-red-600 mt-1">{jsonError}</p>
                </div>
              )}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Content JSON
                </label>
                <textarea
                  value={contentJson}
                  onChange={(e) => {
                    setContentJson(e.target.value);
                    validateJson(e.target.value);
                  }}
                  className="w-full h-96 rounded-xl border border-gray-300 px-4 py-3 text-sm font-mono transition-all focus:border-[#FF6F00] focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20 resize-none"
                  placeholder="Enter content JSON..."
                  spellCheck={false}
                />
                <p className="mt-1 text-xs text-gray-500">Define the section's content structure in JSON format</p>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-4">
              {jsonError && (
                <div className="rounded-xl bg-red-50 p-4 border border-red-200">
                  <p className="text-sm font-medium text-red-800">JSON Syntax Error</p>
                  <p className="text-sm text-red-600 mt-1">{jsonError}</p>
                </div>
              )}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Settings JSON
                </label>
                <textarea
                  value={settingsJson}
                  onChange={(e) => {
                    setSettingsJson(e.target.value);
                    validateJson(e.target.value);
                  }}
                  className="w-full h-96 rounded-xl border border-gray-300 px-4 py-3 text-sm font-mono transition-all focus:border-[#FF6F00] focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20 resize-none"
                  placeholder="Enter settings JSON..."
                  spellCheck={false}
                />
                <p className="mt-1 text-xs text-gray-500">Define the section's display settings in JSON format</p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="mt-8 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !!jsonError}
              className="flex-1 rounded-xl bg-gradient-to-r from-[#FF6F00] to-[#E65100] px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-orange-500/30 transition-all hover:shadow-xl hover:shadow-orange-500/40 focus:outline-none focus:ring-2 focus:ring-[#FF6F00] focus:ring-offset-2 disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : section ? 'Update Section' : 'Add Section'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
