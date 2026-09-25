import { WHATSAPP_DISPLAY, WHATSAPP_ME } from "@/lib/whatsapp";

export const SITE_NAME = "Phuket Pole Retreats";
/**
 * Canonical/sitemap host. Defaults to the production domain so a missing
 * NEXT_PUBLIC_SITE_URL never publishes localhost canonicals; Stripe redirects
 * use the request host instead (see originFromRequest).
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://www.phuketpoleretreats.com";
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
