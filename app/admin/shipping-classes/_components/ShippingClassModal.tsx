'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { toast } from 'sonner';
import { useCreateShippingClass, useUpdateShippingClass } from '@/lib/hooks/admin/useShipping';

interface ShippingClassModalProps {
  shippingClass?: any;
  onClose: () => void;
}

export default function ShippingClassModal({ shippingClass, onClose }: ShippingClassModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const createClass = useCreateShippingClass({
    onSuccess: () => {
      toast.success('Shipping class created successfully');
      onClose();
    },
    onError: (error: any) => {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
      toast.error(error.response?.data?.message || 'Failed to create shipping class');
    },
  });

  const updateClass = useUpdateShippingClass({
    onSuccess: () => {
      toast.success('Shipping class updated successfully');
      onClose();
    },
    onError: (error: any) => {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
      toast.error(error.response?.data?.message || 'Failed to update shipping class');
    },
  });

  useEffect(() => {
    if (shippingClass) {
      setFormData({
        name: shippingClass.name || '',
        description: shippingClass.description || '',
      });
    }
  }, [shippingClass]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const payload = {
      name: formData.name,
      description: formData.description || null,
    };

    if (shippingClass) {
      await updateClass.mutateAsync({ id: shippingClass.id, data: payload });
    } else {
      await createClass.mutateAsync(payload);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-sm bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-xl font-semibold text-gray-900">
            {shippingClass ? 'Edit Shipping Class' : 'Add Shipping Class'}
          </h2>
          <button
            onClick={onClose}
            className="rounded-sm p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            {/* Name */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full rounded-sm border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                placeholder="e.g., Heavy Equipment, Fragile Items"
              />
              {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
            </div>

            {/* Description */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full rounded-sm border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                placeholder="Describe this shipping class..."
              />
              {errors.description && <p className="mt-1 text-xs text-red-600">{errors.description}</p>}
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-sm border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createClass.isPending || updateClass.isPending}
              className="rounded-sm bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {createClass.isPending || updateClass.isPending ? 'Saving...' : shippingClass ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
