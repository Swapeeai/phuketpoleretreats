import { INSTAGRAM_HANDLE, INSTAGRAM_URL } from "@/lib/site";
import { LIVE } from "@/lib/live-copy";
import { WHATSAPP_ME } from "@/lib/whatsapp";
import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border bg-sky text-foreground">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-3">
        <div>
          <p className="font-heading text-2xl">{LIVE.siteName}</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Pole Art Retreat · pole camp & training week in Phuket
            <br />
            Workshops {LIVE.heroDates}
            <br />
            Hotel 27 January – 2 February 2027
            <br />
            Ayara Kamala Resort & Spa, Kamala
          </p>
        </div>
        <div className="text-sm">
          <p className="font-medium">Message us on WhatsApp</p>
          <p className="mt-2">
            <Link className="text-primary underline-offset-4 hover:underline" href="/contact">
              Send a message
            </Link>
          </p>
          <p className="mt-1">
            <a className="text-primary underline-offset-4 hover:underline" href={WHATSAPP_ME}>
              Open WhatsApp
            </a>
          </p>
          <p className="mt-1">
            <a
              className="text-primary underline-offset-4 hover:underline"
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              Instagram @{INSTAGRAM_HANDLE}
            </a>
          </p>
        </div>
        <div className="flex flex-col gap-2 text-sm">
          <Link className="hover:text-primary hover:underline" href="/timetable">
            Timetable
          </Link>
          <Link className="hover:text-primary hover:underline" href="/book">
            {LIVE.bookNow}
          </Link>
          <Link className="hover:text-primary hover:underline" href="/faqs">
            FAQs
          </Link>
          <Link className="hover:text-primary hover:underline" href="/contact">
            Contact
          </Link>
          <Link className="hover:text-primary hover:underline" href="/privacy">
            Privacy policy
          </Link>
          <Link className="hover:text-primary hover:underline" href="/cancellation">
            Cancellation policy
          </Link>
        </div>
      </div>
      <p className="border-t border-border px-4 py-4 text-center text-xs text-muted-foreground">
        Phuket scenery via Unsplash. Studio photos from the retreat at Ayara Kamala.
      </p>
    </footer>
  );
}
