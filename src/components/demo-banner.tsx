import { hasLiveStripeKeys } from "@/lib/stripe";

export function DemoBanner() {
  if (hasLiveStripeKeys()) {
    return null;
  }

  return (
    <div className="bg-[#5c2a24] px-4 py-2 text-center text-sm text-[#f6efe6]">
      Demo payments are on because Stripe keys are not set. You can still walk through pay in full
      and installments, then add your Stripe keys locally.
    </div>
  );
}
