import Stripe from "stripe";
import { NextResponse } from "next/server";
import { validateBooking } from "@/lib/validate-booking";
import { buildInstallmentPlan } from "@/lib/installments";
import { getStripe, hasLiveStripeKeys } from "@/lib/stripe";
import { originFromRequest } from "@/lib/site";
import { RETREAT } from "@/lib/retreat";
import { formatEur } from "@/lib/format";
import type { BookingPayload } from "@/lib/booking";

export async function POST(request: Request) {
  let body: Partial<BookingPayload>;
  try {
    body = (await request.json()) as Partial<BookingPayload>;
  } catch {
    return NextResponse.json({ error: "The booking form could not be read. Try again." }, { status: 400 });
  }

  const result = validateBooking(body);
  if (!result.ok) {
    return NextResponse.json({ error: result.error, field: result.field }, { status: 400 });
  }

  const { booking, pkg, variant } = result;
  const occupancyLabel = booking.occupancy
    ? booking.occupancy === "shared"
      ? "Shared"
      : "Solo"
    : "Workshops only";
  const productName = `${RETREAT.name} — ${pkg.title}${booking.occupancy ? ` (${occupancyLabel})` : ""}`;
  const origin = originFromRequest(request);
  // Pass the booking back so the confirmation page can restate what was agreed
  // (package, plan, total and the installment schedule) instead of a bare receipt.
  const successParams = new URLSearchParams({
    plan: booking.paymentPlan,
    package: pkg.slug,
    occupancy: booking.occupancy ?? "none",
    total: String(variant.priceCents),
  });
  const successUrl = `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}&${successParams.toString()}`;
  const cancelUrl = `${origin}/book/${pkg.slug}?checkout=cancelled`;

  const metadata = {
    packageSlug: pkg.slug,
    occupancy: booking.occupancy ?? "none",
    paymentPlan: booking.paymentPlan,
    fullName: booking.fullName,
    email: booking.email,
    phone: booking.phone,
    instagram: booking.instagram,
    level: booking.level,
    roommateNotes: booking.roommateNotes.slice(0, 400),
    sku: variant.sku,
    totalCents: String(variant.priceCents),
  };

  if (!hasLiveStripeKeys()) {
    const token = Buffer.from(
      JSON.stringify({
        ...booking,
        title: pkg.title,
        occupancyLabel,
        totalCents: variant.priceCents,
        mock: true,
      }),
    ).toString("base64url");
    return NextResponse.json({
      url: `${origin}/checkout/mock?token=${token}`,
      mode: "mock",
    });
  }

  const stripe = getStripe()!;

  try {
    if (booking.paymentPlan === "full") {
      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        // Card only. An explicit list disables Stripe's automatic payment methods,
        // so Bancontact/Scalapay and the Link wallet are not offered.
        payment_method_types: ["card"],
        customer_email: booking.email,
        phone_number_collection: { enabled: true },
        allow_promotion_codes: true,
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata,
        payment_intent_data: { metadata },
        line_items: [
          {
            quantity: 1,
            price_data: {
              currency: RETREAT.currency,
              unit_amount: variant.priceCents,
              product_data: {
                name: productName,
                description: `Pay in full. Workshops 28 Jan–1 Feb 2027 at ${RETREAT.venue}. Bookings are non-refundable.`,
              },
            },
          },
        ],
      });
      return NextResponse.json({ url: session.url, mode: "stripe" });
    }

    const plan = buildInstallmentPlan(variant.priceCents);
    if (!plan.available) {
      return NextResponse.json({ error: plan.reason, field: "paymentPlan" }, { status: 400 });
    }

    // Fixed monthly recurring amount (the floor). Any rounding remainder is
    // charged once on the first invoice below, so the collected total equals the
    // advertised price to the cent.
    const monthlyBaseCents = plan.monthlyBaseCents;
    if (!monthlyBaseCents || monthlyBaseCents <= 0) {
      return NextResponse.json({ error: "Could not build a monthly schedule." }, { status: 400 });
    }

    // Deposit today + monthly balance in one Checkout subscription session.
    //
    // The recurring price is put on a free trial until the first monthly date, so
    // Stripe does NOT charge it today. The €500 deposit is a one-time line item,
    // which Checkout charges on the subscription's initial invoice (today). Using a
    // trial_end avoids the "billing_cycle_anchor in the future" conflict that made
    // the earlier configuration fail.
    //
    // cancel_at is NOT settable on Checkout Session subscription_data (Stripe API
    // limitation). It is applied post-completion by the webhook (belt) using the
    // subscription_data.metadata.cancelAtUnix carried here (braces). See
    // src/app/api/webhooks/stripe/route.ts, which handles both
    // checkout.session.completed and customer.subscription.created.
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
      {
        quantity: 1,
        price_data: {
          currency: RETREAT.currency,
          recurring: { interval: "month" },
          unit_amount: monthlyBaseCents,
          product_data: {
            name: `Monthly balance — ${productName}`,
            description: `Automatic remaining balance until paid, ending by 28 November 2026.`,
          },
        },
      },
      {
        quantity: 1,
        price_data: {
          currency: RETREAT.currency,
          unit_amount: RETREAT.depositCents,
          product_data: {
            name: `Deposit — ${productName}`,
            description: `€500 deposit due today. Remaining ${formatEur(plan.remainingCents)} billed automatically over ${plan.monthlyCount} month${plan.monthlyCount === 1 ? "" : "s"}.`,
          },
        },
      },
    ];

    // One-time remainder so the total is exact (never over by a cent). Charged on
    // the first invoice today alongside the deposit.
    if (plan.firstInvoiceExtraCents > 0) {
      lineItems.push({
        quantity: 1,
        price_data: {
          currency: RETREAT.currency,
          unit_amount: plan.firstInvoiceExtraCents,
          product_data: {
            name: `Balance adjustment — ${productName}`,
            description: `One-time cent adjustment so the collected total matches the advertised price exactly.`,
          },
        },
      });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      // Card only (see full-payment session above).
      payment_method_types: ["card"],
      customer_email: booking.email,
      phone_number_collection: { enabled: true },
      allow_promotion_codes: true,
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        ...metadata,
        monthlyCount: String(plan.monthlyCount),
        remainingCents: String(plan.remainingCents),
        cancelAtUnix: String(plan.cancelAtUnix),
      },
      subscription_data: {
        trial_end: plan.firstMonthlyUnix,
        metadata: {
          ...metadata,
          monthlyCount: String(plan.monthlyCount),
          cancelAtUnix: String(plan.cancelAtUnix),
        },
        description: `${productName}. ${plan.summary}`,
      },
      line_items: lineItems,
    });

    return NextResponse.json({ url: session.url, mode: "stripe" });
  } catch (error) {
    const stripeMessage =
      error instanceof Stripe.errors.StripeError ? error.message : String(error);
    const stripeCode =
      error instanceof Stripe.errors.StripeError ? error.code ?? error.type : undefined;
    console.error("Stripe checkout failed", {
      message: stripeMessage,
      code: stripeCode,
      paymentPlan: booking.paymentPlan,
      packageSlug: pkg.slug,
    });

    // Surface Stripe's real reason outside production so it's diagnosable.
    const exposeDetail = process.env.NODE_ENV !== "production" || process.env.DEBUG_STRIPE === "1";
    return NextResponse.json(
      {
        error: exposeDetail
          ? `Stripe could not start checkout: ${stripeMessage}`
          : "Stripe could not start checkout. Please try again or message us on WhatsApp.",
      },
      { status: 502 },
    );
  }
}
