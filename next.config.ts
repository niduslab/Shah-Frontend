import type { NextConfig } from "next";

// Admins can configure custom tracking pixels (GTM/GA/Meta) and paste raw
// custom <script> snippets from the dashboard (see TrackingPixels component),
// which are injected via dangerouslySetInnerHTML with no nonce plumbing.
// That rules out a strict nonce/hash-based script-src for now — 'unsafe-inline'
// is required or those admin-configured scripts silently stop running.
const scriptSrc = [
  "'self'",
  "'unsafe-inline'",
  "https://www.googletagmanager.com",
  "https://www.google-analytics.com",
  "https://connect.facebook.net",
].join(' ');

const connectSrc = [
  "'self'",
  "https:",
  "wss:",
  "ws:",
].join(' ');

const csp = [
  `default-src 'self'`,
  `script-src ${scriptSrc}`,
  `style-src 'self' 'unsafe-inline'`,
  // Product/brand images are uploaded through the admin panel and can live on
  // any http(s) host today (see images.remotePatterns below) — img-src has to
  // match that until uploads are constrained to a fixed set of origins.
  `img-src 'self' data: blob: http: https:`,
  `font-src 'self' data:`,
  `connect-src ${connectSrc}`,
  `frame-src https://www.googletagmanager.com`,
  `frame-ancestors 'none'`,
  `base-uri 'self'`,
  `form-action 'self'`,
  `object-src 'none'`,
].join('; ');

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '**',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    // Allow localhost images in development
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Content-Security-Policy', value: csp },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), payment=(self)',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
