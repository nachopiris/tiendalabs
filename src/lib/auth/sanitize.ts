/** Safe fallback for all invalid or missing `?next=` values. */
const SAFE_DEFAULT = "/admin";

/**
 * Sanitizes the `?next=` query param used for post-login redirects.
 * Only allows relative paths that start with `/admin` to prevent open-redirect
 * attacks. URL-encoded inputs are decoded before validation.
 *
 * Rules (in order):
 *  1. Null / undefined / empty string → fallback
 *  2. Protocol-relative paths (`//…`)  → fallback
 *  3. Absolute URLs (`http://`, `https://`) → fallback
 *  4. Paths containing `..` (traversal) → fallback
 *  5. Paths that don't start with `/admin` → fallback
 *  6. Everything else → decoded pathname (safe)
 */
export function sanitizeNextUrl(raw: string | null | undefined): string {
  if (!raw) return SAFE_DEFAULT;

  // Decode percent-encoded characters (e.g. %2F → /)
  let decoded: string;
  try {
    decoded = decodeURIComponent(raw);
  } catch {
    return SAFE_DEFAULT;
  }

  // Protocol-relative
  if (decoded.startsWith("//")) return SAFE_DEFAULT;

  // Absolute URL
  if (decoded.startsWith("http://") || decoded.startsWith("https://")) {
    return SAFE_DEFAULT;
  }

  // Path traversal
  if (decoded.includes("..")) return SAFE_DEFAULT;

  // Must be under /admin
  if (!decoded.startsWith("/admin")) return SAFE_DEFAULT;

  return decoded;
}
