'use client';

import { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import {
  useCreateShippingRate,
  useUpdateShippingRate,
  useShippingClasses,
  useWeightCostRule,
  useSaveWeightCostRule,
  WeightCostRuleItem,
} from '@/lib/hooks/admin/useShipping';

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

  const [weightPricingEnabled, setWeightPricingEnabled] = useState(false);
  const [calculationMethod, setCalculationMethod] = useState<'per_unit' | 'rules'>('rules');
  const [perUnitCost, setPerUnitCost] = useState('');
  const [defaultRuleCost, setDefaultRuleCost] = useState('');
  const [tiers, setTiers] = useState<WeightCostRuleItem[]>([{ weight: 0, cost: 0 }]);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const { data: classesData } = useShippingClasses();
  const shippingClasses = (classesData as any)?.data || [];

  const { data: weightRuleData } = useWeightCostRule(rate?.id, { enabled: !!rate?.id });

  const createRate = useCreateShippingRate({
    onError: (error: any) => {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
    },
  });

  const updateRate = useUpdateShippingRate({
    onError: (error: any) => {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
    },
  });

  const saveWeightCostRule = useSaveWeightCostRule({
    onError: (error: any) => {
      if (error.response?.data?.errors) {
        setErrors((prev) => ({ ...prev, ...error.response.data.errors }));
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
      setWeightPricingEnabled(rate.weight_pricing_enabled ?? false);
    }
  }, [rate]);

  useEffect(() => {
    const weightRule = (weightRuleData as any)?.data;
    if (weightRule) {
      setCalculationMethod(weightRule.shipping_calculation_method || 'rules');
      setPerUnitCost(weightRule.per_unit_cost?.toString() || '');
      setDefaultRuleCost(weightRule.default_rule_cost?.toString() || '');
      if (weightRule.items?.length) {
        setTiers(weightRule.items.map((item: WeightCostRuleItem) => ({ weight: item.weight, cost: item.cost })));
      }
    }
  }, [weightRuleData]);

  const addTier = () => {
    setTiers([...tiers, { weight: 0, cost: 0 }]);
  };

  const removeTier = (index: number) => {
    setTiers(tiers.filter((_, i) => i !== index));
  };

  const updateTier = (index: number, field: 'weight' | 'cost', value: string) => {
    const next = [...tiers];
    next[index] = { ...next[index], [field]: parseFloat(value) || 0 };
    setTiers(next);
  };

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
      weight_pricing_enabled: weightPricingEnabled,
      is_active: formData.is_active,
    };

    let rateId = rate?.id;
    if (rate) {
      await updateRate.mutateAsync({ id: rate.id, data: payload });
    } else {
      const created = await createRate.mutateAsync(payload);
      rateId = created?.data?.id;
    }

    if (rateId) {
      await saveWeightCostRule.mutateAsync({
        rateId,
        data: {
          weight_pricing_enabled: weightPricingEnabled,
          shipping_calculation_method: calculationMethod,
          per_unit_cost: calculationMethod === 'per_unit' ? parseFloat(perUnitCost) || 0 : null,
          default_rule_cost: defaultRuleCost ? parseFloat(defaultRuleCost) : 0,
          items: calculationMethod === 'rules' ? tiers : undefined,
        },
      });
    }

    onClose();
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

            {/* Weight-Based Pricing */}
            <div className="rounded-sm border border-gray-200 p-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="weight_pricing_enabled"
                  checked={weightPricingEnabled}
                  onChange={(e) => setWeightPricingEnabled(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
                />
                <label htmlFor="weight_pricing_enabled" className="text-sm font-medium text-gray-700">
                  Enable weight-based pricing
                </label>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Charge extra on top of Base Cost depending on total cart weight. When disabled, orders on this rate always cost the flat Base Cost.
              </p>

              {weightPricingEnabled && (
                <div className="mt-4 space-y-4 border-t border-gray-200 pt-4">
                  {/* Calculation Method */}
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Calculation Method</label>
                    <select
                      value={calculationMethod}
                      onChange={(e) => setCalculationMethod(e.target.value as 'per_unit' | 'rules')}
                      className="w-full rounded-sm border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                    >
                      <option value="rules">Weight Tiers (e.g. 2-4kg = X, 5-8kg = Y)</option>
                      <option value="per_unit">Per Kg (cost × total weight)</option>
                    </select>
                  </div>

                  {calculationMethod === 'per_unit' ? (
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">Cost per Kg (৳)</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={perUnitCost}
                        onChange={(e) => setPerUnitCost(e.target.value)}
                        className="w-full rounded-sm border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                        placeholder="0.00"
                      />
                      {errors.per_unit_cost && <p className="mt-1 text-xs text-red-600">{errors.per_unit_cost}</p>}
                    </div>
                  ) : (
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">Weight Tiers</label>
                      <p className="mb-2 text-xs text-gray-500">
                        Each row means: if total cart weight is up to this many kg, add this extra cost on top of Base Cost.
                      </p>
                      <div className="space-y-2">
                        {tiers.map((tier, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <div className="flex-1">
                              <input
                                type="number"
                                step="0.01"
                                min="0.01"
                                value={tier.weight || ''}
                                onChange={(e) => updateTier(index, 'weight', e.target.value)}
                                className="w-full rounded-sm border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                                placeholder="Up to kg (e.g. 4)"
                              />
                            </div>
                            <span className="text-sm text-gray-400">→</span>
                            <div className="flex-1">
                              <input
                                type="number"
                                step="0.01"
                                min="0"
                                value={tier.cost || ''}
                                onChange={(e) => updateTier(index, 'cost', e.target.value)}
                                className="w-full rounded-sm border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                                placeholder="Extra cost (৳)"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => removeTier(index)}
                              disabled={tiers.length === 1}
                              className="rounded-sm p-2 text-gray-400 hover:bg-gray-100 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-30"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={addTier}
                        className="mt-2 flex items-center gap-1 text-sm font-medium text-black hover:underline"
                      >
                        <Plus className="h-4 w-4" /> Add Weight Tier
                      </button>

                      <div className="mt-3">
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                          Default Cost (above heaviest tier)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={defaultRuleCost}
                          onChange={(e) => setDefaultRuleCost(e.target.value)}
                          className="w-full rounded-sm border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                          placeholder="0.00"
                        />
                        <p className="mt-1 text-xs text-gray-500">
                          Extra cost applied when cart weight exceeds every tier above.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
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
              disabled={createRate.isPending || updateRate.isPending || saveWeightCostRule.isPending}
              className="rounded-sm bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {createRate.isPending || updateRate.isPending || saveWeightCostRule.isPending
                ? 'Saving...'
                : rate
                ? 'Update'
                : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
