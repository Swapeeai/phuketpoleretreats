import type { Metadata } from "next";
import { IMG, INSTRUCTORS, PACKAGES, RETREAT } from "@/lib/retreat";
import { LIVE } from "@/lib/live-copy";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { WHATSAPP_ME } from "@/lib/whatsapp";
import { formatEur } from "@/lib/format";

export const OG_IMAGE = IMG.heroPole;
export const OG_IMAGE_ALT =
  "Yvonne Smink on pole at the Phuket Pole Art Retreat, Ayara Kamala";

export function pageMetadata({
  title,
  description,
  path,
  image = OG_IMAGE,
  imageAlt = OG_IMAGE_ALT,
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
  imageAlt?: string;
}): Metadata {
  const url = path === "/" ? SITE_URL : `${SITE_URL}${path}`;
  const branded = `${title} | ${SITE_NAME}`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      locale: "en_GB",
      url,
      title: branded,
      description,
      images: [{ url: image, alt: imageAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title: branded,
      description,
      images: [image],
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
    sameAs: ["https://www.instagram.com/phuketpoleretreats", "https://www.phuketpoleretreats.com/"],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      url: WHATSAPP_ME,
      areaServed: "TH",
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
    name: RETREAT.name,
    description: LIVE.uniqueExperience,
    startDate: RETREAT.workshopsStartIso,
    endDate: RETREAT.workshopsEndIso,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    image: [OG_IMAGE, IMG.studio, IMG.aerialHotel],
    location: {
      "@type": "Place",
      name: RETREAT.venue,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Kamala",
        addressRegion: "Phuket",
        addressCountry: "TH",
      },
    },
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
      price: (pkg.fromCents / 100).toFixed(2),
      priceCurrency: "EUR",
      url: `${SITE_URL}/book/${pkg.slug}`,
      availability: "https://schema.org/InStock",
      validFrom: "2025-11-10",
      description: `From ${formatEur(pkg.fromCents)}. Pay in full, or €500 deposit today and monthly payments after.`,
    })),
  };
}

export function faqPageJsonLd(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((item) => ({
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
      item: item.path === "/" ? SITE_URL : `${SITE_URL}${item.path}`,
    })),
  };
}

export function offerJsonLd(pkg: (typeof PACKAGES)[number]) {
  return {
    "@context": "https://schema.org",
    "@type": "Offer",
    name: `${pkg.title} — ${RETREAT.name}`,
    description: pkg.description,
    price: (pkg.fromCents / 100).toFixed(2),
    priceCurrency: "EUR",
    url: `${SITE_URL}/book/${pkg.slug}`,
    availability: "https://schema.org/InStock",
    image: pkg.images[0],
    seller: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    itemOffered: {
      "@type": "Event",
      name: RETREAT.name,
      startDate: RETREAT.workshopsStartIso,
      endDate: RETREAT.workshopsEndIso,
      location: RETREAT.venue,
    },
  };
}
