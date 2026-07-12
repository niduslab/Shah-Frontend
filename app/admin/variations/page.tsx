'use client';

import { useState } from 'react';
import { Plus, Edit2, Trash2, Settings, Tag } from 'lucide-react';
import { toast } from 'sonner';
import {
  useAdminVariations,
  useCreateVariationType,
  useUpdateVariationType,
  useDeleteVariationType,
  type VariationType,
} from '@/lib/hooks/admin/useAdminVariations';
import VariationTypeModal from './_components/VariationTypeModal';
import VariationOptionsModal from './_components/VariationOptionsModal';
import DeleteConfirmModal from './_components/DeleteConfirmModal';

export default function VariationsPage() {
  const [isTypeModalOpen, setIsTypeModalOpen] = useState(false);
  const [isOptionsModalOpen, setIsOptionsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedVariation, setSelectedVariation] = useState<VariationType | null>(null);

  const { data: variationsData, isLoading } = useAdminVariations();
  const createMutation = useCreateVariationType();
  const updateMutation = useUpdateVariationType();
  const deleteMutation = useDeleteVariationType();

  const variations = (variationsData as any)?.data || [];

  const handleCreateType = () => {
    setSelectedVariation(null);
    setIsTypeModalOpen(true);
  };

  const handleEditType = (variation: VariationType) => {
    setSelectedVariation(variation);
    setIsTypeModalOpen(true);
  };

  const handleManageOptions = (variation: VariationType) => {
    setSelectedVariation(variation);
    setIsOptionsModalOpen(true);
  };

  const handleDeleteType = (variation: VariationType) => {
    setSelectedVariation(variation);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedVariation) {
      try {
        await deleteMutation.mutateAsync(selectedVariation.id);
        toast.success('Variation type deleted successfully');
        setIsDeleteModalOpen(false);
        setSelectedVariation(null);
      } catch (error) {
        toast.error('Failed to delete variation type');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-xl">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-[#FF6F00]"></div>
          </div>
          <p className="text-sm font-medium text-gray-600">Loading variations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF6F00] to-[#E65100] shadow-lg shadow-orange-500/30">
              <Settings className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Product Variations</h1>
              <p className="text-sm text-gray-600">Manage variation types and options (Size, Color, etc.)</p>
            </div>
          </div>
        </div>

        {/* Info Banner */}
        <div className="mb-6 rounded-2xl bg-blue-50 border border-blue-200 p-4">
          <div className="flex gap-3">
            <Tag className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">How Variations Work</h3>
              <p className="text-sm text-blue-700">
                1. Create variation types (e.g., "Size", "Color") <br />
                2. Add options to each type (e.g., S, M, L for Size) <br />
                3. When creating products, select which options apply to create product variations
              </p>
            </div>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="mb-6 rounded-2xl bg-white p-5 shadow-lg ring-1 ring-gray-200">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Variation Types</h2>
              <p className="text-sm text-gray-500">
                {variations.length} type{variations.length !== 1 ? 's' : ''} configured
              </p>
            </div>
            <button
              onClick={handleCreateType}
              className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FF6F00] to-[#E65100] px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-orange-500/30 transition-all hover:shadow-xl hover:shadow-orange-500/40"
            >
              <Plus className="h-5 w-5" />
              Add Variation Type
            </button>
          </div>
        </div>

        {/* Variations Grid */}
        {variations.length === 0 ? (
          <div className="rounded-2xl bg-white p-16 text-center shadow-lg ring-1 ring-gray-200">
            <div className="mb-5 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200">
              <Settings className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-gray-900">No variation types yet</h3>
            <p className="mb-8 text-gray-500">
              Create variation types like Size, Color, Material to manage product variations
            </p>
            <button
              onClick={handleCreateType}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#FF6F00] to-[#E65100] px-6 py-3 text-sm font-medium text-white shadow-lg shadow-orange-500/30"
            >
              <Plus className="h-5 w-5" />
              Create First Variation Type
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {variations.map((variation: VariationType) => (
              <div
                key={variation.id}
                className="group rounded-2xl bg-white p-6 shadow-lg ring-1 ring-gray-200 transition-all hover:shadow-xl"
              >
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-semibold text-gray-900">{variation.name}</h3>
                      <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600 ring-1 ring-gray-600/20">
                        ID: {variation.id}
                      </span>
                    </div>
                    {variation.description && (
                      <p className="mt-1 text-sm text-gray-500">{variation.description}</p>
                    )}
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      variation.is_active
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {variation.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>

                {/* Options Count */}
                <div className="mb-4 rounded-lg bg-gray-50 p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Options</span>
                    <span className="text-lg font-bold text-gray-900">
                      {variation.options?.length || 0}
                    </span>
                  </div>
                  {variation.options && variation.options.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {variation.options.slice(0, 5).map((option) => (
                        <span
                          key={option.id}
                          className="rounded bg-white px-2 py-0.5 text-xs text-gray-700 ring-1 ring-gray-200"
                        >
                          {option.label || option.value}
                        </span>
                      ))}
                      {variation.options.length > 5 && (
                        <span className="text-xs text-gray-500">
                          +{variation.options.length - 5} more
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleManageOptions(variation)}
                    className="flex-1 rounded-lg bg-[#FF6F00] px-3 py-2 text-sm font-medium text-white transition-all hover:bg-[#E65100]"
                  >
                    Manage Options
                  </button>
                  <button
                    onClick={() => handleEditType(variation)}
                    className="rounded-lg p-2 text-gray-600 transition-all hover:bg-gray-100"
                    title="Edit type"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteType(variation)}
                    className="rounded-lg p-2 text-red-600 transition-all hover:bg-red-50"
                    title="Delete type"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modals */}
        <VariationTypeModal
          isOpen={isTypeModalOpen}
          onClose={() => {
            setIsTypeModalOpen(false);
            setSelectedVariation(null);
          }}
          variation={selectedVariation}
          onSubmit={async (data) => {
            try {
              if (selectedVariation) {
                await updateMutation.mutateAsync({ id: selectedVariation.id, data });
                toast.success('Variation type updated successfully');
              } else {
                await createMutation.mutateAsync(data);
                toast.success('Variation type created successfully');
              }
              setIsTypeModalOpen(false);
              setSelectedVariation(null);
            } catch (error) {
              toast.error('Failed to save variation type');
            }
          }}
        />

        <VariationOptionsModal
          isOpen={isOptionsModalOpen}
          onClose={() => {
            setIsOptionsModalOpen(false);
            setSelectedVariation(null);
          }}
          variation={selectedVariation}
        />

        <DeleteConfirmModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setSelectedVariation(null);
          }}
          onConfirm={confirmDelete}
          variationName={selectedVariation?.name || ''}
          isLoading={deleteMutation.isPending}
        />
      </div>
    </div>
  );
}
