import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripe, hasLiveStripeKeys } from "@/lib/stripe";

export async function POST(request: Request) {
  if (!hasLiveStripeKeys() || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ received: true, ignored: "no-stripe" });
  }

  const stripe = getStripe()!;
  const raw = await request.text();
  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing Stripe signature." }, { status: 400 });
  }

  try {
    const event = stripe.webhooks.constructEvent(
      raw,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );

    // Guarantee the installment subscription has a stop date. cancel_at cannot be
    // set at Checkout Session creation (Stripe limitation), so we apply it here.
    // Two independent triggers cover each other: checkout.session.completed AND
    // customer.subscription.created. The update is idempotent — if cancel_at is
    // already set we skip — so a subscription can never bill past its final month
    // even if one event is missed, retried, or misrouted.
    async function ensureCancelAt(subscriptionId: string, cancelAtUnix: number) {
      if (!subscriptionId || !Number.isFinite(cancelAtUnix) || cancelAtUnix <= 0) return;
      const sub = await stripe.subscriptions.retrieve(subscriptionId);
      if (sub.cancel_at) {
        console.info("[stripe] cancel_at already set", subscriptionId, sub.cancel_at);
        return;
      }
      await stripe.subscriptions.update(subscriptionId, { cancel_at: cancelAtUnix });
      console.info("[stripe] cancel_at applied", subscriptionId, cancelAtUnix);
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const subscriptionId =
        typeof session.subscription === "string"
          ? session.subscription
          : session.subscription?.id;
      const cancelAtUnix = Number(session.metadata?.cancelAtUnix);
      if (subscriptionId) {
        await ensureCancelAt(subscriptionId, cancelAtUnix);
      }
      console.info("[stripe] checkout.session.completed", session.id);
    } else if (event.type === "customer.subscription.created") {
      const sub = event.data.object as Stripe.Subscription;
      const cancelAtUnix = Number(sub.metadata?.cancelAtUnix);
      await ensureCancelAt(sub.id, cancelAtUnix);
      console.info("[stripe] customer.subscription.created", sub.id);
    } else {
      console.info(`[stripe] ${event.type}`, event.id);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook verification failed", error);
    return NextResponse.json({ error: "Invalid webhook." }, { status: 400 });
  }
}
