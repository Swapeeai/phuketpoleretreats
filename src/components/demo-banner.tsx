import { hasLiveStripeKeys } from "@/lib/stripe";

export function DemoBanner() {
  if (hasLiveStripeKeys()) {
    return null;
  }

  return (
    <div className="bg-jungle px-4 py-2 text-center text-sm text-white">
      Demo checkout is on — nothing is charged. You can still pay in full, or put €500 down and
      continue with monthly payments.
    </div>
  );
}
