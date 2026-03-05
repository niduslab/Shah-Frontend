'use client';

import { useState } from 'react';
import { Plus, Trash2, Package } from 'lucide-react';
import { useAdminVariations } from '@/lib/hooks/admin/useAdminVariations';

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

interface VariationOption {
  id: number;
  value: string;
  label: string;
  color_code?: string;
  sort_order?: number;
}

interface VariationType {
  id: number;
  name: string;
  options: VariationOption[];
}

export default function VariationManager({ variations, onChange }: VariationManagerProps) {
  const [showAttributeSelector, setShowAttributeSelector] = useState<number | null>(null);
  const [customAttributeKey, setCustomAttributeKey] = useState('');
  const [customAttributeValue, setCustomAttributeValue] = useState('');
  
  const { data: variationTypesData, isLoading: isLoadingVariations } = useAdminVariations();
  
  // Handle both possible API response structures
  let variationTypes: VariationType[] = [];
  
  if (variationTypesData) {
    // Debug: Log the raw data structure
    console.log('Raw variation types data:', variationTypesData);
    
    // Try different possible structures
    if (Array.isArray(variationTypesData)) {
      variationTypes = variationTypesData;
    } else if ((variationTypesData as any)?.data) {
      if (Array.isArray((variationTypesData as any).data)) {
        variationTypes = (variationTypesData as any).data;
      } else if (Array.isArray((variationTypesData as any).data?.data)) {
        variationTypes = (variationTypesData as any).data.data;
      }
    }
    
    console.log('Extracted variation types:', variationTypes);
    console.log('Has variation types:', variationTypes.length > 0);
  }
  
  const hasVariationTypes = variationTypes.length > 0;

  const handleAdd = () => {
    const newVariation: Variation = {
      sku: '',
      price: '',
      quantity: '',
      attributes: {},
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

  const handleSelectOption = (index: number, typeName: string, optionValue: string) => {
    handleAttributeChange(index, typeName.toLowerCase(), optionValue);
    setShowAttributeSelector(null);
  };

  const handleAddCustomAttribute = (index: number) => {
    if (customAttributeKey.trim() && customAttributeValue.trim()) {
      handleAttributeChange(index, customAttributeKey.trim().toLowerCase(), customAttributeValue.trim());
      setCustomAttributeKey('');
      setCustomAttributeValue('');
      setShowAttributeSelector(null);
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
                    onClick={() => setShowAttributeSelector(showAttributeSelector === index ? null : index)}
                    className="flex items-center gap-1 text-xs text-[#FF6F00] hover:text-[#E65100]"
                  >
                    <Plus className="h-3 w-3" />
                    Add Attribute
                  </button>
                </div>

                {/* Attribute Selector Modal */}
                {showAttributeSelector === index && (
                  <div className="mb-3 rounded-lg border border-gray-300 bg-white p-4 shadow-lg">
                    <div className="mb-3 flex items-center justify-between">
                      <h4 className="text-sm font-semibold text-gray-900">Select Attribute</h4>
                      <button
                        type="button"
                        onClick={() => setShowAttributeSelector(null)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        ×
                      </button>
                    </div>

                    {isLoadingVariations ? (
                      <div className="py-8 text-center">
                        <div className="mx-auto mb-2 h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-[#FF6F00]"></div>
                        <p className="text-xs text-gray-500">Loading variation types...</p>
                      </div>
                    ) : (
                      <>
                        {/* Existing Variation Types */}
                        {hasVariationTypes ? (
                          <div className="mb-4 space-y-3">
                            <p className="text-xs font-medium text-gray-500">
                              Select from predefined attributes:
                            </p>
                            {variationTypes.map((type) => (
                              <div key={type.id}>
                                <p className="mb-2 text-xs font-medium text-gray-700">{type.name}</p>
                                <div className="flex flex-wrap gap-2">
                                  {type.options.map((option) => (
                                    <button
                                      key={option.id}
                                      type="button"
                                      onClick={() => handleSelectOption(index, type.name, option.value)}
                                      className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs transition-all hover:border-[#FF6F00] hover:bg-orange-50"
                                    >
                                      {option.color_code && (
                                        <span
                                          className="h-3 w-3 rounded-full border border-gray-300"
                                          style={{ backgroundColor: option.color_code }}
                                        />
                                      )}
                                      <span>{option.label}</span>
                                    </button>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="mb-4 rounded-lg border border-dashed border-gray-300 bg-gray-50 p-4 text-center">
                            <p className="text-xs text-gray-600">No variation types configured yet</p>
                            <p className="mt-1 text-xs text-gray-500">
                              Go to Variations page to create types like Color, Size, etc.
                            </p>
                          </div>
                        )}

                        {/* Custom Attribute */}
                        <div className={hasVariationTypes ? "border-t border-gray-200 pt-3" : ""}>
                          <p className="mb-2 text-xs font-medium text-gray-600">
                            {hasVariationTypes ? 'Or add custom attribute:' : 'Add custom attribute:'}
                          </p>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder="Name (e.g., material)"
                              value={customAttributeKey}
                              onChange={(e) => setCustomAttributeKey(e.target.value)}
                              className="flex-1 rounded-lg border border-gray-300 px-3 py-1.5 text-xs focus:border-[#FF6F00] focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
                            />
                            <input
                              type="text"
                              placeholder="Value (e.g., Cotton)"
                              value={customAttributeValue}
                              onChange={(e) => setCustomAttributeValue(e.target.value)}
                              className="flex-1 rounded-lg border border-gray-300 px-3 py-1.5 text-xs focus:border-[#FF6F00] focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
                            />
                            <button
                              type="button"
                              onClick={() => handleAddCustomAttribute(index)}
                              disabled={!customAttributeKey.trim() || !customAttributeValue.trim()}
                              className="rounded-lg bg-[#FF6F00] px-3 py-1.5 text-xs text-white transition-all hover:bg-[#E65100] disabled:opacity-50"
                            >
                              Add
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* Selected Attributes */}
                {Object.keys(variation.attributes).length > 0 ? (
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(variation.attributes).map(([key, value]) => (
                      <div key={key} className="relative">
                        <input
                          type="text"
                          value={value}
                          onChange={(e) => handleAttributeChange(index, key, e.target.value)}
                          placeholder={`Enter ${key}`}
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 pr-8 text-sm transition-all focus:border-[#FF6F00] focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveAttribute(index, key)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-600"
                          title="Remove attribute"
                        >
                          ×
                        </button>
                        <span className="absolute -top-2 left-2 bg-white px-1 text-xs text-gray-500">
                          {key}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-3 text-center">
                    <p className="text-xs text-gray-500">No attributes added yet</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {variations.length > 0 && (
        <div className="space-y-2">
          <div className="rounded-lg bg-blue-50 p-3">
            <p className="text-xs text-blue-700">
              💡 Tip: Each variation should have a unique SKU. Use format like: PRODUCT-COLOR-SIZE
            </p>
          </div>
          {!hasVariationTypes && (
            <div className="rounded-lg bg-amber-50 p-3">
              <p className="text-xs text-amber-700">
                ⚠️ No variation types found. Create variation types (Color, Size, etc.) in the Variations page to quickly add attributes.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
