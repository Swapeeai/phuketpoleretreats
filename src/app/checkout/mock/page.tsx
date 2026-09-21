"use client";

import { useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { buildInstallmentPlan } from "@/lib/installments";
import { formatEur, formatShortDate } from "@/lib/format";
import { getPackage } from "@/lib/retreat";
import type { BookingPayload } from "@/lib/booking";
import { getVariant } from "@/lib/retreat";

type MockToken = BookingPayload & {
  title: string;
  occupancyLabel: string;
  totalCents: number;
  mock: boolean;
};

function MockCheckoutInner() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("token");

  const booking = useMemo(() => {
    if (!token) return null;
    try {
      const padded = token.replace(/-/g, "+").replace(/_/g, "/");
      const json = atob(padded);
      return JSON.parse(json) as MockToken;
    } catch {
      return null;
    }
  }, [token]);

  if (!booking) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16">
        <h1 className="text-3xl">Checkout session missing</h1>
        <p className="mt-3 text-muted-foreground">
          This demo checkout link is invalid or expired. Return to booking and start again.
        </p>
        <Button className="mt-6" onClick={() => router.push("/book")}>
          Back to packages
        </Button>
      </div>
    );
  }

  const pkg = getPackage(booking.packageSlug);
  const variant = pkg ? getVariant(pkg, booking.occupancy) : null;
  const plan =
    booking.paymentPlan === "installments" && variant
      ? buildInstallmentPlan(variant.priceCents)
      : null;

  function confirm() {
    const query = new URLSearchParams({
      mock: "1",
      plan: booking!.paymentPlan,
      package: booking!.packageSlug,
      occupancy: booking!.occupancy ?? "none",
      total: String(booking!.totalCents),
      session_id: `mock_${Date.now()}`,
    });
    router.push(`/checkout/success?${query.toString()}`);
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-16">
      <p className="text-sm uppercase tracking-[0.18em] text-primary">Stripe test / mock</p>
      <h1 className="mt-2 text-3xl">Confirm demo payment</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        No Stripe secret key is configured, so this page stands in for Stripe Checkout. Use it to
        verify pay-in-full versus installments. With real keys, dancers land on Stripe-hosted
        Checkout instead.
      </p>
      <div className="mt-8 space-y-3 rounded-2xl border border-border bg-card p-5 text-sm">
        <p className="font-medium">{booking.title}</p>
        <p className="text-muted-foreground">{booking.occupancyLabel}</p>
        <p>
          {booking.fullName} · {booking.email}
        </p>
        <p>Level: {booking.level}</p>
        {booking.paymentPlan === "full" ? (
          <p className="pt-2 text-base font-medium">Charge today {formatEur(booking.totalCents)}</p>
        ) : plan?.available ? (
          <ol className="space-y-1 pt-2">
            {plan.charges.map((charge) => (
              <li key={charge.isoDate} className="flex justify-between">
                <span>
                  {charge.label === "deposit" ? "Deposit today" : "Auto monthly"} ·{" "}
                  {formatShortDate(charge.isoDate)}
                </span>
                <span>{formatEur(charge.amountCents)}</span>
              </li>
            ))}
          </ol>
        ) : null}
        <p className="text-xs text-muted-foreground">
          Test card on real Stripe Checkout: ACCT-000015. This mock does not charge anything.
        </p>
      </div>
      <div className="mt-6 flex flex-wrap gap-3">
        <Button size="lg" className="h-11" onClick={confirm}>
          {booking.paymentPlan === "full" ? "Pay in full (demo)" : "Pay €500 deposit (demo)"}
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="h-11"
          onClick={() => router.push(`/book/${booking.packageSlug}?checkout=cancelled`)}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}

export default function MockCheckoutPage() {
  return (
    <Suspense fallback={<div className="px-4 py-16 text-sm">Loading checkout…</div>}>
      <MockCheckoutInner />
    </Suspense>
  );
}
