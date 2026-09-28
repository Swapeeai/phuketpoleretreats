import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Suspense } from "react";
import { Cormorant_Garamond, Poppins } from "next/font/google";
import Script from "next/script";
import { ChatBubble } from "@/components/chat-bubble";
import { CookieBanner } from "@/components/cookie-banner";
import { DatesBar } from "@/components/dates-bar";
import { JsonLd } from "@/components/json-ld";
import { MarketingTags } from "@/components/marketing-tags";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import {
  CONSENT_STORAGE_KEY,
  googleSiteVerification,
  hasGoogleMarketingIds,
} from "@/lib/marketing-config";
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

const HOME_TITLE = "Pole Retreat Phuket 2027 | Ayara Kamala Pole Camp";
const HOME_DESCRIPTION =
  "The Pole Art Retreat — a pole camp in Phuket for intermediate, advanced and pro polers at Ayara Kamala, 28 January–1 February 2027.";

const googleVerification = googleSiteVerification();

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: HOME_TITLE,
    template: "%s | Phuket Pole Retreats",
  },
  description: HOME_DESCRIPTION,
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_GB",
    url: SITE_URL,
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: OG_IMAGE_ALT }],
  },
  twitter: {
    card: "summary_large_image",
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    images: [OG_IMAGE],
  },
  robots: { index: true, follow: true },
  ...(googleVerification ? { verification: { google: googleVerification } } : {}),
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en-GB"
      className={`${poppins.variable} ${cormorant.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background font-sans text-foreground">
        <Script id="cookie-consent-state" strategy="beforeInteractive">
          {`try{var c=localStorage.getItem(${JSON.stringify(CONSENT_STORAGE_KEY)});if(c==="accepted"||c==="rejected")document.documentElement.setAttribute("data-cookie-consent",c);}catch(e){}`}
        </Script>
        {hasGoogleMarketingIds() ? (
          <Script id="google-consent-default" strategy="beforeInteractive">
            {`window.dataLayer=window.dataLayer||[];window.gtag=window.gtag||function(){dataLayer.push(arguments)};window.__pprGoogleDefault=1;gtag('consent','default',{ad_storage:'denied',analytics_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',wait_for_update:500});`}
          </Script>
        ) : null}
        <JsonLd data={organizationJsonLd()} />
        <JsonLd data={websiteJsonLd()} />
        <div className="sticky top-0 z-40">
          <DatesBar />
          <SiteHeader />
          <CookieBanner />
        </div>
        <main className="flex-1">{children}</main>
        <SiteFooter />
        <ChatBubble />
        <Suspense fallback={null}>
          <MarketingTags />
        </Suspense>
      </body>
    </html>
  );
}
