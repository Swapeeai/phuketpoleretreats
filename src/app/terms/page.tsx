import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { pageMetadata } from "@/lib/seo";
import { WHATSAPP_DISPLAY } from "@/lib/whatsapp";

export const metadata: Metadata = pageMetadata({
  title: "Terms & conditions",
  description:
    "Terms and conditions for booking the Phuket Pole Art Retreat at Ayara Kamala: what is sold, EUR prices, pay in full or €500 deposit with automatic monthly payments, non-refundable bookings, Stripe as payment processor, and contact by WhatsApp.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <article className="mx-auto max-w-3xl space-y-6 px-4 py-12 text-sm leading-relaxed sm:px-6">
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: "Terms & conditions", path: "/terms" },
        ]}
      />
      <h1 className="text-4xl">Terms &amp; conditions</h1>
      <p className="text-muted-foreground">
        Last updated: 25 September 2026. These terms describe how booking the Phuket Pole Art Retreat
        works. By booking, you agree to them.
      </p>

      <h2 className="text-2xl">What you are booking</h2>
      <p>
        Phuket Pole Retreats sells places on the Pole Art Retreat at Ayara Kamala Resort &amp; Spa,
        Kamala, Phuket. Workshops run 28 January – 1 February 2027. Accommodation packages include a
        hotel stay from check-in on 27 January to check-out on 2 February 2027. A workshops-only
        option is available, for which you arrange your own accommodation and transport. Exactly
        what each package includes is listed on that package&rsquo;s{" "}
        <Link href="/book" className="underline underline-offset-4">
          booking page
        </Link>
        .
      </p>

      <h2 className="text-2xl">Prices and payment</h2>
      <p>
        All prices are shown in euros (EUR) on the booking pages and are charged in euros. You can
        pay in one of two ways:
      </p>
      <ul className="list-disc space-y-2 pl-5">
        <li>
          <strong>Pay in full</strong> — the whole package price is charged today by card.
        </li>
        <li>
          <strong>€500 deposit today, then monthly payments</strong> — a €500 deposit is charged
          today and the remaining balance is then charged <strong>automatically to the same card</strong>{" "}
          in equal monthly payments. You do not need to do anything for each payment. The monthly
          payments finish on or before <strong>28 November 2026</strong> (60 days before the
          retreat). The exact number of payments, the amount, and the final date are shown on the
          booking page before you pay.
        </li>
      </ul>
      <p>
        Card payments are processed by <strong>Stripe</strong>. We never see or store your card
        number. When you choose the deposit option, you authorise Stripe to charge the scheduled
        monthly payments to your card automatically until the balance is paid.
      </p>

      <h2 className="text-2xl">If a monthly payment fails</h2>
      <p>
        If an automatic monthly payment cannot be taken (for example, an expired or declined card),
        Stripe will automatically retry the payment. Please keep a valid card on file and update it
        with us on WhatsApp if it changes. If the balance cannot be collected, your booking may be
        cancelled. Any payments already made, including the deposit and any monthly payments taken,
        remain <strong>non-refundable</strong>.
      </p>

      <h2 className="text-2xl">Refunds</h2>
      <p>
        Bookings are non-refundable, whether you pay in full or by deposit and monthly payments.
        This includes the €500 deposit and every monthly payment. Please read our{" "}
        <Link href="/cancellation" className="underline underline-offset-4">
          cancellation policy
        </Link>{" "}
        for what happens if you cannot attend or if we have to cancel the retreat.
      </p>

      <h2 className="text-2xl">Your information</h2>
      <p>
        We use the details you give us to manage your booking, place you in a level group and
        arrange rooming. See our{" "}
        <Link href="/privacy" className="underline underline-offset-4">
          privacy policy
        </Link>
        .
      </p>

      <h2 className="text-2xl">Contact</h2>
      <p>
        Questions about these terms or your booking? Message us on WhatsApp at {WHATSAPP_DISPLAY} via
        the{" "}
        <Link href="/contact" className="underline underline-offset-4">
          contact page
        </Link>
        .
      </p>

      <h2 className="text-2xl">Governing law</h2>
      {/* OWNER TO CONFIRM: governing law / jurisdiction. Placeholder below — confirm the
          correct country (e.g. Luxembourg, where Flirtyfitness is based, or Thailand, where the
          retreat is held) and whether a specific court/jurisdiction clause is required. */}
      <p>
        These terms are governed by the laws of{" "}
        <span className="font-medium">[jurisdiction to be confirmed by the organisers]</span>.
      </p>
    </article>
  );
}
