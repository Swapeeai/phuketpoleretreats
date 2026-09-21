import { PACKAGES, RETREAT } from "@/lib/retreat";
import { SITE_URL } from "@/lib/site";
import { formatEur } from "@/lib/format";

export function EventJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: RETREAT.name,
    description:
      "Pole art retreat in Kamala, Phuket with Yvonne Smink, Adam Lin, Karem Gutierrez and Jenny Liebert. 12 hours of workshops at Ayara Kamala Resort & Spa, 28 January–1 February 2027.",
    startDate: RETREAT.workshopsStartIso,
    endDate: RETREAT.workshopsEndIso,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
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
      name: "Phuket Pole Retreats",
      url: SITE_URL,
    },
    image: PACKAGES[1]?.images[0],
    offers: PACKAGES.map((pkg) => ({
      "@type": "Offer",
      name: pkg.title,
      price: (pkg.fromCents / 100).toFixed(2),
      priceCurrency: "EUR",
      url: `${SITE_URL}/book/${pkg.slug}`,
      availability: "https://schema.org/InStock",
      description: `From ${formatEur(pkg.fromCents)}. €500 deposit or pay in full.`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
