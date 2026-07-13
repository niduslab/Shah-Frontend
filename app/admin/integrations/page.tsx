'use client';

import { useState } from 'react';
import {
  Plus,
  Pencil,
  Trash2,
  CheckCircle2,
  XCircle,
  ExternalLink,
  ShieldCheck,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  useTrackingPixels,
  useCreateTrackingPixel,
  useUpdateTrackingPixel,
  useDeleteTrackingPixel,
  useToggleTrackingPixel,
  useVerifyTrackingPixel,
  TrackingPixel,
  TrackingPixelPayload,
  TrackingPixelProvider,
} from '@/lib/hooks/admin';

const PROVIDERS: {
  value: TrackingPixelProvider;
  label: string;
  placeholder: string;
  help: string;
}[] = [
  {
    value: 'facebook_pixel',
    label: 'Facebook Pixel',
    placeholder: '123456789012345',
    help: 'Your Meta/Facebook Pixel ID (numeric).',
  },
  {
    value: 'google_ads',
    label: 'Google Ads',
    placeholder: 'AW-123456789',
    help: 'Google Ads conversion ID, e.g. AW-123456789.',
  },
  {
    value: 'google_analytics',
    label: 'Google Analytics (GA4)',
    placeholder: 'G-XXXXXXXXXX',
    help: 'GA4 Measurement ID (G-...) or legacy UA-XXXXXX-Y.',
  },
  {
    value: 'gtm',
    label: 'Google Tag Manager',
    placeholder: 'GTM-XXXXXXX',
    help: 'GTM Container ID, e.g. GTM-XXXXXXX.',
  },
  {
    value: 'custom',
    label: 'Custom Script',
    placeholder: '',
    help: 'Paste a raw <script> snippet from any provider.',
  },
];

const providerLabel = (p: TrackingPixelProvider) =>
  PROVIDERS.find((x) => x.value === p)?.label ?? p;

const emptyForm: TrackingPixelPayload = {
  provider: 'facebook_pixel',
  name: '',
  pixel_id: '',
  custom_head_script: '',
  custom_body_script: '',
  placement: 'head',
  is_active: false,
  gtm_dashboard_url: '',
  notes: '',
};

export default function IntegrationsPage() {
  const { data, isLoading } = useTrackingPixels();
  const createMutation = useCreateTrackingPixel();
  const updateMutation = useUpdateTrackingPixel();
  const deleteMutation = useDeleteTrackingPixel();
  const toggleMutation = useToggleTrackingPixel();
  const verifyMutation = useVerifyTrackingPixel();

  const pixels: TrackingPixel[] = (data as any)?.data ?? [];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<TrackingPixel | null>(null);
  const [form, setForm] = useState<TrackingPixelPayload>(emptyForm);
  const [verifyingId, setVerifyingId] = useState<number | null>(null);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setIsModalOpen(true);
  };

  const openEdit = (pixel: TrackingPixel) => {
    setEditing(pixel);
    setForm({
      provider: pixel.provider,
      name: pixel.name,
      pixel_id: pixel.pixel_id ?? '',
      custom_head_script: pixel.custom_head_script ?? '',
      custom_body_script: pixel.custom_body_script ?? '',
      placement: pixel.placement,
      is_active: pixel.is_active,
      gtm_dashboard_url: pixel.gtm_dashboard_url ?? '',
      notes: pixel.notes ?? '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error('Please enter a name for this integration.');
      return;
    }
    if (form.provider !== 'custom' && !form.pixel_id?.trim()) {
      toast.error('Please enter the tracking ID for this provider.');
      return;
    }

    try {
      if (editing) {
        await updateMutation.mutateAsync({ id: editing.id, payload: form });
        toast.success('Integration updated successfully.');
      } else {
        await createMutation.mutateAsync(form);
        toast.success('Integration created successfully.');
      }
      setIsModalOpen(false);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to save integration.');
    }
  };

  const handleToggle = async (pixel: TrackingPixel) => {
    try {
      await toggleMutation.mutateAsync(pixel.id);
      toast.success(pixel.is_active ? 'Integration deactivated.' : 'Integration activated.');
    } catch {
      toast.error('Failed to update status.');
    }
  };

  const handleDelete = async (pixel: TrackingPixel) => {
    if (!confirm(`Delete "${pixel.name}"? This cannot be undone.`)) return;
    try {
      await deleteMutation.mutateAsync(pixel.id);
      toast.success('Integration deleted.');
    } catch {
      toast.error('Failed to delete integration.');
    }
  };

  const handleVerify = async (pixel: TrackingPixel) => {
    setVerifyingId(pixel.id);
    try {
      const res = await verifyMutation.mutateAsync(pixel.id);
      const verified = res?.data?.verified;
      if (verified) {
        toast.success(res?.data?.message || 'Configuration is valid.');
      } else {
        toast.error(res?.data?.message || 'Configuration is invalid.');
      }
    } catch {
      toast.error('Verification failed.');
    } finally {
      setVerifyingId(null);
    }
  };

  const selectedProvider = PROVIDERS.find((p) => p.value === form.provider)!;

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pixel &amp; Tag Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Integrate and verify third-party tracking codes — Facebook Pixel, Google Ads,
            Google Analytics and Google Tag Manager.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-orange-400 to-orange-500 px-4 py-2.5 text-sm font-medium text-white shadow-md transition-opacity hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          Add Integration
        </button>
      </div>

      {/* List */}
      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        {isLoading ? (
          <div className="flex items-center justify-center py-20 text-gray-400">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : pixels.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
            <ShieldCheck className="h-10 w-10 text-gray-300" />
            <p className="text-sm text-gray-500">
              No tracking integrations yet. Add your first pixel or tag to get started.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50">
                <tr>
                  {['Name', 'Provider', 'Tracking ID', 'Status', 'Actions'].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {pixels.map((pixel) => (
                  <tr key={pixel.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{pixel.name}</div>
                      {pixel.gtm_dashboard_url && (
                        <a
                          href={pixel.gtm_dashboard_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-0.5 inline-flex items-center gap-1 text-xs text-orange-600 hover:underline"
                        >
                          Open dashboard <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {providerLabel(pixel.provider)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <code className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-700">
                          {pixel.pixel_id || (pixel.provider === 'custom' ? 'Custom script' : '—')}
                        </code>
                        {pixel.provider !== 'custom' &&
                          (pixel.id_valid ? (
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-400" />
                          ))}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleToggle(pixel)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          pixel.is_active ? 'bg-green-500' : 'bg-gray-300'
                        }`}
                        aria-label={pixel.is_active ? 'Deactivate' : 'Activate'}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            pixel.is_active ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleVerify(pixel)}
                          disabled={verifyingId === pixel.id}
                          title="Verify configuration"
                          className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-green-600 disabled:opacity-50"
                        >
                          {verifyingId === pixel.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <ShieldCheck className="h-4 w-4" />
                          )}
                        </button>
                        <button
                          onClick={() => openEdit(pixel)}
                          title="Edit"
                          className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-orange-600"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(pixel)}
                          title="Delete"
                          className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <h2 className="text-lg font-semibold text-gray-900">
                {editing ? 'Edit Integration' : 'Add Integration'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 px-6 py-5">
              {/* Provider */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Provider</label>
                <select
                  value={form.provider}
                  onChange={(e) =>
                    setForm({ ...form, provider: e.target.value as TrackingPixelProvider })
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange-400 focus:outline-none focus:ring-1 focus:ring-orange-400"
                >
                  {PROVIDERS.map((p) => (
                    <option key={p.value} value={p.value}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Name */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Main Facebook Pixel"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange-400 focus:outline-none focus:ring-1 focus:ring-orange-400"
                />
              </div>

              {/* Pixel ID (non-custom) */}
              {form.provider !== 'custom' && (
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Tracking ID
                  </label>
                  <input
                    type="text"
                    value={form.pixel_id ?? ''}
                    onChange={(e) => setForm({ ...form, pixel_id: e.target.value })}
                    placeholder={selectedProvider.placeholder}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange-400 focus:outline-none focus:ring-1 focus:ring-orange-400"
                  />
                  <p className="mt-1 text-xs text-gray-400">{selectedProvider.help}</p>
                </div>
              )}

              {/* Custom scripts */}
              {form.provider === 'custom' && (
                <>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Head Script
                    </label>
                    <textarea
                      value={form.custom_head_script ?? ''}
                      onChange={(e) =>
                        setForm({ ...form, custom_head_script: e.target.value })
                      }
                      rows={4}
                      placeholder="<script>...</script>"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 font-mono text-xs focus:border-orange-400 focus:outline-none focus:ring-1 focus:ring-orange-400"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Body Script
                    </label>
                    <textarea
                      value={form.custom_body_script ?? ''}
                      onChange={(e) =>
                        setForm({ ...form, custom_body_script: e.target.value })
                      }
                      rows={4}
                      placeholder="<noscript>...</noscript>"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 font-mono text-xs focus:border-orange-400 focus:outline-none focus:ring-1 focus:ring-orange-400"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Placement
                    </label>
                    <select
                      value={form.placement}
                      onChange={(e) =>
                        setForm({ ...form, placement: e.target.value as any })
                      }
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange-400 focus:outline-none focus:ring-1 focus:ring-orange-400"
                    >
                      <option value="head">Head</option>
                      <option value="body_top">Body (top)</option>
                      <option value="body_bottom">Body (bottom)</option>
                    </select>
                  </div>
                </>
              )}

              {/* Dashboard URL (GTM / Ads) */}
              {(form.provider === 'gtm' || form.provider === 'google_ads') && (
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Dashboard URL <span className="text-gray-400">(optional)</span>
                  </label>
                  <input
                    type="url"
                    value={form.gtm_dashboard_url ?? ''}
                    onChange={(e) =>
                      setForm({ ...form, gtm_dashboard_url: e.target.value })
                    }
                    placeholder="https://tagmanager.google.com/..."
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange-400 focus:outline-none focus:ring-1 focus:ring-orange-400"
                  />
                  <p className="mt-1 text-xs text-gray-400">
                    Quick link to the provider dashboard for this container/account.
                  </p>
                </div>
              )}

              {/* Notes */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Notes <span className="text-gray-400">(optional)</span>
                </label>
                <textarea
                  value={form.notes ?? ''}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  rows={2}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange-400 focus:outline-none focus:ring-1 focus:ring-orange-400"
                />
              </div>

              {/* Active toggle */}
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={!!form.is_active}
                  onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300 text-orange-500 focus:ring-orange-400"
                />
                <span className="text-sm text-gray-700">
                  Active (inject on the storefront)
                </span>
              </label>

              {/* Actions */}
              <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-orange-400 to-orange-500 px-4 py-2 text-sm font-medium text-white shadow-md transition-opacity hover:opacity-90 disabled:opacity-50"
                >
                  {(createMutation.isPending || updateMutation.isPending) && (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  )}
                  {editing ? 'Save Changes' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
