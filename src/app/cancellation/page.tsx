import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Cancellation policy",
  description:
    "Phuket Pole Retreats bookings are non-refundable. If we cancel the pole camp, you may transfer to a future retreat. Raise issues during the stay with Tara and Jenny.",
  path: "/cancellation",
});

export default function CancellationPage() {
  return (
    <article className="mx-auto max-w-3xl space-y-6 px-4 py-12 text-sm leading-relaxed sm:px-6">
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: "Cancellation", path: "/cancellation" },
        ]}
      />
      <h1 className="text-4xl">Cancellation policy</h1>
      <p className="text-muted-foreground">Last updated: 10 November 2025 (aligned with the live site).</p>
      <p>
        Unforeseen circumstances happen. Bookings are non-refundable, whether you paid in full or
        with a €500 deposit and monthly payments.
      </p>
      <h2 className="text-2xl">Cancellation by you</h2>
      <ul className="list-disc space-y-2 pl-5">
        <li>Bookings are non-refundable, including the €500 deposit and later monthly charges.</li>
        <li>
          If you find someone to take your place,{" "}
          <Link href="/contact" className="underline underline-offset-4">
            message us on WhatsApp
          </Link>{" "}
          and we will change the information on file.
        </li>
      </ul>
      <h2 className="text-2xl">Cancellation by Phuket Pole Retreats</h2>
      <p>
        If we need to cancel because of weather, disaster, or insufficient enrolment, we will notify
        you as soon as possible and you may transfer your booking to a future retreat.
      </p>
      <h2 className="text-2xl">Issues during the retreat</h2>
      <p>
        Raise them with both organisers, Tara and Jenny, as soon as possible. Issues not raised
        during the retreat are not grounds for a refund.
      </p>
      <p>
        Questions:{" "}
        <Link href="/contact" className="underline underline-offset-4">
          contact us on WhatsApp
        </Link>
        .
      </p>
    </article>
  );
}
