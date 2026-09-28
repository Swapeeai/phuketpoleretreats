import type { Metadata } from "next";
import { VENUE } from "@/lib/images";
import { LIVE } from "@/lib/live-copy";
import { IMG, INSTRUCTORS, PACKAGES, RETREAT } from "@/lib/retreat";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { WHATSAPP_ME } from "@/lib/whatsapp";
import { formatEur } from "@/lib/format";

/** 1200×630 crop of the self-hosted studio and Ayara Kamala aerial. */
export const OG_IMAGE_PATH = "/images/og/phuket-pole-retreat.jpg";
export const OG_IMAGE_ALT =
  "Pole studio at Ayara Kamala beside an aerial view of the resort in Kamala, Phuket";

export function absoluteUrl(pathOrUrl: string) {
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  const path = pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`;
  return `${SITE_URL}${path}`;
}

export function canonicalUrl(path: string) {
  if (!path || path === "/") return SITE_URL;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export const OG_IMAGE = absoluteUrl(OG_IMAGE_PATH);

const EVENT_START = `${RETREAT.workshopsStartIso}T10:00:00+07:00`;
const EVENT_END = `${RETREAT.workshopsEndIso}T13:30:00+07:00`;

const OG_IMAGE_META = {
  url: OG_IMAGE,
  width: 1200,
  height: 630,
  alt: OG_IMAGE_ALT,
} as const;

export function pageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  const url = canonicalUrl(path);
  const branded = `${title} | ${SITE_NAME}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      locale: "en_GB",
      url,
      title: branded,
      description,
      images: [OG_IMAGE_META],
    },
    twitter: {
      card: "summary_large_image",
      title: branded,
      description,
      images: [OG_IMAGE],
    },
  };
}

function venuePlace() {
  return {
    "@type": "Place",
    name: RETREAT.venue,
    url: "https://www.ayarakamalaresort.com/",
    address: {
      "@type": "PostalAddress",
      streetAddress: "22/10 Moo 6, Layi-Nakalay Road",
      addressLocality: "Kamala",
      addressRegion: "Phuket",
      postalCode: "83150",
      addressCountry: "TH",
    },
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: IMG.logo,
    image: OG_IMAGE,
    sameAs: ["https://www.instagram.com/phuketpoleretreats"],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      url: WHATSAPP_ME,
      availableLanguage: ["en"],
    },
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description: LIVE.uniqueExperience,
    inLanguage: "en-GB",
    publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
  };
}

export function eventJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: "Phuket Pole Retreat 2027 — Pole Art Camp at Ayara Kamala",
    description: LIVE.uniqueExperience,
    url: SITE_URL,
    startDate: EVENT_START,
    endDate: EVENT_END,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    image: [OG_IMAGE, absoluteUrl(VENUE.studio.src), absoluteUrl(VENUE.aerial.src)],
    inLanguage: "en-GB",
    location: venuePlace(),
    organizer: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    performer: INSTRUCTORS.map((instructor) => ({
      "@type": "Person",
      name: instructor.name,
      url: instructor.url,
    })),
    offers: PACKAGES.map((pkg) => ({
      "@type": "Offer",
      name: pkg.title,
      price: pkg.fromCents / 100,
      priceCurrency: "EUR",
      url: `${SITE_URL}/book/${pkg.slug}`,
      availability: "https://schema.org/InStock",
      validFrom: "2025-11-10",
      description: `From ${formatEur(pkg.fromCents)}. Pay in full, or €500 deposit today and monthly payments after.`,
      seller: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    })),
  };
}

export function faqPageJsonLd(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs
      .filter((item) => item.q.trim() && item.a.trim())
      .map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: canonicalUrl(item.path),
    })),
  };
}

export function offerJsonLd(pkg: (typeof PACKAGES)[number]) {
  return {
    "@context": "https://schema.org",
    "@type": "Offer",
    name: `${pkg.title} — pole retreat at Ayara Kamala`,
    description: pkg.description,
    price: pkg.fromCents / 100,
    priceCurrency: "EUR",
    url: `${SITE_URL}/book/${pkg.slug}`,
    availability: "https://schema.org/InStock",
    validFrom: "2025-11-10",
    image: absoluteUrl(pkg.images[0] ?? OG_IMAGE_PATH),
    seller: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    itemOffered: {
      "@type": "Event",
      name: RETREAT.name,
      startDate: EVENT_START,
      endDate: EVENT_END,
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      eventStatus: "https://schema.org/EventScheduled",
      location: venuePlace(),
    },
  };
}
