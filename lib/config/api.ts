/**
 * Single source of truth for the backend API origin.
 *
 * NEXT_PUBLIC_* values are inlined at BUILD time, not read at runtime. Whatever is
 * set when `next build` runs gets baked into the client bundle, so this must be
 * correct on the machine that builds, and the app MUST be rebuilt after changing it.
 *
 * There is deliberately no `|| 'http://localhost:8000'` fallback here. That fallback
 * previously shipped a production bundle pointing every visitor's browser at their
 * own machine, which took the whole site down with ERR_CONNECTION_REFUSED on every
 * request. A missing variable must fail loudly at build/boot instead.
 */

function readApiOrigin(): string {
  const raw = process.env.NEXT_PUBLIC_API_URL;

  if (!raw) {
    throw new Error(
      'NEXT_PUBLIC_API_URL is not set. Add it to .env.local ' +
        '(e.g. NEXT_PUBLIC_API_URL=https://api.shahsports.com.bd) and rebuild.'
    );
  }

  // Trailing slashes would produce '//api/...' once joined with a path.
  return raw.replace(/\/+$/, '');
}

/** Backend origin, no trailing slash. e.g. https://api.shahsports.com.bd */
export const API_ORIGIN = readApiOrigin();

/** Backend API root, no trailing slash. e.g. https://api.shahsports.com.bd/api */
export const API_BASE_URL = `${API_ORIGIN}/api`;
