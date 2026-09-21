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

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const subscriptionId =
        typeof session.subscription === "string"
          ? session.subscription
          : session.subscription?.id;
      const cancelAtUnix = Number(session.metadata?.cancelAtUnix);
      if (subscriptionId && Number.isFinite(cancelAtUnix) && cancelAtUnix > 0) {
        await stripe.subscriptions.update(subscriptionId, { cancel_at: cancelAtUnix });
      }
      console.info("[stripe] checkout.session.completed", session.id);
    } else {
      console.info(`[stripe] ${event.type}`, event.id);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook verification failed", error);
    return NextResponse.json({ error: "Invalid webhook." }, { status: 400 });
  }
}
