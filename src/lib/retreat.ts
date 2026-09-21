export const IMG = {
  logo: "https://images.squarespace-cdn.com/content/v1/68fb556b0d1f83510d98f5ad/199c1f2d-1be8-421a-8555-3b1665a39e7e/phuket+pole+retreat+logo_final-01+png.png?format=750w",
  wordmark:
    "https://images.squarespace-cdn.com/content/v1/68fb556b0d1f83510d98f5ad/t/6912158b67037d3f57f591c7/1762792843524/Phuket+Pole+Retreats.png?format=1500w",
  heroPole:
    "https://images.squarespace-cdn.com/content/v1/68fb556b0d1f83510d98f5ad/38a79f52-5bf6-40e3-b038-7e224ab04446/313227446_814775089647749_1421659162350676131_n.jpg?format=2500w",
  aerialHotel:
    "https://images.squarespace-cdn.com/content/v1/68fb556b0d1f83510d98f5ad/245a91c1-04ba-4252-b6a7-9757d7716c5d/DJI_0043+copy.jpg?format=2500w",
  studio:
    "https://images.squarespace-cdn.com/content/v1/68fb556b0d1f83510d98f5ad/c9ad3c6b-dfcd-4229-a0ab-2ce0f8c8873d/_5R_0104+copy.jpg?format=1500w",
  pool:
    "https://images.squarespace-cdn.com/content/v1/68fb556b0d1f83510d98f5ad/09e2c3db-93dd-46ee-ab10-f6d8415869d0/_5R_8707-HDR+copy.jpg?format=1500w",
  oceanRoom:
    "https://images.squarespace-cdn.com/content/v1/68fb556b0d1f83510d98f5ad/0b41e1e1-4387-48c6-8694-4565c7a45a47/_5R_0005-Edit+copy.jpg?format=1500w",
  yvonne:
    "https://images.squarespace-cdn.com/content/v1/68fb556b0d1f83510d98f5ad/38a79f52-5bf6-40e3-b038-7e224ab04446/313227446_814775089647749_1421659162350676131_n.jpg?format=1000w",
  adam: "https://images.squarespace-cdn.com/content/v1/68fb556b0d1f83510d98f5ad/77d58f64-6789-4c74-b6e3-522c6625984c/652869477_18459251176103611_2046000239341642571_n.jpg?format=1000w",
  karem:
    "https://images.squarespace-cdn.com/content/v1/68fb556b0d1f83510d98f5ad/74f0b47b-f721-4f65-b29a-048dbd873c6e/449326103_842055617834279_6150770629574693411_n.jpg?format=1000w",
  jenny:
    "https://images.squarespace-cdn.com/content/v1/68fb556b0d1f83510d98f5ad/d07ccae5-e510-464d-95b9-b0e2f9845219/367441823_960994708522537_471410969461966098_n.jpg?format=1000w",
};

export const RETREAT = {
  name: "Phuket Pole Art Retreat 2027",
  shortName: "Phuket Pole Retreats",
  venue: "Ayara Kamala Resort & Spa",
  location: "Kamala, Phuket, Thailand",
  workshopsStartIso: "2027-01-28",
  workshopsEndIso: "2027-02-01",
  checkInIso: "2027-01-27",
  checkOutIso: "2027-02-02",
  balanceDeadlineIso: "2026-11-28",
  depositCents: 50_000,
  currency: "eur" as const,
  headlineDates: "28 January – 1 February 2027",
  accommodationDates: "27 January – 2 February 2027",
  workshopHours: 12,
  groupSize: 12,
  levels: ["Intermediate", "Advanced", "Pro"] as const,
};

export type Occupancy = "shared" | "solo";
export type Level = (typeof RETREAT.levels)[number];
export type PaymentPlan = "full" | "installments";

export type PackageVariant = {
  occupancy: Occupancy | null;
  priceCents: number;
  sku: string;
};

export type RetreatPackage = {
  slug: string;
  title: string;
  fromCents: number;
  roomSize?: string;
  nights?: number;
  includesHotel: boolean;
  highlights: string[];
  description: string;
  images: string[];
  variants: PackageVariant[];
  notes?: string[];
};

export const PACKAGES: RetreatPackage[] = [
  {
    slug: "workshops-only",
    title: "Workshops Only",
    fromCents: 85_000,
    includesHotel: false,
    description:
      "Book the workshops, welcome dinner, boat trip and goody bag. You arrange your own accommodation and transport to Ayara Kamala Resort & Spa.",
    highlights: [
      "12 hours of pole workshops with four instructors",
      "Welcome dinner at Ayara Kamala Resort & Spa",
      "Group boat trip around Phuket’s islands",
      "Goody bag",
    ],
    images: [IMG.aerialHotel],
    variants: [{ occupancy: null, priceCents: 85_000, sku: "SQ6277715" }],
    notes: [
      "Flights and airport transfers are not included.",
      "You are responsible for your own hotel and transport to the studio.",
    ],
  },
  {
    slug: "deluxe-ocean-view",
    title: "Deluxe Ocean View",
    fromCents: 140_000,
    roomSize: "42sqm ocean-view room",
    nights: 6,
    includesHotel: true,
    description:
      "Workshops plus six nights in a 42sqm Deluxe Ocean View room at Ayara Kamala, where the pole studio is located.",
    highlights: [
      "12 hours of workshops with world-class instructors",
      "Welcome dinner",
      "6 nights at Ayara Kamala Resort & Spa, 27 January – 2 February 2027",
      "42sqm room with sea view",
      "Daily breakfast",
      "60-minute massage at Ayara Spa",
      "Group boat trip",
      "Goody bag",
    ],
    images: [
      "https://images.squarespace-cdn.com/content/v1/68fb556b0d1f83510d98f5ad/0b41e1e1-4387-48c6-8694-4565c7a45a47/_5R_0005-Edit+copy.jpg?format=1500w",
      "https://images.squarespace-cdn.com/content/v1/68fb556b0d1f83510d98f5ad/876ce8af-fbf7-4646-b802-c22938a5e9fd/_5R_0029-Edit+copy.jpg?format=1500w",
      "https://images.squarespace-cdn.com/content/v1/68fb556b0d1f83510d98f5ad/a313173e-652c-48ff-9d0f-d635c98a8b70/_5R_0065-Edit+copy.jpg?format=1500w",
      "https://images.squarespace-cdn.com/content/v1/68fb556b0d1f83510d98f5ad/e3fe2ba5-08b6-4ecd-a79e-61cb5a3b1892/_5R_9857-2+copy.jpg?format=1500w",
    ],
    variants: [
      { occupancy: "shared", priceCents: 140_000, sku: "SQ6230857" },
      { occupancy: "solo", priceCents: 195_000, sku: "SQ8137544" },
    ],
  },
  {
    slug: "grand-thai-natural",
    title: "Grand Thai Natural Ocean View & Spa Bath",
    fromCents: 147_500,
    roomSize: "80sqm ocean-view room with spa bath",
    nights: 6,
    includesHotel: true,
    description:
      "Workshops plus six nights in an 80sqm Grand Thai Natural ocean-view room with spa bath. This room can sleep three — email us if you would like to share between three.",
    highlights: [
      "12 hours of workshops",
      "Welcome dinner",
      "6 nights at Ayara Kamala Resort & Spa",
      "80sqm room with sea view and spa bath",
      "Daily breakfast",
      "60-minute massage",
      "Group boat trip",
      "Goody bag",
    ],
    images: [
      "https://images.squarespace-cdn.com/content/v1/68fb556b0d1f83510d98f5ad/34cb6aca-f949-475d-aa85-b80f5906aba7/_5R_8798+copy.jpg?format=1500w",
      "https://images.squarespace-cdn.com/content/v1/68fb556b0d1f83510d98f5ad/d634f425-1eab-4f6a-956e-b154bd3a12a8/_5R_8840-HDR+copy.jpg?format=1500w",
      "https://images.squarespace-cdn.com/content/v1/68fb556b0d1f83510d98f5ad/61391e89-bb4b-4016-b8ad-73e4f6f4801a/_5R_8832+copy.jpg?format=1500w",
    ],
    variants: [
      { occupancy: "shared", priceCents: 147_500, sku: "SQ2361984" },
      { occupancy: "solo", priceCents: 210_000, sku: "SQ1174626" },
    ],
    notes: [
      "This room can fit three guests. Email us if you would like to share between three.",
    ],
  },
  {
    slug: "deluxe-pool-access",
    title: "Deluxe with Pool Access Ocean View",
    fromCents: 152_500,
    roomSize: "63sqm ocean-view room with pool access",
    nights: 6,
    includesHotel: true,
    description:
      "Workshops plus six nights in a 63sqm Deluxe ocean-view room with direct pool access from your room.",
    highlights: [
      "12 hours of workshops",
      "Welcome dinner",
      "6 nights at Ayara Kamala Resort & Spa",
      "63sqm room with sea view",
      "Pool access directly from your room",
      "Daily breakfast",
      "60-minute massage",
      "Group boat trip",
      "Goody bag",
    ],
    images: [
      "https://images.squarespace-cdn.com/content/v1/68fb556b0d1f83510d98f5ad/244d1248-eb91-495a-bd45-529c4938fbba/_5R_8430-HDR+copy.jpg?format=1500w",
      "https://images.squarespace-cdn.com/content/v1/68fb556b0d1f83510d98f5ad/d815f0b9-f170-47ec-a780-7aff0fb96775/IMG_2638.jpg?format=1500w",
      "https://images.squarespace-cdn.com/content/v1/68fb556b0d1f83510d98f5ad/dfc88c0b-ee91-4218-8878-4e1e9f918871/3deluxepoolaccess2.jpg?format=1500w",
    ],
    variants: [
      { occupancy: "shared", priceCents: 152_500, sku: "SQ5604482" },
      { occupancy: "solo", priceCents: 220_000, sku: "SQ6442635" },
    ],
  },
  {
    slug: "grand-thai-private-pool",
    title: "Grand Thai with Private Pool & Spa Bath",
    fromCents: 172_500,
    roomSize: "80sqm ocean-view room with private pool",
    nights: 6,
    includesHotel: true,
    description:
      "Workshops plus six nights in an 80sqm Grand Thai ocean-view suite with a private pool and spa bath.",
    highlights: [
      "12 hours of workshops",
      "Welcome dinner",
      "6 nights at Ayara Kamala Resort & Spa",
      "80sqm room with sea view",
      "Private pool and spa bath",
      "Daily breakfast",
      "60-minute massage",
      "Group boat trip",
      "Goody bag",
    ],
    images: [
      "https://images.squarespace-cdn.com/content/v1/68fb556b0d1f83510d98f5ad/d6933d61-4af0-4a56-af45-a747ec4a5123/_5R_8671+copy.jpg?format=1500w",
      "https://images.squarespace-cdn.com/content/v1/68fb556b0d1f83510d98f5ad/ac2c6084-9e2f-4155-b7cd-cfaad364f4e4/_5R_8666+copy.jpg?format=1500w",
      "https://images.squarespace-cdn.com/content/v1/68fb556b0d1f83510d98f5ad/09e2c3db-93dd-46ee-ab10-f6d8415869d0/_5R_8707-HDR+copy.jpg?format=1500w",
    ],
    variants: [
      { occupancy: "shared", priceCents: 172_500, sku: "SQ3635133" },
      { occupancy: "solo", priceCents: 260_000, sku: "SQ2470867" },
    ],
  },
];

export const INSTRUCTORS = [
  {
    name: "Yvonne Smink",
    handle: "@yvonnesmink",
    url: "https://www.instagram.com/yvonnesmink/",
    image: IMG.yvonne,
    bio: [
      "Yvonne Smink is a Dutch pole dance artist, instructor, and 2014 Dutch Pole Champion. She came to pole in 2011 from a wall-climbing background. Since then she's trained largely self-taught, developing a distinctive style rooted in her own body and movement.",
      "Known for her spinning and inversion combos, handstand work, and her ability to connect with dancers at every level, she brings both technical depth and genuine warmth to her teaching. Her choreography is deeply personal — she describes her performances as taking a piece of herself, whatever she's feeling or working through, and turning it into movement on stage.",
    ],
  },
  {
    name: "Adam Lin",
    handle: "@apolelin",
    url: "https://www.instagram.com/apolelin/",
    image: IMG.adam,
    bio: [
      "Adam Lin is one of the most decorated pole competitors in the world. A two-time Mr. Pole Dance World champion, two-time Pole Icon Global winner (2022 & 2026), Australian Pole Champion, and 2019 Overall Champion of Pole Theatre UK & HK, his titles span over a decade of international competition at the highest level.",
      "Off the competition floor, Adam is the founder of Haus of Icons, a premium coaching brand built specifically for pole performers and competitors ready to elevate their craft. His mission has always been the same: help every pole dancer find themselves and perform like they were born to.",
    ],
  },
  {
    name: "Karem Gutierrez",
    handle: "@karemgutierrez",
    url: "https://www.instagram.com/karemgutierrez/",
    image: IMG.karem,
    bio: [
      "Karem Gutierrez comes from Caracas, Venezuela, currently living in Barcelona and has been a pole dance artist since 2014. She has more than 9 years of experience as a pole dance instructor for all levels and as a competitor trainer.",
      "Karem has won multiple international competitions. She is two-time champion in Women's Elite of the Pole Spain 2022-2023 competition, champion in the Women's Exotic Pro in the Catalunya Pole 2023, obtaining the highest score of the entire competition as well as in the Pole Art International 2023 in the Storyteller Elite category.",
    ],
  },
  {
    name: "Jenny Liebert",
    handle: "@jenny_pole_phuket",
    url: "https://www.instagram.com/jenny_pole_phuket/",
    image: IMG.jenny,
    bio: [
      "With a background in gymnastics and contortion, Jenny has been part of the pole dance industry for over 16 years, teaching internationally and organizing training camps around the world. Known for her attention to detail, refined technique, and expressive approach, she helps students reach their full potential in every aspect of pole artistry.",
      "Over the years, Jenny has expanded her teaching to include exotic dance and expressive movement, developing a distinctive fusion of acrobatic and dance styles. Her most recent influence comes from Russian acro-style, combining fluid floorwork, acrobatics, and dance.",
    ],
  },
];

export const FAQS = [
  {
    q: "Is the retreat suitable for dancers of all levels?",
    a: "This year’s groups are split into Intermediate, Advanced, and Pro. Intermediate polers strengthen foundations and build fluidity. Advanced polers refine personal style and artistic performance. Pro polers focus on combo creation, musicality, choreography, and style. We welcome polers aged 18+.",
  },
  {
    q: "How many hours of pole will we do per day?",
    a: "Two 90-minute workshops per day across four days, back to back with a short break — 12 hours in total. Your schedule and welcome pack are emailed a few months before the retreat.",
  },
  {
    q: "How do payments work?",
    a: "Pay in full today, or pay 500 EUR upon booking and the remaining payment in monthly instalments, finishing up to 60 days before the start of the retreat (28 November 2026). Bookings are non-refundable.",
  },
  {
    q: "What should I pack?",
    a: "Comfortable pole attire, extra workout gear if you want to train outside class, grip aids, beachwear, sunscreen, casual clothes, and something nice for the welcome dinner.",
  },
  {
    q: "What accommodation is included?",
    a: "Workshop + hotel packages stay at Ayara Kamala Resort & Spa, where the studio is. Shared rooms and private (solo) suites are available, some with pool access or private pools. Workshops-only means you organise your own hotel. If you book shared and are coming solo, we can match you with another guest — email us.",
  },
  {
    q: "Is transport included?",
    a: "Flights and airport transfers are not included.",
  },
  {
    q: "Are meals included?",
    a: "The welcome dinner on the first night is included for every package. Hotel packages include daily breakfast. Other meals are not included.",
  },
  {
    q: "Can I come alone? Can I bring a non-poler?",
    a: "Yes to both. Many guests come solo. If you bring a partner, friend, or relative who does not pole, book the Solo hotel package so they can stay with you at no extra room cost.",
  },
  {
    q: "What is the cancellation policy?",
    a: "Bookings are non-refundable. If you find someone to take your place, notify us and we will update the booking. If we have to cancel the retreat, you may transfer to a future retreat. Raise any issues during the stay with both Tara and Jenny.",
  },
];

export function getPackage(slug: string) {
  return PACKAGES.find((item) => item.slug === slug);
}

export function getVariant(pkg: RetreatPackage, occupancy: Occupancy | null) {
  if (!pkg.includesHotel) {
    return pkg.variants[0];
  }
  return pkg.variants.find((item) => item.occupancy === occupancy) ?? null;
}
