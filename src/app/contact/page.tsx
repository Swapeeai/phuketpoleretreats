import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ScenicBand } from "@/components/scenic";
import { SCENERY } from "@/lib/images";
import { LIVE } from "@/lib/live-copy";
import { pageMetadata } from "@/lib/seo";
import { WHATSAPP_DISPLAY } from "@/lib/whatsapp";

export const metadata: Metadata = pageMetadata({
  title: "Contact the Phuket Pole Retreat",
  description:
    "Questions about the pole camp in Phuket or the Ayara Kamala pole retreat? Message us on WhatsApp about packages and your pole training week group.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
    <ScenicBand src={SCENERY.kamalaIslands.src} alt={SCENERY.kamalaIslands.alt} />
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: "Contact", path: "/contact" },
        ]}
      />
      <h1 className="mt-4 text-4xl sm:text-5xl">Contact us</h1>
      <p className="mt-4 text-base leading-relaxed text-[#272727]">{LIVE.contactLine}</p>
      <p className="mt-3 text-sm leading-relaxed text-[#3e3e3e]">
        We are a small retreat team in Phuket — warm, on-the-ground, and happy to help you choose a
        package or level. Fill in the form and we’ll open WhatsApp ({WHATSAPP_DISPLAY}) with your
        enquiry ready to send.
      </p>
      <div className="mt-8 border border-border bg-card p-6">
        <ContactForm />
      </div>
    </div>
    </>
  );
}
