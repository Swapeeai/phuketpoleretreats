import { WHATSAPP_DISPLAY, WHATSAPP_ME } from "@/lib/whatsapp";

export const SITE_NAME = "Phuket Pole Retreats";

/** The one true production host for canonical URLs, sitemap and robots. */
export const PRODUCTION_URL = "https://www.phuketpoleretreats.com";

function resolveSiteUrl() {
  const env = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  // Never trust a vercel.app (or empty) value for canonical/sitemap/robots — a
  // preview/test host must not publish itself as the canonical site. Only an
  // explicit non-vercel override wins; otherwise hard-default to production.
  if (env && !/vercel\.app/i.test(env)) {
    return env;
  }
  return PRODUCTION_URL;
}

/**
 * Canonical/sitemap host. Always the production domain unless an explicit,
 * non-vercel.app NEXT_PUBLIC_SITE_URL is set. Stripe redirects use the request
 * host instead (see originFromRequest), so checkout still works on any host.
 */
export const SITE_URL = resolveSiteUrl();
export const WHATSAPP_E164 = "+66928320802";
export { WHATSAPP_DISPLAY };
export const WHATSAPP_URL = WHATSAPP_ME;
export const INSTAGRAM_HANDLE = "phuketpoleretreats";
export const INSTAGRAM_URL = `https://www.instagram.com/${INSTAGRAM_HANDLE}`;

/** Prefer the public host the visitor used (tunnel/HTTPS) so Stripe/mock redirects stay on that URL. */
export function originFromRequest(request: Request) {
  const forwardedHost = request.headers.get("x-forwarded-host")?.split(",")[0]?.trim();
  const host = forwardedHost || request.headers.get("host")?.trim() || "";
  const forwardedProto = request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim();
  const proto =
    forwardedProto ||
    (host.includes("localhost") || host.startsWith("127.") ? "http" : "https");
  if (host) {
    return `${proto}://${host}`.replace(/\/$/, "");
  }
  return SITE_URL;
}
