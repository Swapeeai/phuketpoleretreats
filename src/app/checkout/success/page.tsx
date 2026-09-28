import type { Metadata } from "next";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { formatEur, formatShortDate } from "@/lib/format";
import { buildInstallmentPlan } from "@/lib/installments";
import { sendBookingConfirmations } from "@/lib/booking-email";
import { getPackage } from "@/lib/retreat";
import { canonicalUrl } from "@/lib/seo";
import { getStripe } from "@/lib/stripe";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Booking received",
  robots: { index: false, follow: false },
  alternates: { canonical: canonicalUrl("/checkout/success") },
};

export const dynamic = "force-dynamic";

async function sendSuccessBookingEmail(sessionId: string) {
  const stripe = getStripe();
  if (!stripe) {
    console.error("[booking-email] success page skipped, Stripe not configured", sessionId);
    return;
  }
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    await sendBookingConfirmations(session);
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown";
    console.error(`[booking-email] success page failed session=${sessionId} message=${message}`);
  }
}

type Props = {
  searchParams: Promise<{
    session_id?: string;
    mock?: string;
    plan?: string;
    package?: string;
    occupancy?: string;
    total?: string;
  }>;
};

export default async function SuccessPage({ searchParams }: Props) {
  const query = await searchParams;
  const isMock = query.mock === "1";
  const sessionId = query.session_id?.trim();
  if (!isMock && sessionId) {
    await sendSuccessBookingEmail(sessionId);
  }
  const pkg = query.package ? getPackage(query.package) : undefined;
  const totalCents = query.total ? Number(query.total) : pkg?.fromCents;
  const installment =
    query.plan === "installments" && totalCents
      ? buildInstallmentPlan(totalCents)
      : null;

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <p className="text-sm uppercase tracking-[0.18em] text-primary">You’re in</p>
      <h1 className="mt-2 text-4xl">Booking received</h1>
      <p className="mt-4 text-muted-foreground">
        {isMock
          ? "This was the demo checkout (no Stripe keys). In production, Stripe emails a receipt and we see the payment in the Stripe dashboard."
          : query.plan === "installments"
            ? "Stripe has taken your €500 deposit. The monthly payments below are charged automatically to the same card on the dates shown — you do not need to do anything, and Stripe emails a receipt each time. We will follow up with rooming and level grouping."
            : "Stripe has taken today’s payment. You will also get a receipt from Stripe. We will follow up with rooming and level grouping."}
      </p>
      {isMock ? null : (
        <p className="mt-3 text-muted-foreground">A confirmation was sent to your email.</p>
      )}
      {pkg ? (
        <div className="mt-8 rounded-2xl border border-border bg-card p-6 text-sm">
          <p className="font-medium">{pkg.title}</p>
          {query.occupancy && query.occupancy !== "none" ? (
            <p className="mt-1 capitalize text-muted-foreground">{query.occupancy} occupancy</p>
          ) : null}
          {query.plan === "full" && totalCents ? (
            <p className="mt-3">Paid in full · {formatEur(totalCents)}</p>
          ) : null}
          {installment?.available ? (
            <ol className="mt-3 space-y-1">
              {installment.charges.map((charge) => (
                <li key={charge.isoDate} className="flex justify-between">
                  <span>
                    {charge.label === "deposit" ? "Deposit" : "Monthly"} ·{" "}
                    {formatShortDate(charge.isoDate)}
                  </span>
                  <span>{formatEur(charge.amountCents)}</span>
                </li>
              ))}
            </ol>
          ) : null}
          {query.session_id ? (
            <p className="mt-3 text-xs text-muted-foreground">Reference {query.session_id}</p>
          ) : null}
        </div>
      ) : null}
      <Link href="/" className={cn(buttonVariants({ size: "lg" }), "mt-8 inline-flex h-11")}>
        Back to the retreat
      </Link>
    </div>
  );
}
