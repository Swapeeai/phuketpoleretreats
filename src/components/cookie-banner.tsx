"use client";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { applyConsent } from "@/lib/marketing";
import { cn } from "@/lib/utils";

function focusBookControl() {
  const candidates = document.querySelectorAll<HTMLElement>("[data-book-cta]");
  for (const book of candidates) {
    if (book.getClientRects().length > 0) {
      book.focus();
      return;
    }
  }
  document.querySelector<HTMLElement>("[data-menu-button]")?.focus();
}

export function CookieBanner() {
  return (
    <div
      id="cookie-banner"
      role="region"
      aria-label="Cookie consent"
      tabIndex={-1}
      className="border-b border-primary/15 bg-aqua text-foreground"
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-6">
        <p className="text-sm leading-snug">
          <span className="font-medium">Cookies. </span>
          Meta and Google tags stay off until you accept — that’s how we can show you this pole
          retreat again. Reject and nothing extra loads.{" "}
          <Link href="/privacy" className="underline underline-offset-2 hover:text-primary">
            Privacy policy
          </Link>
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            id="cookie-reject"
            className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-11 rounded-full px-5")}
            onClick={() => {
              applyConsent("rejected");
              focusBookControl();
            }}
          >
            Reject
          </button>
          <button
            type="button"
            id="cookie-accept"
            className={cn(buttonVariants({ size: "lg" }), "h-11 rounded-full px-5")}
            onClick={() => {
              applyConsent("accepted");
              focusBookControl();
            }}
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}

export function CookieSettingsButton() {
  return (
    <button
      type="button"
      className="text-left hover:text-primary hover:underline"
      onClick={() => {
        document.documentElement.setAttribute("data-cookie-banner", "open");
        document.getElementById("cookie-reject")?.focus();
      }}
    >
      Cookie choices
    </button>
  );
}
