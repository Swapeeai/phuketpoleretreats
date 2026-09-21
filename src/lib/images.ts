import { INSTAGRAM_URL } from "@/lib/site";

/** Self-hosted scenery: Unsplash License (https://unsplash.com/license). */
export const SCENERY = {
  phiPhiLongtails: {
    src: "/images/phuket/phi-phi-longtails.jpg",
    alt: "Thai longtail boats on a tropical beach beneath green limestone cliffs — classic Andaman Sea scene",
    credit: "Unsplash License, photo 1552465011-b4e21bf6e79a (Phi Phi Islands longtail boats)",
    href: "https://unsplash.com/photos/1552465011-b4e21bf6e79a",
  },
  longtailLagoon: {
    src: "/images/phuket/longtail-lagoon.jpg",
    alt: "Longtail boats in turquoise water beside a lush green cliff in Thailand",
    credit: "Prakasam Mathaiyan (@iamprakasam) — Unsplash License, photo poMDxMaQuHo",
    href: "https://unsplash.com/photos/poMDxMaQuHo",
  },
  kamalaIslands: {
    src: "/images/phuket/kamala-islands.jpg",
    alt: "Green islands in the Andaman Sea off Kamala, Phuket",
    credit: "Max Bvp (@maxbvp) — Unsplash License, photo Bqlh027ARn0",
    href: "https://unsplash.com/photos/Bqlh027ARn0",
  },
  phuketSunset: {
    src: "/images/phuket/phuket-sunset.jpg",
    alt: "Sunset over palms and the sea in Phuket, Thailand",
    credit: "Mikk Tõnissoo (@themikk) — Unsplash License, photo jc_7ETQJCBY",
    href: "https://unsplash.com/photos/jc_7ETQJCBY",
  },
  phuketCoast: {
    src: "/images/phuket/phuket-coast.jpg",
    alt: "Tropical coastline and limestone islands near Phuket, Thailand",
    credit: "Abhishek Revis (@abhishekrevis) — Unsplash License, photo Cur9scsylPY",
    href: "https://unsplash.com/photos/Cur9scsylPY",
  },
  thailandJungle: {
    src: "/images/phuket/thailand-jungle.jpg",
    alt: "Lush green jungle and water in Thailand",
    credit: "Waranont (Joe) (@tricell1991) — Unsplash License, photo tQNPZaVJ3LA",
    href: "https://unsplash.com/photos/tQNPZaVJ3LA",
  },
  emeraldWater: {
    src: "/images/phuket/emerald-water.jpg",
    alt: "Emerald tropical water and forest at Erawan Falls, Thailand",
    credit: "Tomáš Malík (@malcoo) — Unsplash License, photo XmQmGD-IeBA",
    href: "https://unsplash.com/photos/XmQmGD-IeBA",
  },
} as const;

export const TIMETABLE = {
  src: "/images/workshop-timetable.png",
  alt: "Colour workshop timetable for the Phuket Pole Art Retreat 2027 — workshops 28 January to 1 February, hotel package 27 January to 2 February, classes with Karem Gutierrez, Adam Lin, Yvonne Smink and Jenny Liebert, boat trip 30 January, official checkout 2 February",
  width: 1912,
  height: 1266,
} as const;

/** Real Ayara Kamala / pole studio photos published on the live retreat site. */
export const VENUE = {
  studio: {
    src: "/images/venue/studio.jpg",
    alt: "Pole studio at Ayara Kamala with floor-to-ceiling poles and sea views",
  },
  aerial: {
    src: "/images/venue/aerial-hotel.jpg",
    alt: "Aerial view of Ayara Kamala Resort & Spa on the Kamala hillside, Phuket",
  },
  pool: {
    src: "/images/venue/pool.jpg",
    alt: "Private infinity pool at sunset at Ayara Kamala Resort & Spa, Phuket",
  },
  oceanRoom: {
    src: "/images/venue/ocean-room.jpg",
    alt: "Deluxe ocean-view room at Ayara Kamala Resort & Spa",
  },
} as const;

export const INSTAGRAM_GALLERY = [
  { ...VENUE.studio, href: INSTAGRAM_URL, label: "The studio" },
  { ...VENUE.aerial, href: INSTAGRAM_URL, label: "Ayara Kamala" },
  { ...VENUE.pool, href: INSTAGRAM_URL, label: "Pool" },
  { ...VENUE.oceanRoom, href: INSTAGRAM_URL, label: "Ocean view" },
] as const;
