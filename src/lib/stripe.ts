import Stripe from "stripe";

export function hasLiveStripeKeys() {
  const key = process.env.STRIPE_SECRET_KEY?.trim() ?? "";
  return key.startsWith("sk_test_") || key.startsWith("sk_live_");
}

export function getStripe() {
  if (!hasLiveStripeKeys()) {
    return null;
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY!);
}
