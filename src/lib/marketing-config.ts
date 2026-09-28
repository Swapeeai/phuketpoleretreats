/**
 * Public marketing IDs. Google IDs stay empty unless set in the environment.
 * The Meta Pixel ID is public (it is sent to the browser only after Accept)
 * and has a built-in default so production works without a Vercel env change.
 * A valid NEXT_PUBLIC_META_PIXEL_ID overrides that default. Malformed values
 * are ignored. Nothing here emits a script tag by itself.
 */

export const CONSENT_STORAGE_KEY = "ppr-cookie-consent";

function matchEnv(name: string, pattern: RegExp) {
  const value = process.env[name]?.trim() ?? "";
  return pattern.test(value) ? value : "";
}

/**
 * Public Pixel from Events Manager. Not a secret. Loaded only after Accept.
 * Override with NEXT_PUBLIC_META_PIXEL_ID (digits only).
 */
export const DEFAULT_META_PIXEL_ID = "1078532138132230";

const metaPixelOverride = matchEnv("NEXT_PUBLIC_META_PIXEL_ID", /^\d{5,20}$/);
export const META_PIXEL_ID = metaPixelOverride || DEFAULT_META_PIXEL_ID;

/** GA4 measurement ID, for example G-1A2BCD3EFG. */
export const GA_MEASUREMENT_ID = matchEnv("NEXT_PUBLIC_GA_MEASUREMENT_ID", /^G-[A-Z0-9]+$/i);

/** Google Ads tag ID, for example AW-123456789. */
export const GOOGLE_ADS_ID = matchEnv("NEXT_PUBLIC_GOOGLE_ADS_ID", /^AW-\d+$/);

export function hasGoogleMarketingIds() {
  return Boolean(GA_MEASUREMENT_ID || GOOGLE_ADS_ID);
}

/**
 * Search Console HTML-tag content value. Accepts the bare token or a pasted
 * meta tag, and rejects anything that is not a safe verification token.
 */
export function googleSiteVerification() {
  const raw = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION?.trim() ?? "";
  if (!raw) return "";
  const fromMeta = raw.match(/content=["']([^"']+)["']/i)?.[1]?.trim();
  const token = (fromMeta || raw).trim();
  return /^[A-Za-z0-9_-]{8,200}$/.test(token) ? token : "";
}
