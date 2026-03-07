'use client';

import { useState } from 'react';
import { Plus, Trash2, Image as ImageIcon, Video, Type, Link as LinkIcon, Settings as SettingsIcon } from 'lucide-react';

interface VisualSectionEditorProps {
  sectionType: string;
  content: any;
  settings: any;
  onChange: (content: any, settings: any) => void;
}

export default function VisualSectionEditor({ sectionType, content, settings, onChange }: VisualSectionEditorProps) {
  const updateContent = (newContent: any) => {
    onChange(newContent, settings);
  };

  const updateSettings = (newSettings: any) => {
    onChange(content, newSettings);
  };

  // Hero Slider Editor
  if (sectionType === 'hero_slider') {
    const slides = content?.slides || [];
    
    const addSlide = () => {
      updateContent({
        slides: [...slides, {
          type: 'image',
          media_url: '',
          title: '',
          subtitle: '',
          cta_text: 'Shop Now',
          cta_link: '/',
          text_position: 'left',
          text_color: 'white'
        }]
      });
    };

    const updateSlide = (index: number, field: string, value: any) => {
      const newSlides = [...slides];
      newSlides[index] = { ...newSlides[index], [field]: value };
      updateContent({ slides: newSlides });
    };

    const removeSlide = (index: number) => {
      updateContent({ slides: slides.filter((_: any, i: number) => i !== index) });
    };

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Hero Slides</h3>
          <button
            type="button"
            onClick={addSlide}
            className="flex items-center gap-2 rounded-lg bg-[#FF6F00] px-4 py-2 text-sm font-medium text-white hover:bg-[#E65100]"
          >
            <Plus className="h-4 w-4" />
            Add Slide
          </button>
        </div>

        {slides.map((slide: any, index: number) => (
          <div key={index} className="rounded-xl border-2 border-gray-200 p-6 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-gray-900">Slide {index + 1}</h4>
              <button
                type="button"
                onClick={() => removeSlide(index)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <ImageIcon className="inline h-4 w-4 mr-1" />
                  Image/Video URL
                </label>
                <input
                  type="text"
                  value={slide.media_url || ''}
                  onChange={(e) => updateSlide(index, 'media_url', e.target.value)}
                  placeholder="/storage/media/hero.jpg"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#FF6F00] focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Type className="inline h-4 w-4 mr-1" />
                  Title
                </label>
                <input
                  type="text"
                  value={slide.title || ''}
                  onChange={(e) => updateSlide(index, 'title', e.target.value)}
                  placeholder="Elevate Your Fitness Journey"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#FF6F00] focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subtitle
                </label>
                <input
                  type="text"
                  value={slide.subtitle || ''}
                  onChange={(e) => updateSlide(index, 'subtitle', e.target.value)}
                  placeholder="Up to 40% Off"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#FF6F00] focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <LinkIcon className="inline h-4 w-4 mr-1" />
                  Button Text
                </label>
                <input
                  type="text"
                  value={slide.cta_text || ''}
                  onChange={(e) => updateSlide(index, 'cta_text', e.target.value)}
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
                  value={slide.cta_link || ''}
                  onChange={(e) => updateSlide(index, 'cta_link', e.target.value)}
                  placeholder="/shop"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#FF6F00] focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Text Position
                </label>
                <select
                  value={slide.text_position || 'left'}
                  onChange={(e) => updateSlide(index, 'text_position', e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#FF6F00] focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
                >
                  <option value="left">Left</option>
                  <option value="center">Center</option>
                  <option value="right">Right</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Text Color
                </label>
                <select
                  value={slide.text_color || 'white'}
                  onChange={(e) => updateSlide(index, 'text_color', e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#FF6F00] focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
                >
                  <option value="white">White</option>
                  <option value="black">Black</option>
                  <option value="gray">Gray</option>
                </select>
              </div>
            </div>
          </div>
        ))}

        {slides.length === 0 && (
          <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-xl">
            <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 mb-4">No slides added yet</p>
            <button
              type="button"
              onClick={addSlide}
              className="inline-flex items-center gap-2 rounded-lg bg-[#FF6F00] px-4 py-2 text-sm font-medium text-white hover:bg-[#E65100]"
            >
              <Plus className="h-4 w-4" />
              Add Your First Slide
            </button>
          </div>
        )}

        {/* Settings */}
        <div className="rounded-xl bg-gray-50 p-6 space-y-4">
          <h4 className="font-semibold text-gray-900 flex items-center gap-2">
            <SettingsIcon className="h-4 w-4" />
            Slider Settings
          </h4>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="autoplay"
                checked={settings?.autoplay ?? true}
                onChange={(e) => updateSettings({ ...settings, autoplay: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300 text-[#FF6F00]"
              />
              <label htmlFor="autoplay" className="text-sm font-medium text-gray-700">
                Auto-play slides
              </label>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="show_arrows"
                checked={settings?.show_arrows ?? true}
                onChange={(e) => updateSettings({ ...settings, show_arrows: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300 text-[#FF6F00]"
              />
              <label htmlFor="show_arrows" className="text-sm font-medium text-gray-700">
                Show arrows
              </label>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="show_dots"
                checked={settings?.show_dots ?? true}
                onChange={(e) => updateSettings({ ...settings, show_dots: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300 text-[#FF6F00]"
              />
              <label htmlFor="show_dots" className="text-sm font-medium text-gray-700">
                Show dots
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Interval (ms)
              </label>
              <input
                type="number"
                value={settings?.interval || 5000}
                onChange={(e) => updateSettings({ ...settings, interval: parseInt(e.target.value) })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#FF6F00] focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Product Grid Editor
  if (sectionType === 'product_grid') {
    const items = content?.items || [];
    
    const addItem = () => {
      updateContent({
        ...content,
        layout: content?.layout || 'grid',
        columns: content?.columns || 4,
        items: [...items, {
          type: 'product_card',
          image: '',
          title: '',
          description: '',
          cta_text: 'Shop Now',
          cta_link: '/',
          badge: ''
        }]
      });
    };

    const updateItem = (index: number, field: string, value: any) => {
      const newItems = [...items];
      newItems[index] = { ...newItems[index], [field]: value };
      updateContent({ ...content, items: newItems });
    };

    const removeItem = (index: number) => {
      updateContent({ ...content, items: items.filter((_: any, i: number) => i !== index) });
    };

    return (
      <div className="space-y-6">
        <div className="rounded-xl bg-gray-50 p-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Layout
              </label>
              <select
                value={content?.layout || 'grid'}
                onChange={(e) => updateContent({ ...content, layout: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#FF6F00] focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
              >
                <option value="grid">Grid</option>
                <option value="list">List</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Columns
              </label>
              <select
                value={content?.columns || 4}
                onChange={(e) => updateContent({ ...content, columns: parseInt(e.target.value) })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#FF6F00] focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
              >
                <option value="2">2 Columns</option>
                <option value="3">3 Columns</option>
                <option value="4">4 Columns</option>
                <option value="6">6 Columns</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Product Cards</h3>
          <button
            type="button"
            onClick={addItem}
            className="flex items-center gap-2 rounded-lg bg-[#FF6F00] px-4 py-2 text-sm font-medium text-white hover:bg-[#E65100]"
          >
            <Plus className="h-4 w-4" />
            Add Card
          </button>
        </div>

        {items.map((item: any, index: number) => (
          <div key={index} className="rounded-xl border-2 border-gray-200 p-6 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-gray-900">Card {index + 1}</h4>
              <button
                type="button"
                onClick={() => removeItem(index)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <ImageIcon className="inline h-4 w-4 mr-1" />
                  Image URL
                </label>
                <input
                  type="text"
                  value={item.image || ''}
                  onChange={(e) => updateItem(index, 'image', e.target.value)}
                  placeholder="/storage/media/product.jpg"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#FF6F00] focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={item.title || ''}
                  onChange={(e) => updateItem(index, 'title', e.target.value)}
                  placeholder="Perfect Gear Awaits"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#FF6F00] focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={item.description || ''}
                  onChange={(e) => updateItem(index, 'description', e.target.value)}
                  placeholder="Premium fitness equipment"
                  rows={2}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#FF6F00] focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Button Text
                </label>
                <input
                  type="text"
                  value={item.cta_text || ''}
                  onChange={(e) => updateItem(index, 'cta_text', e.target.value)}
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
                  value={item.cta_link || ''}
                  onChange={(e) => updateItem(index, 'cta_link', e.target.value)}
                  placeholder="/category/gear"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#FF6F00] focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Badge (optional)
                </label>
                <input
                  type="text"
                  value={item.badge || ''}
                  onChange={(e) => updateItem(index, 'badge', e.target.value)}
                  placeholder="40% OFF"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#FF6F00] focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
                />
              </div>
            </div>
          </div>
        ))}

        {items.length === 0 && (
          <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-xl">
            <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 mb-4">No product cards added yet</p>
            <button
              type="button"
              onClick={addItem}
              className="inline-flex items-center gap-2 rounded-lg bg-[#FF6F00] px-4 py-2 text-sm font-medium text-white hover:bg-[#E65100]"
            >
              <Plus className="h-4 w-4" />
              Add Your First Card
            </button>
          </div>
        )}
      </div>
    );
  }

  // Fallback to JSON editor for other types (for now)
  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-yellow-50 p-4 border border-yellow-200">
        <p className="text-sm text-yellow-800">
          <strong>Note:</strong> Visual editor for "{sectionType}" is coming soon. For now, please use the JSON editor in the Content/Settings tabs.
        </p>
      </div>
    </div>
  );
}
