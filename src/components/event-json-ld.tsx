import { PACKAGES, RETREAT } from "@/lib/retreat";
import { LIVE } from "@/lib/live-copy";
import { SITE_URL } from "@/lib/site";
import { formatEur } from "@/lib/format";

export function EventJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: RETREAT.name,
    description: LIVE.uniqueExperience,
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
      description: `From ${formatEur(pkg.fromCents)}. Pay in full, or €500 deposit today and monthly payments after.`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
