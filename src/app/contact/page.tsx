import type { Metadata } from "next";
import { buttonVariants } from "@/components/ui/button";
import { CONTACT_EMAIL, WHATSAPP_DISPLAY, WHATSAPP_URL } from "@/lib/site";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Contact Tara & Jenny",
  description:
    "Questions about the Phuket Pole Art Retreat 2027 or booking? Email info@ibizapoleretreats.com or WhatsApp +66 92 832 0802.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-4xl sm:text-5xl">Contact us</h1>
      <p className="mt-4 text-muted-foreground">
        If you have questions about the retreat or the booking process, email or message us on
        WhatsApp. Organisers Tara and Jenny both see enquiries.
      </p>
      <div className="mt-8 space-y-4 rounded-2xl border border-border bg-card p-6">
        <p>
          Email{" "}
          <a className="underline underline-offset-4" href={`mailto:${CONTACT_EMAIL}`}>
            {CONTACT_EMAIL}
          </a>
        </p>
        <p>
          WhatsApp{" "}
          <a className="underline underline-offset-4" href={WHATSAPP_URL}>
            {WHATSAPP_DISPLAY}
          </a>
        </p>
      </div>
      <a href={WHATSAPP_URL} className={cn(buttonVariants({ size: "lg" }), "mt-8 inline-flex h-11")}>
        Message on WhatsApp
      </a>
    </div>
  );
}
