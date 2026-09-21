export const SITE_NAME = "Phuket Pole Retreats";
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "http://127.0.0.1:43211";
export const CONTACT_EMAIL = "info@ibizapoleretreats.com";
export const WHATSAPP_E164 = "+66928320802";
export const WHATSAPP_DISPLAY = "+66 92 832 0802";
export const WHATSAPP_URL = "https://wa.me/66928320802";
export const INSTAGRAM_URL = "https://www.instagram.com/phuketpoleretreats";
export const ORGANISERS = ["Tara", "Jenny"] as const;

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
