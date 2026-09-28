"use client";

import { getPackage } from "@/lib/retreat";
import {
  CONSENT_STORAGE_KEY,
  GA_MEASUREMENT_ID,
  GOOGLE_ADS_ID,
  META_PIXEL_ID,
} from "@/lib/marketing-config";

export { CONSENT_STORAGE_KEY };
export const CONSENT_EVENT = "ppr-consent";

export type ConsentChoice = "accepted" | "rejected";

type Fbq = ((...args: unknown[]) => void) & {
  callMethod?: (...args: unknown[]) => void;
  queue: unknown[][];
  push: Fbq;
  loaded: boolean;
  version: string;
};

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: Fbq;
    _fbq?: Fbq;
    __pprGoogleDefault?: boolean;
  }
}

const DENIED = {
  ad_storage: "denied",
  analytics_storage: "denied",
  ad_user_data: "denied",
  ad_personalization: "denied",
} as const;

const GRANTED = {
  ad_storage: "granted",
  analytics_storage: "granted",
  ad_user_data: "granted",
  ad_personalization: "granted",
} as const;

export function readConsent(): ConsentChoice | null {
  if (typeof window === "undefined") return null;
  try {
    const value = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (value === "accepted" || value === "rejected") return value;
  } catch {
    return null;
  }
  return null;
}

function ensureGtag() {
  window.dataLayer = window.dataLayer || [];
  if (!window.gtag) {
    window.gtag = function gtag() {
      // Google's loader reads the Arguments object from the dataLayer.
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer.push(arguments);
    };
  }
}

function grantGoogle() {
  if (!GA_MEASUREMENT_ID && !GOOGLE_ADS_ID) return;
  ensureGtag();
  if (!window.__pprGoogleDefault) {
    window.gtag!("consent", "default", { ...DENIED, wait_for_update: 500 });
    window.__pprGoogleDefault = true;
  }
  window.gtag!("consent", "update", GRANTED);
  if (document.getElementById("ppr-gtag")) return;
  const primary = GA_MEASUREMENT_ID || GOOGLE_ADS_ID;
  const script = document.createElement("script");
  script.id = "ppr-gtag";
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(primary)}`;
  document.head.appendChild(script);
  window.gtag!("js", new Date());
  if (GA_MEASUREMENT_ID) {
    window.gtag!("config", GA_MEASUREMENT_ID, { send_page_view: false });
  }
  if (GOOGLE_ADS_ID) {
    window.gtag!("config", GOOGLE_ADS_ID, { send_page_view: false });
  }
}

function ensurePixel() {
  if (!META_PIXEL_ID) return;
  if (window.fbq) {
    window.fbq("consent", "grant");
    return;
  }
  const fbq: Fbq = Object.assign(
    function pixelQueue(...args: unknown[]) {
      if (fbq.callMethod) fbq.callMethod(...args);
      else fbq.queue.push(args);
    },
    { queue: [] as unknown[][], loaded: true, version: "2.0", push: undefined as unknown as Fbq },
  );
  fbq.push = fbq;
  window.fbq = fbq;
  window._fbq = fbq;
  const script = document.createElement("script");
  script.async = true;
  script.src = "https://connect.facebook.net/en_US/fbevents.js";
  document.head.appendChild(script);
  fbq("init", META_PIXEL_ID);
}

/** Load Meta and Google tags. No-ops unless consent is accepted and an ID is set. */
export function loadMarketingTags() {
  if (readConsent() !== "accepted") return;
  ensurePixel();
  grantGoogle();
}

export function applyConsent(choice: ConsentChoice) {
  try {
    localStorage.setItem(CONSENT_STORAGE_KEY, choice);
  } catch {
    // Private mode can block storage; still honour the choice for this page.
  }
  document.documentElement.setAttribute("data-cookie-consent", choice);
  document.documentElement.removeAttribute("data-cookie-banner");
  if (choice === "accepted") {
    loadMarketingTags();
  } else {
    window.gtag?.("consent", "update", DENIED);
    window.fbq?.("consent", "revoke");
  }
  window.dispatchEvent(new Event(CONSENT_EVENT));
}

export function trackPageView(path: string) {
  if (readConsent() !== "accepted") return;
  loadMarketingTags();
  window.fbq?.("track", "PageView");
  window.gtag?.("event", "page_view", {
    page_path: path,
    page_location: window.location.href,
    page_title: document.title,
  });
}

export function trackViewContent(pathname: string) {
  if (readConsent() !== "accepted") return;
  const slug = pathname === "/book" ? null : pathname.startsWith("/book/") ? pathname.slice("/book/".length) : undefined;
  if (slug === undefined) return;
  loadMarketingTags();
  if (!slug) {
    window.fbq?.("track", "ViewContent", {
      content_name: "Phuket pole retreat packages",
      content_type: "product_group",
    });
    return;
  }
  const pkg = getPackage(slug);
  if (!pkg || pkg.hidden) return;
  const value = pkg.fromCents / 100;
  window.fbq?.("track", "ViewContent", {
    content_name: pkg.title,
    content_category: "Pole retreat",
    content_ids: [pkg.slug],
    content_type: "product",
    value,
    currency: "EUR",
  });
  window.gtag?.("event", "view_item", {
    currency: "EUR",
    value,
    items: [
      {
        item_id: pkg.slug,
        item_name: pkg.title,
        item_category: "Pole retreat",
        price: value,
        quantity: 1,
      },
    ],
  });
}

export function trackBeginCheckout(input: { slug: string; name: string; value?: number }) {
  if (readConsent() !== "accepted") return;
  loadMarketingTags();
  const priced = typeof input.value === "number";
  window.fbq?.("track", "InitiateCheckout", {
    content_ids: [input.slug],
    content_name: input.name,
    content_type: "product",
    ...(priced ? { value: input.value, currency: "EUR" } : {}),
  });
  window.gtag?.("event", "begin_checkout", {
    currency: "EUR",
    ...(priced ? { value: input.value } : {}),
    items: [
      {
        item_id: input.slug,
        item_name: input.name,
        item_category: "Pole retreat",
        ...(priced ? { price: input.value } : {}),
        quantity: 1,
      },
    ],
  });
}

export function trackPurchase(search: string) {
  if (readConsent() !== "accepted") return;
  const params = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
  const sessionId = params.get("session_id")?.trim();
  if (!sessionId) return;
  const dedupeKey = `ppr-purchase:${sessionId}`;
  try {
    if (sessionStorage.getItem(dedupeKey)) return;
    sessionStorage.setItem(dedupeKey, "1");
  } catch {
    // If storage is blocked, still send once for this page load.
  }
  loadMarketingTags();
  const totalRaw = params.get("total");
  const cents = totalRaw ? Number(totalRaw) : NaN;
  const hasTotal = Number.isFinite(cents) && cents > 0;
  const value = hasTotal ? cents / 100 : undefined;
  const slug = params.get("package")?.trim() || undefined;
  const pkg = slug ? getPackage(slug) : undefined;
  window.fbq?.("track", "Purchase", {
    ...(hasTotal ? { value, currency: "EUR" } : {}),
    ...(slug ? { content_ids: [slug], content_type: "product", content_name: pkg?.title } : {}),
  });
  window.gtag?.("event", "purchase", {
    transaction_id: sessionId,
    ...(hasTotal ? { value, currency: "EUR" } : {}),
    ...(slug
      ? {
          items: [
            {
              item_id: slug,
              item_name: pkg?.title ?? slug,
              item_category: "Pole retreat",
              ...(hasTotal ? { price: value } : {}),
              quantity: 1,
            },
          ],
        }
      : {}),
  });
}
