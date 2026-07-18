import { API_ORIGIN } from '@/lib/config/api';

export interface PublicSiteSettings {
  contact_email: string | null;
  contact_phone: string | null;
  contact_address: string | null;
  facebook_url: string | null;
  twitter_url: string | null;
  instagram_url: string | null;
  youtube_url: string | null;
  linkedin_url: string | null;
  payment_banner_url: string | null;
}

const FETCH_TIMEOUT_MS = 5000;

/**
 * Server-side fetch of the public site settings (contact info, social links,
 * payment banner). Falls back to null on any failure so the footer/top-bar can
 * render their hardcoded defaults instead of breaking the page.
 */
export async function getSiteSettings(): Promise<PublicSiteSettings | null> {
  try {
    const res = await fetch(`${API_ORIGIN}/api/site-settings`, {
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });

    if (!res.ok) return null;

    const json = await res.json();
    return json.success ? json.data : null;
  } catch {
    return null;
  }
}
