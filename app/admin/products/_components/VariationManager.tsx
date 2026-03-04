'use client';

import { useState } from 'react';
import { Plus, Trash2, Package } from 'lucide-react';

interface Variation {
  id?: number;
  sku: string;
  price: string;
  quantity: string;
  attributes: Record<string, string>;
}

interface VariationManagerProps {
  variations: Variation[];
  onChange: (variations: Variation[]) => void;
}

export default function VariationManager({ variations, onChange }: VariationManagerProps) {
  const handleAdd = () => {
    const newVariation: Variation = {
      sku: '',
      price: '',
      quantity: '',
      attributes: {
        color: '',
        size: '',
      },
    };
    onChange([...variations, newVariation]);
  };

  const handleRemove = (index: number) => {
    onChange(variations.filter((_, i) => i !== index));
  };

  const handleUpdate = (index: number, field: keyof Variation, value: any) => {
    const updated = [...variations];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const handleAttributeChange = (index: number, key: string, value: string) => {
    const updated = [...variations];
    updated[index].attributes = {
      ...updated[index].attributes,
      [key]: value,
    };
    onChange(updated);
  };

  const handleRemoveAttribute = (index: number, key: string) => {
    const updated = [...variations];
    const newAttributes = { ...updated[index].attributes };
    delete newAttributes[key];
    updated[index].attributes = newAttributes;
    onChange(updated);
  };

  const handleAddAttribute = (index: number) => {
    const key = prompt('Enter attribute name (e.g., material, model):');
    if (key && key.trim()) {
      handleAttributeChange(index, key.trim().toLowerCase(), '');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Product Variations</h3>
          <p className="text-sm text-gray-500">
            Add different models, colors, sizes with unique SKU, price, and stock
          </p>
        </div>
        <button
          type="button"
          onClick={handleAdd}
          className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-gray-200"
        >
          <Plus className="h-4 w-4" />
          Add Variation
        </button>
      </div>

      {variations.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-8 text-center">
          <Package className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-600">No variations added</p>
          <p className="text-xs text-gray-500">Product will use base price and SKU</p>
          <button
            type="button"
            onClick={handleAdd}
            className="mt-4 text-sm font-medium text-[#FF6F00] hover:text-[#E65100]"
          >
            Add your first variation
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {variations.map((variation, index) => (
            <div
              key={index}
              className="rounded-xl border border-gray-200 bg-white p-4 transition-all hover:border-gray-300"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  Variation #{index + 1}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="flex items-center gap-1 text-sm text-red-600 transition-all hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                  Remove
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {/* SKU */}
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-700">
                    SKU <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={variation.sku}
                    onChange={(e) => handleUpdate(index, 'sku', e.target.value)}
                    placeholder="PROD-RED-L"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition-all focus:border-[#FF6F00] focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
                  />
                </div>

                {/* Price */}
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-700">
                    Price <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    min="0"
                    value={variation.price}
                    onChange={(e) => handleUpdate(index, 'price', e.target.value)}
                    placeholder="29.99"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition-all focus:border-[#FF6F00] focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
                  />
                </div>

                {/* Quantity */}
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-700">
                    Stock <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={variation.quantity}
                    onChange={(e) => handleUpdate(index, 'quantity', e.target.value)}
                    placeholder="100"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition-all focus:border-[#FF6F00] focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
                  />
                </div>
              </div>

              {/* Attributes */}
              <div className="mt-4">
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-xs font-medium text-gray-700">
                    Attributes (Color, Size, etc.)
                  </label>
                  <button
                    type="button"
                    onClick={() => handleAddAttribute(index)}
                    className="text-xs text-[#FF6F00] hover:text-[#E65100]"
                  >
                    + Add Custom Attribute
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(variation.attributes).map(([key, value]) => (
                    <div key={key} className="relative">
                      <input
                        type="text"
                        value={value}
                        onChange={(e) => handleAttributeChange(index, key, e.target.value)}
                        placeholder={`${key.charAt(0).toUpperCase() + key.slice(1)} (e.g., ${
                          key === 'color' ? 'Red' : key === 'size' ? 'L' : 'Value'
                        })`}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 pr-8 text-sm transition-all focus:border-[#FF6F00] focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
                      />
                      {!['color', 'size'].includes(key) && (
                        <button
                          type="button"
                          onClick={() => handleRemoveAttribute(index, key)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-600"
                          title="Remove attribute"
                        >
                          ×
                        </button>
                      )}
                      <span className="absolute -top-2 left-2 bg-white px-1 text-xs text-gray-500">
                        {key}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {variations.length > 0 && (
        <div className="rounded-lg bg-blue-50 p-3">
          <p className="text-xs text-blue-700">
            💡 Tip: Each variation should have a unique SKU. Use format like: PRODUCT-COLOR-SIZE
          </p>
        </div>
      )}
    </div>
  );
}
