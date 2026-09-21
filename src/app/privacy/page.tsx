import type { Metadata } from "next";
import { CONTACT_EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy policy",
  description:
    "How Phuket Pole Retreats collects and uses booking, payment and website information. Payments are processed by Stripe; we do not store card numbers.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-3xl space-y-6 px-4 py-12 text-sm leading-relaxed sm:px-6">
      <h1 className="text-4xl">Privacy policy</h1>
      <p className="text-muted-foreground">Last updated: 10 November 2025 (aligned with the live site).</p>
      <p>
        At Phuket Pole Retreats, we are committed to protecting the privacy and security of our
        website visitors and customers. This policy outlines how we collect, use, and safeguard
        personal information.
      </p>
      <h2 className="text-2xl">Information we collect</h2>
      <ul className="list-disc space-y-2 pl-5">
        <li>
          Personal information when you book or contact us: name, email, phone, Instagram handle,
          training level, and roommate notes.
        </li>
        <li>
          Payment information is collected by Stripe. We do not store card numbers on our servers.
        </li>
        <li>
          Usage data such as IP address, browser type and pages visited, to improve the site.
        </li>
      </ul>
      <h2 className="text-2xl">How we use it</h2>
      <p>
        To fulfil bookings, process payments (including pay in full or a €500 deposit with monthly
        payments), send itinerary and logistics, and — if you do not opt out — occasional updates
        about retreats.
      </p>
      <h2 className="text-2xl">Sharing</h2>
      <p>
        We do not sell your information. We share it with payment processors (Stripe) and as
        required by law, or to run the retreat (for example hotel rooming lists).
      </p>
      <h2 className="text-2xl">Your rights</h2>
      <p>
        You may ask to access, correct, or delete personal information, or stop marketing emails.
        Contact {CONTACT_EMAIL}.
      </p>
    </article>
  );
}
