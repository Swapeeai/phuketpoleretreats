"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { CONSENT_EVENT, readConsent, trackPageView, trackPurchase, trackViewContent } from "@/lib/marketing";

/**
 * Fires marketing events only after Accept. Tags themselves are injected by
 * the tracking helpers, and only when the matching public ID is set.
 */
export function MarketingTags() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams.toString();
  const lastKey = useRef<string | null>(null);

  useEffect(() => {
    function fire() {
      if (readConsent() !== "accepted") return;
      const key = `${pathname}?${search}`;
      if (lastKey.current === key) return;
      lastKey.current = key;
      trackPageView(pathname);
      if (pathname === "/book" || pathname.startsWith("/book/")) {
        trackViewContent(pathname);
      }
      if (pathname === "/checkout/success") {
        trackPurchase(search);
      }
    }

    fire();
    window.addEventListener(CONSENT_EVENT, fire);
    return () => window.removeEventListener(CONSENT_EVENT, fire);
  }, [pathname, search]);

  return null;
}
