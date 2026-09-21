import Link from "next/link";
import { CONTACT_EMAIL, INSTAGRAM_URL, WHATSAPP_DISPLAY, WHATSAPP_URL } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border bg-[#1c1410] text-[#f6efe6]">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <p className="font-heading text-2xl">Phuket Pole Retreats</p>
          <p className="mt-2 text-sm text-[#f6efe6]/70">
            Pole Art Retreat at Ayara Kamala Resort & Spa. 28 January – 1 February 2027.
          </p>
        </div>
        <div className="text-sm">
          <p className="font-medium">Talk to Tara & Jenny</p>
          <p className="mt-2">
            <a className="underline-offset-4 hover:underline" href={`mailto:${CONTACT_EMAIL}`}>
              {CONTACT_EMAIL}
            </a>
          </p>
          <p className="mt-1">
            <a className="underline-offset-4 hover:underline" href={WHATSAPP_URL}>
              WhatsApp {WHATSAPP_DISPLAY}
            </a>
          </p>
          <p className="mt-1">
            <a className="underline-offset-4 hover:underline" href={INSTAGRAM_URL}>
              Instagram @phuketpoleretreats
            </a>
          </p>
        </div>
        <div className="flex flex-col gap-2 text-sm">
          <Link className="hover:underline" href="/book">
            Book now
          </Link>
          <Link className="hover:underline" href="/faqs">
            FAQs
          </Link>
          <Link className="hover:underline" href="/privacy">
            Privacy policy
          </Link>
          <Link className="hover:underline" href="/cancellation">
            Cancellation policy
          </Link>
        </div>
      </div>
    </footer>
  );
}
