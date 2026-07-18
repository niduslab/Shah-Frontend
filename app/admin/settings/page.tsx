'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  Loader2,
  Save,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Linkedin,
  ImageIcon,
  Trash2,
  Upload,
} from 'lucide-react';
import { toast } from 'sonner';
import { useSiteSettings, useUpdateSiteSettings, SiteSettingsPayload } from '@/lib/hooks/admin';

export default function SettingsPage() {
  const { data, isLoading } = useSiteSettings();
  const updateMutation = useUpdateSiteSettings();
  const settings = data?.data;

  return settings ? (
    <SettingsForm settings={settings} updateMutation={updateMutation} />
  ) : isLoading ? (
    <div className="flex items-center justify-center py-20 text-gray-400">
      <Loader2 className="h-6 w-6 animate-spin" />
    </div>
  ) : null;
}

function SettingsForm({
  settings,
  updateMutation,
}: {
  settings: NonNullable<ReturnType<typeof useSiteSettings>['data']>['data'];
  updateMutation: ReturnType<typeof useUpdateSiteSettings>;
}) {
  const [form, setForm] = useState<SiteSettingsPayload>({
    contact_email: settings.contact_email ?? '',
    contact_phone: settings.contact_phone ?? '',
    contact_address: settings.contact_address ?? '',
    facebook_url: settings.facebook_url ?? '',
    twitter_url: settings.twitter_url ?? '',
    instagram_url: settings.instagram_url ?? '',
    youtube_url: settings.youtube_url ?? '',
    linkedin_url: settings.linkedin_url ?? '',
  });
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(
    settings.payment_banner_url ?? null
  );
  const [removeBanner, setRemoveBanner] = useState(false);

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBannerFile(file);
    setRemoveBanner(false);
    setBannerPreview(URL.createObjectURL(file));
  };

  const handleRemoveBanner = () => {
    setBannerFile(null);
    setBannerPreview(null);
    setRemoveBanner(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateMutation.mutateAsync({
        ...form,
        payment_banner: bannerFile,
        remove_payment_banner: removeBanner,
      });
      toast.success('Site settings updated successfully.');
      setBannerFile(null);
      setRemoveBanner(false);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to update site settings.');
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Site Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage the contact details, social links, and payment banner shown across the storefront.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Contact Info */}
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-base font-semibold text-gray-900">Contact Information</h2>
          <div className="space-y-4">
            <Field
              icon={Mail}
              label="Email"
              type="email"
              value={form.contact_email ?? ''}
              placeholder="info@shahsports.com.bd"
              onChange={(v) => setForm({ ...form, contact_email: v })}
            />
            <Field
              icon={Phone}
              label="Phone"
              value={form.contact_phone ?? ''}
              placeholder="880-1615550080 | 880-1615550079"
              onChange={(v) => setForm({ ...form, contact_phone: v })}
            />
            <Field
              icon={MapPin}
              label="Address"
              value={form.contact_address ?? ''}
              placeholder="223/A, Tejgaon Industrial Area, Gulshan Link Road, Dhaka-1208"
              onChange={(v) => setForm({ ...form, contact_address: v })}
            />
          </div>
        </div>

        {/* Social Links */}
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-base font-semibold text-gray-900">Social Links</h2>
          <div className="space-y-4">
            <Field
              icon={Facebook}
              label="Facebook"
              type="url"
              value={form.facebook_url ?? ''}
              placeholder="https://facebook.com/shahsports"
              onChange={(v) => setForm({ ...form, facebook_url: v })}
            />
            <Field
              icon={Twitter}
              label="Twitter / X"
              type="url"
              value={form.twitter_url ?? ''}
              placeholder="https://twitter.com/shahsports"
              onChange={(v) => setForm({ ...form, twitter_url: v })}
            />
            <Field
              icon={Instagram}
              label="Instagram"
              type="url"
              value={form.instagram_url ?? ''}
              placeholder="https://instagram.com/shahsports"
              onChange={(v) => setForm({ ...form, instagram_url: v })}
            />
            <Field
              icon={Youtube}
              label="YouTube"
              type="url"
              value={form.youtube_url ?? ''}
              placeholder="https://youtube.com/@shahsports"
              onChange={(v) => setForm({ ...form, youtube_url: v })}
            />
            <Field
              icon={Linkedin}
              label="LinkedIn"
              type="url"
              value={form.linkedin_url ?? ''}
              placeholder="https://linkedin.com/company/shahsports"
              onChange={(v) => setForm({ ...form, linkedin_url: v })}
            />
          </div>
        </div>

        {/* Payment Banner */}
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm lg:col-span-2">
          <h2 className="mb-1 text-base font-semibold text-gray-900">Payment / Trust Banner</h2>
          <p className="mb-4 text-sm text-gray-500">
            Shown as a full-width strip in the footer above the copyright bar (e.g. SSLCommerz
            accepted payment methods).
          </p>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex h-16 w-full max-w-md items-center justify-center overflow-hidden rounded-lg border border-dashed border-gray-300 bg-gray-50">
              {bannerPreview ? (
                <Image
                  src={bannerPreview}
                  alt="Payment banner preview"
                  fill
                  unoptimized
                  className="object-contain p-2"
                />
              ) : (
                <div className="flex flex-col items-center gap-1 text-gray-400">
                  <ImageIcon className="h-6 w-6" />
                  <span className="text-xs">No banner uploaded</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                <Upload className="h-4 w-4" />
                {bannerPreview ? 'Replace' : 'Upload'}
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  onChange={handleBannerChange}
                />
              </label>
              {bannerPreview && (
                <button
                  type="button"
                  onClick={handleRemoveBanner}
                  className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                  Remove
                </button>
              )}
            </div>
          </div>
          <p className="mt-2 text-xs text-gray-400">PNG, JPG or WEBP. Max 2MB.</p>
        </div>

        {/* Actions */}
        <div className="flex justify-end lg:col-span-2">
          <button
            type="submit"
            disabled={updateMutation.isPending}
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-orange-400 to-orange-500 px-5 py-2.5 text-sm font-medium text-white shadow-md transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {updateMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({
  icon: Icon,
  label,
  value,
  placeholder,
  type = 'text',
  onChange,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  placeholder?: string;
  type?: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700">{label}</label>
      <div className="relative">
        <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm focus:border-orange-400 focus:outline-none focus:ring-1 focus:ring-orange-400"
        />
      </div>
    </div>
  );
}
