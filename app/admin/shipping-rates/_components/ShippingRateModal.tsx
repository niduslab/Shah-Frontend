'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useCreateShippingRate, useUpdateShippingRate, useShippingClasses } from '@/lib/hooks/admin/useShipping';

interface ShippingRateModalProps {
  rate?: any;
  onClose: () => void;
}

export default function ShippingRateModal({ rate, onClose }: ShippingRateModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    method: 'pathao_courier' as 'pathao_courier' | 'shah_sports_team' | 'standard',
    shipping_class_id: '',
    base_cost: '',
    free_shipping_min_order: '',
    delivery_time: '',
    is_active: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const { data: classesData } = useShippingClasses();
  const shippingClasses = (classesData as any)?.data || [];

  const createRate = useCreateShippingRate({
    onSuccess: () => {
      onClose();
    },
    onError: (error: any) => {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
    },
  });

  const updateRate = useUpdateShippingRate({
    onSuccess: () => {
      onClose();
    },
    onError: (error: any) => {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
    },
  });

  useEffect(() => {
    if (rate) {
      setFormData({
        name: rate.name || '',
        method: rate.method || 'pathao_courier',
        shipping_class_id: rate.shipping_class_id?.toString() || '',
        base_cost: rate.base_cost?.toString() || '',
        free_shipping_min_order: rate.free_shipping_min_order?.toString() || '',
        delivery_time: rate.delivery_time || '',
        is_active: rate.is_active ?? true,
      });
    }
  }, [rate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const payload = {
      name: formData.name,
      method: formData.method,
      shipping_class_id: formData.shipping_class_id ? parseInt(formData.shipping_class_id) : null,
      base_cost: parseFloat(formData.base_cost),
      free_shipping_min_order: formData.free_shipping_min_order ? parseFloat(formData.free_shipping_min_order) : 0,
      delivery_time: formData.delivery_time || null,
      is_active: formData.is_active,
    };

    if (rate) {
      await updateRate.mutateAsync({ id: rate.id, data: payload });
    } else {
      await createRate.mutateAsync(payload);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-sm bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-xl font-semibold text-gray-900">
            {rate ? 'Edit Shipping Rate' : 'Add Shipping Rate'}
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
                placeholder="e.g., Standard Pathao Dhaka"
              />
              {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
            </div>

            {/* Method */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Shipping Method <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.method}
                onChange={(e) => setFormData({ ...formData, method: e.target.value as any })}
                className="w-full rounded-sm border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
              >
                <option value="pathao_courier">Pathao Courier</option>
                <option value="shah_sports_team">Shah Sports Team</option>
                <option value="standard">Standard Shipping</option>
              </select>
              {errors.method && <p className="mt-1 text-xs text-red-600">{errors.method}</p>}
            </div>

            {/* Shipping Class */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Shipping Class
              </label>
              <select
                value={formData.shipping_class_id}
                onChange={(e) => setFormData({ ...formData, shipping_class_id: e.target.value })}
                className="w-full rounded-sm border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
              >
                <option value="">No Class (default rate for this method)</option>
                {shippingClasses.map((cls: any) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-gray-500">
                Applies to products in this class. Keep one &quot;No Class&quot; rate per method as the fallback for products with no class set.
              </p>
            </div>

            {/* Base Cost */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Base Cost (৳) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.base_cost}
                onChange={(e) => setFormData({ ...formData, base_cost: e.target.value })}
                className="w-full rounded-sm border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                placeholder="0.00"
              />
              {errors.base_cost && <p className="mt-1 text-xs text-red-600">{errors.base_cost}</p>}
            </div>

            {/* Free Shipping Threshold */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Free Shipping Threshold (৳)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.free_shipping_min_order}
                onChange={(e) => setFormData({ ...formData, free_shipping_min_order: e.target.value })}
                className="w-full rounded-sm border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                placeholder="0 = no free shipping"
              />
              <p className="mt-1 text-xs text-gray-500">
                Orders at or above this amount ship free on this rate. Leave 0 to disable free shipping.
              </p>
              {errors.free_shipping_min_order && <p className="mt-1 text-xs text-red-600">{errors.free_shipping_min_order}</p>}
            </div>

            {/* Delivery Time */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Delivery Time
              </label>
              <input
                type="text"
                value={formData.delivery_time}
                onChange={(e) => setFormData({ ...formData, delivery_time: e.target.value })}
                className="w-full rounded-sm border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                placeholder="e.g., 1-2 business days"
              />
            </div>

            {/* Active Status */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_active"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
              />
              <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
                Active
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-sm border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createRate.isPending || updateRate.isPending}
              className="rounded-sm bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {createRate.isPending || updateRate.isPending ? 'Saving...' : rate ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
