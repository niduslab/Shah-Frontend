"use client";

import { useEffect } from "react";
import Script from "next/script";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api/axios";

type Provider =
  | "facebook_pixel"
  | "google_ads"
  | "google_analytics"
  | "gtm"
  | "custom";

interface ActivePixel {
  id: number;
  provider: Provider;
  pixel_id: string | null;
  custom_head_script: string | null;
  custom_body_script: string | null;
  placement: "head" | "body_top" | "body_bottom";
}

/**
 * Fetches the active tracking integrations configured in the admin panel
 * (Pixel & Tag Management) and injects the corresponding scripts into the
 * storefront. Runs client-side, after the page is interactive, so it never
 * blocks rendering. Failures are swallowed silently — tracking must never
 * break the site.
 */
export function TrackingPixels() {
  const { data } = useQuery({
    queryKey: ["public", "tracking-pixels", "active"],
    queryFn: async () => {
      const res = await api.get("/api/tracking-pixels/active");
      return res.data;
    },
    staleTime: 5 * 60 * 1000, // cache for 5 minutes
    retry: 1,
    // Don't spam errors if the endpoint is unavailable.
    refetchOnWindowFocus: false,
  });

  const pixels: ActivePixel[] = data?.data ?? [];

  // Inject GTM <noscript> iframes + any custom body scripts into <body>.
  // next/script cannot render raw markup into <body>, so we do it manually.
  useEffect(() => {
    if (typeof document === "undefined" || pixels.length === 0) return;

    const injected: HTMLElement[] = [];

    pixels.forEach((pixel) => {
      // GTM noscript fallback (recommended immediately after opening <body>).
      if (pixel.provider === "gtm" && pixel.pixel_id) {
        const noscript = document.createElement("noscript");
        noscript.setAttribute("data-tracking-pixel", `gtm-${pixel.id}`);
        const iframe = document.createElement("iframe");
        iframe.src = `https://www.googletagmanager.com/ns.html?id=${pixel.pixel_id}`;
        iframe.height = "0";
        iframe.width = "0";
        iframe.style.display = "none";
        iframe.style.visibility = "hidden";
        noscript.appendChild(iframe);
        document.body.insertBefore(noscript, document.body.firstChild);
        injected.push(noscript);
      }

      // Custom body script.
      if (pixel.provider === "custom" && pixel.custom_body_script) {
        const container = document.createElement("div");
        container.setAttribute("data-tracking-pixel", `custom-body-${pixel.id}`);
        container.style.display = "none";
        container.innerHTML = pixel.custom_body_script;
        if (pixel.placement === "body_top") {
          document.body.insertBefore(container, document.body.firstChild);
        } else {
          document.body.appendChild(container);
        }
        injected.push(container);
      }
    });

    return () => {
      injected.forEach((el) => el.remove());
    };
  }, [pixels]);

  if (pixels.length === 0) return null;

  const gtmIds = pixels
    .filter((p) => p.provider === "gtm" && p.pixel_id)
    .map((p) => p.pixel_id as string);

  const gaIds = pixels
    .filter(
      (p) =>
        (p.provider === "google_analytics" || p.provider === "google_ads") &&
        p.pixel_id
    )
    .map((p) => p.pixel_id as string);

  const fbIds = pixels
    .filter((p) => p.provider === "facebook_pixel" && p.pixel_id)
    .map((p) => p.pixel_id as string);

  const customHeadScripts = pixels.filter(
    (p) => p.provider === "custom" && p.custom_head_script
  );

  // Load the shared gtag.js library once, keyed on the first GA/Ads id.
  const primaryGtagId = gaIds[0];

  return (
    <>
      {/* Google Tag Manager */}
      {gtmIds.map((id) => (
        <Script
          key={`gtm-${id}`}
          id={`gtm-${id}`}
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${id}');`,
          }}
        />
      ))}

      {/* Google Analytics / Google Ads (gtag.js) */}
      {primaryGtagId && (
        <>
          <Script
            id="gtag-src"
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${primaryGtagId}`}
          />
          <Script
            id="gtag-init"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
${gaIds.map((id) => `gtag('config', '${id}');`).join("\n")}`,
            }}
          />
        </>
      )}

      {/* Facebook / Meta Pixel */}
      {fbIds.length > 0 && (
        <Script
          id="fb-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
${fbIds.map((id) => `fbq('init', '${id}');`).join("\n")}
fbq('track', 'PageView');`,
          }}
        />
      )}

      {/* Custom head scripts */}
      {customHeadScripts.map((p) => (
        <Script
          key={`custom-head-${p.id}`}
          id={`custom-head-${p.id}`}
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: stripScriptTags(p.custom_head_script || "") }}
        />
      ))}
    </>
  );
}

/**
 * next/script's dangerouslySetInnerHTML expects the JS body only, not a wrapping
 * <script> tag. Admins may paste a full <script>...</script> snippet, so strip
 * the outer tags if present.
 */
function stripScriptTags(html: string): string {
  const match = html.match(/<script[^>]*>([\s\S]*?)<\/script>/i);
  return match ? match[1] : html;
}
