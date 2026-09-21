import type { Metadata } from "next";
import { Cormorant_Garamond, Poppins } from "next/font/google";
import { DemoBanner } from "@/components/demo-banner";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
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
    default: "Phuket Pole Retreats 2027 | Pole Art Retreat at Ayara Kamala",
    template: "%s | Phuket Pole Retreats",
  },
  description:
    "Book the Phuket Pole Art Retreat, 28 January–1 February 2027 at Ayara Kamala Resort & Spa. 12 hours with Yvonne Smink, Adam Lin, Karem Gutierrez and Jenny Liebert. Pay in full or €500 deposit plus automatic monthly Stripe payments.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_GB",
    title: "Phuket Pole Retreats 2027 | Pole Art Retreat at Ayara Kamala",
    description:
      "Pole art retreat in Kamala, Phuket. Workshops 28 January–1 February 2027. Pay in full or €500 deposit with automatic monthly balance.",
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en-GB"
      className={`${poppins.variable} ${cormorant.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background font-sans text-foreground">
        <DemoBanner />
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
