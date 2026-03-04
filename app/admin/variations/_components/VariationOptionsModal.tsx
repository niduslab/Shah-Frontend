'use client';

import { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  useBulkCreateVariationOptions,
  useDeleteVariationOption,
  type VariationType,
} from '@/lib/hooks/admin/useAdminVariations';

interface VariationOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  variation: VariationType | null;
}

export default function VariationOptionsModal({
  isOpen,
  onClose,
  variation,
}: VariationOptionsModalProps) {
  const [options, setOptions] = useState<Array<{ value: string; label: string }>>([
    { value: '', label: '' },
  ]);

  const bulkCreateMutation = useBulkCreateVariationOptions();
  const deleteMutation = useDeleteVariationOption();

  const handleAddOption = () => {
    setOptions([...options, { value: '', label: '' }]);
  };

  const handleRemoveOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  const handleUpdateOption = (index: number, field: 'value' | 'label', value: string) => {
    const updated = [...options];
    updated[index][field] = value;
    setOptions(updated);
  };

  const handleSave = async () => {
    if (!variation) return;

    const validOptions = options.filter(opt => opt.value.trim());
    if (validOptions.length === 0) {
      toast.error('Please add at least one option');
      return;
    }

    try {
      await bulkCreateMutation.mutateAsync({
        variationId: variation.id,
        data: { options: validOptions },
      });
      toast.success('Options saved successfully');
      setOptions([{ value: '', label: '' }]);
      onClose();
    } catch (error) {
      toast.error('Failed to save options');
    }
  };

  const handleDeleteExisting = async (optionId: number) => {
    if (!variation) return;

    try {
      await deleteMutation.mutateAsync({
        variationId: variation.id,
        optionId,
      });
      toast.success('Option deleted');
    } catch (error) {
      toast.error('Failed to delete option');
    }
  };

  if (!isOpen || !variation) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Manage Options</h2>
            <p className="text-sm text-gray-500">{variation.name}</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 transition-all hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Existing Options */}
          {variation.options && variation.options.length > 0 && (
            <div className="mb-6">
              <h3 className="mb-3 text-sm font-semibold text-gray-900">Existing Options</h3>
              <div className="space-y-2">
                {variation.options.map((option) => (
                  <div
                    key={option.id}
                    className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-3"
                  >
                    <div>
                      <span className="font-medium text-gray-900">{option.label || option.value}</span>
                      {option.label && option.label !== option.value && (
                        <span className="ml-2 text-sm text-gray-500">({option.value})</span>
                      )}
                    </div>
                    <button
                      onClick={() => handleDeleteExisting(option.id)}
                      className="text-red-600 hover:text-red-700"
                      title="Delete option"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add New Options */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-gray-900">Add New Options</h3>
            <div className="space-y-3">
              {options.map((option, index) => (
                <div key={index} className="flex gap-3">
                  <input
                    type="text"
                    value={option.value}
                    onChange={(e) => handleUpdateOption(index, 'value', e.target.value)}
                    placeholder="Value (e.g., S, red)"
                    className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm transition-all focus:border-[#FF6F00] focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
                  />
                  <input
                    type="text"
                    value={option.label}
                    onChange={(e) => handleUpdateOption(index, 'label', e.target.value)}
                    placeholder="Label (e.g., Small, Red)"
                    className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm transition-all focus:border-[#FF6F00] focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveOption(index)}
                    className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                    title="Remove"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={handleAddOption}
              className="mt-3 flex items-center gap-2 text-sm text-[#FF6F00] hover:text-[#E65100]"
            >
              <Plus className="h-4 w-4" />
              Add Another Option
            </button>
          </div>

          {/* Actions */}
          <div className="mt-6 flex items-center justify-end gap-3 border-t border-gray-200 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-gray-300 px-6 py-2.5 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={bulkCreateMutation.isPending}
              className="rounded-xl bg-gradient-to-r from-[#FF6F00] to-[#E65100] px-6 py-2.5 text-sm font-medium text-white shadow-lg shadow-orange-500/30 transition-all hover:shadow-xl hover:shadow-orange-500/40 disabled:opacity-50"
            >
              {bulkCreateMutation.isPending ? 'Saving...' : 'Save Options'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
