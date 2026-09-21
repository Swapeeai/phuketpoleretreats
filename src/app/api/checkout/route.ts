import { NextResponse } from "next/server";
import { validateBooking } from "@/lib/validate-booking";
import { buildInstallmentPlan } from "@/lib/installments";
import { getStripe, hasLiveStripeKeys } from "@/lib/stripe";
import { SITE_URL } from "@/lib/site";
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
  const successUrl = `${SITE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`;
  const cancelUrl = `${SITE_URL}/book/${pkg.slug}?checkout=cancelled`;

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
      url: `${SITE_URL}/checkout/mock?token=${token}`,
      mode: "mock",
    });
  }

  const stripe = getStripe()!;

  try {
    if (booking.paymentPlan === "full") {
      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        customer_email: booking.email,
        phone_number_collection: { enabled: true },
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

    const monthlyCents = plan.charges.find((c) => c.label === "monthly")?.amountCents;
    if (!monthlyCents) {
      return NextResponse.json({ error: "Could not build a monthly schedule." }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer_email: booking.email,
      phone_number_collection: { enabled: true },
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        ...metadata,
        monthlyCount: String(plan.monthlyCount),
        remainingCents: String(plan.remainingCents),
        cancelAtUnix: String(plan.cancelAtUnix),
      },
      subscription_data: {
        billing_cycle_anchor: plan.firstMonthlyUnix,
        proration_behavior: "none",
        metadata: {
          ...metadata,
          monthlyCount: String(plan.monthlyCount),
          cancelAtUnix: String(plan.cancelAtUnix),
        },
        description: `${productName}. ${plan.summary}`,
      },
      line_items: [
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
        {
          quantity: 1,
          price_data: {
            currency: RETREAT.currency,
            recurring: { interval: "month" },
            unit_amount: monthlyCents,
            product_data: {
              name: `Monthly balance — ${productName}`,
              description: `Automatic remaining balance until paid, ending by 28 November 2026.`,
            },
          },
        },
      ],
    });

    return NextResponse.json({ url: session.url, mode: "stripe" });
  } catch (error) {
    console.error("Stripe checkout failed", error);
    return NextResponse.json(
      {
        error:
          "Stripe could not start checkout. Check your keys, or try the mock flow by removing STRIPE_SECRET_KEY.",
      },
      { status: 502 },
    );
  }
}
