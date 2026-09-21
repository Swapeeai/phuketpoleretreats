import type { Metadata } from "next";
import { Cormorant_Garamond, Poppins } from "next/font/google";
import { ChatBubble } from "@/components/chat-bubble";
import { DatesBar } from "@/components/dates-bar";
import { DemoBanner } from "@/components/demo-banner";
import { JsonLd } from "@/components/json-ld";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { OG_IMAGE, OG_IMAGE_ALT, organizationJsonLd, websiteJsonLd } from "@/lib/seo";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Phuket Pole Retreats 2027 | Pole Art Camp at Ayara Kamala",
    template: "%s | Phuket Pole Retreats",
  },
  description:
    "The Pole Art Retreat is a unique training experience designed to help dancers explore the connection between pole, movement, and self-expression. A pole training week in Phuket, 28th January - 1st of February 2027 at Ayara Kamala — intermediate, advanced and pro polers. Pay in full, or €500 deposit today and monthly payments after.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_GB",
    url: SITE_URL,
    title: "Phuket Pole Retreats 2027 | Pole Art Camp at Ayara Kamala",
    description:
      "More than just a pole camp, it’s a creative journey through flow, artistry, and personal discovery. 28th January - 1st of February 2027, Ayara Kamala, Phuket.",
    images: [{ url: OG_IMAGE, alt: OG_IMAGE_ALT }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Phuket Pole Retreats 2027 | Pole Art Camp at Ayara Kamala",
    description:
      "More than just a pole camp, it’s a creative journey through flow, artistry, and personal discovery. Pole training week in Phuket, 28 Jan–1 Feb 2027.",
    images: [OG_IMAGE],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en-GB"
      className={`${poppins.variable} ${cormorant.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background font-sans text-foreground">
        <JsonLd data={organizationJsonLd()} />
        <JsonLd data={websiteJsonLd()} />
        <div className="sticky top-0 z-40">
          <DemoBanner />
          <DatesBar />
          <SiteHeader />
        </div>
        <main className="flex-1">{children}</main>
        <SiteFooter />
        <ChatBubble />
      </body>
    </html>
  );
}
