import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ScenicBand } from "@/components/scenic";
import { SCENERY } from "@/lib/images";
import { LIVE } from "@/lib/live-copy";
import { pageMetadata } from "@/lib/seo";
import { WHATSAPP_DISPLAY } from "@/lib/whatsapp";

export const metadata: Metadata = pageMetadata({
  title: "Contact us about the Phuket pole retreat",
  description:
    "Message Tara and Jenny on WhatsApp about the Phuket Pole Art Retreat — a pole camp and training week at Ayara Kamala, 28th January - 1st of February 2027. Ask about packages, levels, or booking.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
    <ScenicBand src={SCENERY.emeraldWater.src} alt={SCENERY.emeraldWater.alt} />
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: "Contact", path: "/contact" },
        ]}
      />
      <h1 className="mt-4 text-4xl sm:text-5xl">Contact us</h1>
      <p className="mt-4 text-base leading-relaxed text-[#272727]">{LIVE.contactLine}</p>
      <p className="mt-3 text-sm text-[#3e3e3e]">
        Send a note about the pole training week and we’ll open WhatsApp ({WHATSAPP_DISPLAY}) with
        your message ready for Tara and Jenny.
      </p>
      <div className="mt-8 border border-border bg-card p-6">
        <ContactForm />
      </div>
    </div>
    </>
  );
}
