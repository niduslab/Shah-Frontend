'use client';

import { useState, useEffect } from 'react';
import { Settings, FileText, Image as ImageIcon, Type, Link as LinkIcon, Upload } from 'lucide-react';

interface SectionEditorProps {
  section: any;
  pageTitle: string;
  pageSlug: string;
  onUpdatePageTitle: (title: string) => void;
  onUpdatePageSlug: (slug: string) => void;
  onUpdateSection: (instanceId: string, content: any, settings: any) => void;
}

export default function SectionEditor({
  section,
  pageTitle,
  pageSlug,
  onUpdatePageTitle,
  onUpdatePageSlug,
  onUpdateSection
}: SectionEditorProps) {
  const [activeTab, setActiveTab] = useState<'page' | 'content' | 'settings'>('page');
  const [content, setContent] = useState<any>({});
  const [settings, setSettings] = useState<any>({});

  useEffect(() => {
    if (section) {
      setContent(section.content || {});
      setSettings(section.settings || {});
      setActiveTab('content');
    }
  }, [section]);

  const handleContentChange = (field: string, value: any) => {
    const newContent = { ...content, [field]: value };
    setContent(newContent);
    if (section) {
      onUpdateSection(section.instanceId, newContent, settings);
    }
  };

  const handleSettingsChange = (field: string, value: any) => {
    const newSettings = { ...settings, [field]: value };
    setSettings(newSettings);
    if (section) {
      onUpdateSection(section.instanceId, content, newSettings);
    }
  };

  const handleImageUpload = (field: string) => {
    // Simulate image upload
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (file) {
        // In real implementation, upload to server
        const fakeUrl = `/storage/media/${file.name}`;
        handleContentChange(field, fakeUrl);
      }
    };
    input.click();
  };

  return (
    <div className="rounded-2xl bg-white shadow-lg ring-1 ring-gray-200 overflow-hidden">
      {/* Tabs */}
      <div className="border-b border-gray-200 bg-gray-50">
        <div className="flex">
          <button
            onClick={() => setActiveTab('page')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'page'
                ? 'bg-white text-[#FF6F00] border-b-2 border-[#FF6F00]'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <FileText className="h-4 w-4" />
            Page
          </button>
          <button
            onClick={() => setActiveTab('content')}
            disabled={!section}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'content'
                ? 'bg-white text-[#FF6F00] border-b-2 border-[#FF6F00]'
                : 'text-gray-600 hover:text-gray-900 disabled:text-gray-400 disabled:cursor-not-allowed'
            }`}
          >
            <Type className="h-4 w-4" />
            Content
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            disabled={!section}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'settings'
                ? 'bg-white text-[#FF6F00] border-b-2 border-[#FF6F00]'
                : 'text-gray-600 hover:text-gray-900 disabled:text-gray-400 disabled:cursor-not-allowed'
            }`}
          >
            <Settings className="h-4 w-4" />
            Settings
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
        {activeTab === 'page' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Page Title
              </label>
              <input
                type="text"
                value={pageTitle}
                onChange={(e) => onUpdatePageTitle(e.target.value)}
                placeholder="e.g., Home, Summer Sale"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#FF6F00] focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Page Slug
              </label>
              <input
                type="text"
                value={pageSlug}
                onChange={(e) => onUpdatePageSlug(e.target.value)}
                placeholder="e.g., home, summer-sale"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#FF6F00] focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
              />
              <p className="mt-1 text-xs text-gray-500">
                URL: /{pageSlug || 'your-slug'}
              </p>
            </div>

            <div className="rounded-lg bg-blue-50 p-4 border border-blue-200">
              <p className="text-sm text-blue-800">
                <strong>Tip:</strong> Fill in page details first, then add and configure sections.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'content' && (
          <div className="space-y-4">
            {!section ? (
              <div className="text-center py-12">
                <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200">
                  <Type className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No section selected</h3>
                <p className="text-gray-600">Select a section from your page to edit its content</p>
              </div>
            ) : (
              <>
                <div className="mb-4">
                  <h3 className="font-bold text-gray-900">{section.name}</h3>
                  <p className="text-sm text-gray-600">{section.description}</p>
                </div>

                {/* Dynamic Content Fields Based on Section Type */}
                {section.id === 'landing_hero_grid' && (
                  <div className="space-y-4">
                    {/* Main Card */}
                    <div className="rounded-lg border border-gray-200 p-4">
                      <h4 className="font-semibold text-gray-900 mb-3">Main Card (Large)</h4>
                      
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            <ImageIcon className="inline h-4 w-4 mr-1" />
                            Image
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={content.main_card_image || ''}
                              onChange={(e) => handleContentChange('main_card_image', e.target.value)}
                              placeholder="/images/hero.jpg"
                              className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#FF6F00] focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
                            />
                            <button
                              onClick={() => handleImageUpload('main_card_image')}
                              className="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
                            >
                              <Upload className="h-4 w-4" />
                            </button>
                          </div>
                          {content.main_card_image && (
                            <div className="mt-2 rounded-lg overflow-hidden border border-gray-200">
                              <img src={content.main_card_image} alt="Preview" className="w-full h-32 object-cover" />
                            </div>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Heading
                          </label>
                          <input
                            type="text"
                            value={content.main_card_heading || ''}
                            onChange={(e) => handleContentChange('main_card_heading', e.target.value)}
                            placeholder="Elevate Your"
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#FF6F00] focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Subheading
                          </label>
                          <input
                            type="text"
                            value={content.main_card_subheading || ''}
                            onChange={(e) => handleContentChange('main_card_subheading', e.target.value)}
                            placeholder="Fitness Journey"
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#FF6F00] focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Badge Text
                            </label>
                            <input
                              type="text"
                              value={content.main_card_badge || ''}
                              onChange={(e) => handleContentChange('main_card_badge', e.target.value)}
                              placeholder="Up to"
                              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#FF6F00] focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Badge Value
                            </label>
                            <input
                              type="text"
                              value={content.main_card_badge_text || ''}
                              onChange={(e) => handleContentChange('main_card_badge_text', e.target.value)}
                              placeholder="40% Discounts"
                              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#FF6F00] focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              <LinkIcon className="inline h-4 w-4 mr-1" />
                              Button Text
                            </label>
                            <input
                              type="text"
                              value={content.main_card_cta_text || ''}
                              onChange={(e) => handleContentChange('main_card_cta_text', e.target.value)}
                              placeholder="Shop Now"
                              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#FF6F00] focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Button Link
                            </label>
                            <input
                              type="text"
                              value={content.main_card_cta_link || ''}
                              onChange={(e) => handleContentChange('main_card_cta_link', e.target.value)}
                              placeholder="/shop"
                              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#FF6F00] focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Small Cards */}
                    {['top_right', 'bottom_left', 'bottom_right'].map((position) => (
                      <div key={position} className="rounded-lg border border-gray-200 p-4">
                        <h4 className="font-semibold text-gray-900 mb-3 capitalize">
                          {position.replace('_', ' ')} Card
                        </h4>
                        
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              <ImageIcon className="inline h-4 w-4 mr-1" />
                              Image
                            </label>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={content[`${position}_image`] || ''}
                                onChange={(e) => handleContentChange(`${position}_image`, e.target.value)}
                                placeholder="/images/card.jpg"
                                className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#FF6F00] focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
                              />
                              <button
                                onClick={() => handleImageUpload(`${position}_image`)}
                                className="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
                              >
                                <Upload className="h-4 w-4" />
                              </button>
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Title
                            </label>
                            <input
                              type="text"
                              value={content[`${position}_title`] || ''}
                              onChange={(e) => handleContentChange(`${position}_title`, e.target.value)}
                              placeholder="Card Title"
                              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#FF6F00] focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Button Text
                              </label>
                              <input
                                type="text"
                                value={content[`${position}_cta_text`] || ''}
                                onChange={(e) => handleContentChange(`${position}_cta_text`, e.target.value)}
                                placeholder="Shop Now"
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#FF6F00] focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Button Link
                              </label>
                              <input
                                type="text"
                                value={content[`${position}_cta_link`] || ''}
                                onChange={(e) => handleContentChange(`${position}_cta_link`, e.target.value)}
                                placeholder="/category"
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#FF6F00] focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Brand Full Width CTA Banner */}
                {section.id === 'brand_full_width_cta' && (
                  <div className="space-y-4">
                    <div className="rounded-lg border border-gray-200 p-4">
                      <h4 className="font-semibold text-gray-900 mb-3">Hero Banner</h4>
                      
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            <ImageIcon className="inline h-4 w-4 mr-1" />
                            Background Image
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={content.background_image || ''}
                              onChange={(e) => handleContentChange('background_image', e.target.value)}
                              placeholder="/images/brand-hero.jpg"
                              className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#FF6F00] focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
                            />
                            <button
                              onClick={() => handleImageUpload('background_image')}
                              className="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
                            >
                              <Upload className="h-4 w-4" />
                            </button>
                          </div>
                          {content.background_image && (
                            <div className="mt-2 rounded-lg overflow-hidden border border-gray-200">
                              <img src={content.background_image} alt="Preview" className="w-full h-32 object-cover" />
                            </div>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Heading
                          </label>
                          <input
                            type="text"
                            value={content.heading || ''}
                            onChange={(e) => handleContentChange('heading', e.target.value)}
                            placeholder="Transform Your Fitness"
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#FF6F00] focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Description
                          </label>
                          <textarea
                            value={content.description || ''}
                            onChange={(e) => handleContentChange('description', e.target.value)}
                            placeholder="Brand story and description..."
                            rows={3}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#FF6F00] focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              <LinkIcon className="inline h-4 w-4 mr-1" />
                              Button Text
                            </label>
                            <input
                              type="text"
                              value={content.cta_text || ''}
                              onChange={(e) => handleContentChange('cta_text', e.target.value)}
                              placeholder="Shop Now"
                              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#FF6F00] focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Button Link
                            </label>
                            <input
                              type="text"
                              value={content.cta_link || ''}
                              onChange={(e) => handleContentChange('cta_link', e.target.value)}
                              placeholder="/shop"
                              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#FF6F00] focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Brand Category Grid */}
                {section.id === 'brand_category_grid' && (
                  <div className="space-y-4">
                    <div className="rounded-lg border border-gray-200 p-4">
                      <h4 className="font-semibold text-gray-900 mb-3">Section Header</h4>
                      
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Title
                          </label>
                          <input
                            type="text"
                            value={content.title || ''}
                            onChange={(e) => handleContentChange('title', e.target.value)}
                            placeholder="Shop by Category"
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#FF6F00] focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
                          />
                        </div>
                      </div>
                    </div>

                    {[1, 2, 3, 4].map((num) => (
                      <div key={num} className="rounded-lg border border-gray-200 p-4">
                        <h4 className="font-semibold text-gray-900 mb-3">Category {num}</h4>
                        
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              <ImageIcon className="inline h-4 w-4 mr-1" />
                              Image
                            </label>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={content[`category_${num}_image`] || ''}
                                onChange={(e) => handleContentChange(`category_${num}_image`, e.target.value)}
                                placeholder="/images/category.jpg"
                                className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#FF6F00] focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
                              />
                              <button
                                onClick={() => handleImageUpload(`category_${num}_image`)}
                                className="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
                              >
                                <Upload className="h-4 w-4" />
                              </button>
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Name
                            </label>
                            <input
                              type="text"
                              value={content[`category_${num}_name`] || ''}
                              onChange={(e) => handleContentChange(`category_${num}_name`, e.target.value)}
                              placeholder="Treadmills"
                              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#FF6F00] focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              <LinkIcon className="inline h-4 w-4 mr-1" />
                              Link
                            </label>
                            <input
                              type="text"
                              value={content[`category_${num}_link`] || ''}
                              onChange={(e) => handleContentChange(`category_${num}_link`, e.target.value)}
                              placeholder="/category/treadmills"
                              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#FF6F00] focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Brand Featured Products */}
                {section.id === 'brand_featured_products' && (
                  <div className="space-y-4">
                    <div className="rounded-lg border border-gray-200 p-4">
                      <h4 className="font-semibold text-gray-900 mb-3">Section Header</h4>
                      
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Title
                          </label>
                          <input
                            type="text"
                            value={content.title || ''}
                            onChange={(e) => handleContentChange('title', e.target.value)}
                            placeholder="Featured Products"
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#FF6F00] focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
                          />
                        </div>
                      </div>
                    </div>

                    {[1, 2].map((num) => (
                      <div key={num} className="rounded-lg border border-gray-200 p-4">
                        <h4 className="font-semibold text-gray-900 mb-3">Product {num}</h4>
                        
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              <ImageIcon className="inline h-4 w-4 mr-1" />
                              Image
                            </label>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={content[`product_${num}_image`] || ''}
                                onChange={(e) => handleContentChange(`product_${num}_image`, e.target.value)}
                                placeholder="/images/product.jpg"
                                className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#FF6F00] focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
                              />
                              <button
                                onClick={() => handleImageUpload(`product_${num}_image`)}
                                className="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
                              >
                                <Upload className="h-4 w-4" />
                              </button>
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Name
                            </label>
                            <input
                              type="text"
                              value={content[`product_${num}_name`] || ''}
                              onChange={(e) => handleContentChange(`product_${num}_name`, e.target.value)}
                              placeholder="Product Name"
                              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#FF6F00] focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Price
                              </label>
                              <input
                                type="text"
                                value={content[`product_${num}_price`] || ''}
                                onChange={(e) => handleContentChange(`product_${num}_price`, e.target.value)}
                                placeholder="$999"
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#FF6F00] focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Badge
                              </label>
                              <input
                                type="text"
                                value={content[`product_${num}_badge`] || ''}
                                onChange={(e) => handleContentChange(`product_${num}_badge`, e.target.value)}
                                placeholder="New"
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#FF6F00] focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              <LinkIcon className="inline h-4 w-4 mr-1" />
                              Link
                            </label>
                            <input
                              type="text"
                              value={content[`product_${num}_link`] || ''}
                              onChange={(e) => handleContentChange(`product_${num}_link`, e.target.value)}
                              placeholder="/product/slug"
                              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#FF6F00] focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Brand Content with Images */}
                {section.id === 'brand_content_with_images' && (
                  <div className="space-y-4">
                    <div className="rounded-lg border border-gray-200 p-4">
                      <h4 className="font-semibold text-gray-900 mb-3">Brand Story</h4>
                      
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Title
                          </label>
                          <input
                            type="text"
                            value={content.title || ''}
                            onChange={(e) => handleContentChange('title', e.target.value)}
                            placeholder="Behind the Work"
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#FF6F00] focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Description
                          </label>
                          <textarea
                            value={content.description || ''}
                            onChange={(e) => handleContentChange('description', e.target.value)}
                            placeholder="Tell your brand story..."
                            rows={4}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#FF6F00] focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="rounded-lg border border-gray-200 p-4">
                      <h4 className="font-semibold text-gray-900 mb-3">Statistics</h4>
                      
                      <div className="space-y-3">
                        {[1, 2, 3].map((num) => (
                          <div key={num} className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Stat {num} Value
                              </label>
                              <input
                                type="text"
                                value={content[`stat_${num}_value`] || ''}
                                onChange={(e) => handleContentChange(`stat_${num}_value`, e.target.value)}
                                placeholder="25+"
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#FF6F00] focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Stat {num} Label
                              </label>
                              <input
                                type="text"
                                value={content[`stat_${num}_label`] || ''}
                                onChange={(e) => handleContentChange(`stat_${num}_label`, e.target.value)}
                                placeholder="Years Experience"
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#FF6F00] focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-lg border border-gray-200 p-4">
                      <h4 className="font-semibold text-gray-900 mb-3">Image Collage</h4>
                      
                      <div className="space-y-3">
                        {[1, 2, 3].map((num) => (
                          <div key={num}>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              <ImageIcon className="inline h-4 w-4 mr-1" />
                              Image {num}
                            </label>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={content[`collage_image_${num}`] || ''}
                                onChange={(e) => handleContentChange(`collage_image_${num}`, e.target.value)}
                                placeholder="/images/collage.jpg"
                                className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#FF6F00] focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
                              />
                              <button
                                onClick={() => handleImageUpload(`collage_image_${num}`)}
                                className="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
                              >
                                <Upload className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Brand Product Hero */}
                {section.id === 'brand_product_hero' && (
                  <div className="space-y-4">
                    <div className="rounded-lg border border-gray-200 p-4">
                      <h4 className="font-semibold text-gray-900 mb-3">Left Side Content</h4>
                      
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            <ImageIcon className="inline h-4 w-4 mr-1" />
                            Product Image
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={content.left_image || ''}
                              onChange={(e) => handleContentChange('left_image', e.target.value)}
                              placeholder="/images/product-left.jpg"
                              className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#FF6F00] focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
                            />
                            <button
                              onClick={() => handleImageUpload('left_image')}
                              className="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
                            >
                              <Upload className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Title
                          </label>
                          <input
                            type="text"
                            value={content.left_title || ''}
                            onChange={(e) => handleContentChange('left_title', e.target.value)}
                            placeholder="Product Name"
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#FF6F00] focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Description
                          </label>
                          <textarea
                            value={content.left_description || ''}
                            onChange={(e) => handleContentChange('left_description', e.target.value)}
                            placeholder="Product description..."
                            rows={3}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#FF6F00] focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Button Text
                            </label>
                            <input
                              type="text"
                              value={content.left_cta_text || ''}
                              onChange={(e) => handleContentChange('left_cta_text', e.target.value)}
                              placeholder="Learn More"
                              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#FF6F00] focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Button Link
                            </label>
                            <input
                              type="text"
                              value={content.left_cta_link || ''}
                              onChange={(e) => handleContentChange('left_cta_link', e.target.value)}
                              placeholder="/product/slug"
                              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#FF6F00] focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-lg border border-gray-200 p-4">
                      <h4 className="font-semibold text-gray-900 mb-3">Right Side Content</h4>
                      
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            <ImageIcon className="inline h-4 w-4 mr-1" />
                            Product Image
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={content.right_image || ''}
                              onChange={(e) => handleContentChange('right_image', e.target.value)}
                              placeholder="/images/product-right.jpg"
                              className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#FF6F00] focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
                            />
                            <button
                              onClick={() => handleImageUpload('right_image')}
                              className="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
                            >
                              <Upload className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Title
                          </label>
                          <input
                            type="text"
                            value={content.right_title || ''}
                            onChange={(e) => handleContentChange('right_title', e.target.value)}
                            placeholder="Product Name"
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#FF6F00] focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Description
                          </label>
                          <textarea
                            value={content.right_description || ''}
                            onChange={(e) => handleContentChange('right_description', e.target.value)}
                            placeholder="Product description..."
                            rows={3}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#FF6F00] focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Button Text
                            </label>
                            <input
                              type="text"
                              value={content.right_cta_text || ''}
                              onChange={(e) => handleContentChange('right_cta_text', e.target.value)}
                              placeholder="Learn More"
                              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#FF6F00] focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Button Link
                            </label>
                            <input
                              type="text"
                              value={content.right_cta_link || ''}
                              onChange={(e) => handleContentChange('right_cta_link', e.target.value)}
                              placeholder="/product/slug"
                              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#FF6F00] focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Fallback for other section types */}
                {!['landing_hero_grid', 'brand_full_width_cta', 'brand_category_grid', 'brand_featured_products', 'brand_content_with_images', 'brand_product_hero'].includes(section.id) && (
                  <div className="rounded-lg bg-yellow-50 p-4 border border-yellow-200">
                    <p className="text-sm text-yellow-800">
                      <strong>Coming Soon:</strong> Visual editor for "{section.name}" is being developed. 
                      For now, you can use the JSON editor in the sections management page.
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-4">
            {!section ? (
              <div className="text-center py-12">
                <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200">
                  <Settings className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No section selected</h3>
                <p className="text-gray-600">Select a section to configure its settings</p>
              </div>
            ) : (
              <>
                <div className="mb-4">
                  <h3 className="font-bold text-gray-900">Section Settings</h3>
                  <p className="text-sm text-gray-600">Configure display and behavior options</p>
                </div>

                {section.id === 'landing_hero_grid' && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="main_card_bg_overlay"
                        checked={settings.main_card_bg_overlay ?? true}
                        onChange={(e) => handleSettingsChange('main_card_bg_overlay', e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-[#FF6F00]"
                      />
                      <label htmlFor="main_card_bg_overlay" className="text-sm font-medium text-gray-700">
                        Show background overlay on main card
                      </label>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Text Color
                      </label>
                      <select
                        value={settings.text_color || '#ffffff'}
                        onChange={(e) => handleSettingsChange('text_color', e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#FF6F00] focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
                      >
                        <option value="#ffffff">White</option>
                        <option value="#000000">Black</option>
                        <option value="#6b7280">Gray</option>
                      </select>
                    </div>
                  </div>
                )}

                {['brand_full_width_cta', 'brand_product_hero'].includes(section.id) && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="show_overlay"
                        checked={settings.show_overlay ?? true}
                        onChange={(e) => handleSettingsChange('show_overlay', e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-[#FF6F00]"
                      />
                      <label htmlFor="show_overlay" className="text-sm font-medium text-gray-700">
                        Show background overlay
                      </label>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Text Color
                      </label>
                      <select
                        value={settings.text_color || '#ffffff'}
                        onChange={(e) => handleSettingsChange('text_color', e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#FF6F00] focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
                      >
                        <option value="#ffffff">White</option>
                        <option value="#000000">Black</option>
                        <option value="#6b7280">Gray</option>
                      </select>
                    </div>
                  </div>
                )}

                {section.id === 'brand_category_grid' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Background Color
                      </label>
                      <select
                        value={settings.background_color || 'dark'}
                        onChange={(e) => handleSettingsChange('background_color', e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#FF6F00] focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
                      >
                        <option value="dark">Dark</option>
                        <option value="light">Light</option>
                        <option value="gray">Gray</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Grid Columns
                      </label>
                      <select
                        value={settings.grid_columns || '4'}
                        onChange={(e) => handleSettingsChange('grid_columns', e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#FF6F00] focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
                      >
                        <option value="2">2 Columns</option>
                        <option value="3">3 Columns</option>
                        <option value="4">4 Columns</option>
                      </select>
                    </div>
                  </div>
                )}

                {section.id === 'brand_featured_products' && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="show_badges"
                        checked={settings.show_badges ?? true}
                        onChange={(e) => handleSettingsChange('show_badges', e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-[#FF6F00]"
                      />
                      <label htmlFor="show_badges" className="text-sm font-medium text-gray-700">
                        Show product badges
                      </label>
                    </div>

                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="show_prices"
                        checked={settings.show_prices ?? true}
                        onChange={(e) => handleSettingsChange('show_prices', e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-[#FF6F00]"
                      />
                      <label htmlFor="show_prices" className="text-sm font-medium text-gray-700">
                        Show product prices
                      </label>
                    </div>
                  </div>
                )}

                {section.id === 'brand_content_with_images' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Layout
                      </label>
                      <select
                        value={settings.layout || 'left'}
                        onChange={(e) => handleSettingsChange('layout', e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#FF6F00] focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
                      >
                        <option value="left">Content Left, Images Right</option>
                        <option value="right">Content Right, Images Left</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="show_stats"
                        checked={settings.show_stats ?? true}
                        onChange={(e) => handleSettingsChange('show_stats', e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-[#FF6F00]"
                      />
                      <label htmlFor="show_stats" className="text-sm font-medium text-gray-700">
                        Show statistics
                      </label>
                    </div>
                  </div>
                )}

                {!['landing_hero_grid', 'brand_full_width_cta', 'brand_category_grid', 'brand_featured_products', 'brand_content_with_images', 'brand_product_hero'].includes(section.id) && (
                  <div className="rounded-lg bg-gray-50 p-4 border border-gray-200">
                    <p className="text-sm text-gray-600">
                      No additional settings available for this section type.
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
