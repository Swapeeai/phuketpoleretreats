/** Wording copied from https://www.phuketpoleretreats.com/ — do not rewrite. */

export const LIVE = {
  welcome: "Welcome to",
  siteName: "Phuket Pole Retreats",
  heroDates: "28th January - 1st of February 2027",
  heroInstructors: "Yvonne Smink - Karem Gutierrez - Adam Lin - Jenny Liebert",
  bookNow: "Book now",
  uniqueExperience:
    "The Pole Art Retreat is a unique training experience designed to help dancers explore the connection between pole, movement, and self-expression.",
  uniqueHighlight: "explore the connection between pole, movement, and self-expression",
  notPushing:
    "This retreat is not about pushing your body to its limits, it’s about learning to move intentionally and reconnecting with what feels right for each of us through the art of pole.",
  moreThanCamp:
    "More than just a pole camp, it’s a creative journey through flow, artistry, and personal discovery. Throughout the week, you will learn to combine movements seamlessly, refine your technique, and develop a deeper sense of style.",
  intermediateTitle: "🌺 For Intermediate Dancers",
  intermediate:
    "Intermediate participants will explore fluidity and combination work. Classes will focus on connecting familiar moves into longer, more complex and expressive sequences — introducing rhythm, musicality, and transitions that will make your dancing flow naturally. This level is also perfect for developing a broader movement vocabulary both high up on the pole and in low flow. These sessions will encourage you to experiment with pace, direction, and movement quality — transforming technique into performance.",
  advancedTitle: "🌹 For Advanced Dancers",
  advanced:
    "Advanced students will dive into creative exploration and performance depth. You’ll challenge your versatility through advanced combos, spatial awareness, style development, and artistic effects. Specialised workshops such as choreography-creation labs and combo-design sessions will guide you in creating your own pieces — exploring how to communicate emotion and impact through movement. You will be invited to express your individuality and evolve your artistic identity in a supportive, inspiring environment.",
  proTitle: "✨ For Pro Polers",
  pro: "We focus on combo creation, musicality, choreography, and style development — turning advanced vocabulary into personal artistry.",
  proClose:
    "This retreat is about more than just technique—it’s about body and mind, expansion of self, and pushing past limits. If you’re looking to expand your creativity, refine your flow, and master breathtaking pole tricks, this experience is for you.",
  bookYourSpot: "Book your spot on Phuket Pole Retreats!",
  scheduleTitle: "Schedule",
  schedule:
    "12 hours of pole workshops across 5 days, with 4 world class instructors. A welcome feast, a team boat trip around the beautiful islands of Phuket and lots of free time in between to explore and relax!",
  scheduleStay:
    "For accommodation packages, checkin is on the 27th of January and checkout is on the 2nd of February.",
  boatDayEyebrow: "Saturday 30 January",
  boatDayTitle: "A day on the water, together",
  boatDayLead:
    "After the morning workshops we all go out — a day on the road and the sea around the beautiful islands of Phuket.",
  boatDayBody:
    "It is the holiday in the middle of the training week: the same people you have just been spinning with, out on the water with your favourite instructor. Not another class. Just the group, the islands, and a long, easy afternoon together.",
  whatToExpect: "what to expect",
  studioTitle: "The Studio (Ayara Kamala Phuket)",
  studio: [
    "Beautiful air conditioned studio within the Ayara Kamala hotel",
    "9 floor to ceiling fixed poles, 3 meters tall, a mix of 45mm, 40mm, chrome, stainless and 2 powder coat (45mm and 40mm)",
    "Crash mats available",
  ],
  hotelTitle: "The Hotel (Ayara Kamala Phuket)",
  hotel: [
    "You can Book workshop only or workshop + accommodation package (Stay at Ayara Kamala Resort & Spa)",
    "Daily buffet and a la carte breakfast included",
    "5 minute shuttle to Kamala for the beach, shops and restaurants",
    "60 minute massage included",
    "Partners/friends/family welcome as non polers",
  ],
  classesTitle: "The Classes",
  classes: [
    "12 hours of workshops with world class pole artists across 4 days",
    "2 x 1.5 hour workshops per day, with a short break in between",
    "Small groups of 12 people maximum",
    "3 groups based on ability: intermediate, advanced and pro",
  ],
  activitiesTitle: "The activities",
  activities: [
    "Welcome diner at Ayara Kamala with Thai specialities and a sea view",
    "Goody bag and welcome pack",
    "Group boat trip around the beautiful islands of Phuket on 30 January",
    "Optional extra: Photoshoot",
  ],
  contactLine:
    "If you have any questions about the retreat or booking, you can contact us on WhatsApp by clicking the icon below and we’ll get back to you as soon as we can.",
  bookHeading: "28th January - 1st February 2027 at Ayara Kamala Resort & Spa Phuket",
  priceListLabel: "Price list:",
  accommodationDatesLine:
    "Hotel / accommodation package: 27 January – 2 February 2027. Camp & workshops: 28 January – 1 February 2027.",
  depositLive:
    "DEPOSIT option, pay 500 EUR upon booking and the remaining payment up to 60 days before the start of the retreat.",
  workshopsOnlyBlurb:
    "12 hours of workshops + activities. If you book this option you will have to organise your own accommodation and transfer to and from Ayara Kamala Resort & Spa for workshops.",
  deluxeOceanBlurb:
    "12 hours of workshops + 6 nights accommodation at Ayara Kamala Resort & Spa. Booking options include shared or solo, rooms with twin beds are available.",
  deluxePoolBlurb: "63 sqm room with pool access. Booking options include shared or solo.",
  grandPrivateBlurb: "80 sqm room with private pool.",
  grandNaturalTitle: "Grand Thai Natural Ocean View & Spa Bath (80 sq.m.)",
} as const;

export const LIVE_PACKAGE_ORDER = [
  "deluxe-ocean-view",
  "deluxe-pool-access",
  "grand-thai-private-pool",
  "workshops-only",
  "grand-thai-natural",
] as const;

export const LIVE_PACKAGE_BLURB: Record<string, string> = {
  "deluxe-ocean-view": LIVE.deluxeOceanBlurb,
  "deluxe-pool-access": LIVE.deluxePoolBlurb,
  "grand-thai-private-pool": LIVE.grandPrivateBlurb,
  "workshops-only": LIVE.workshopsOnlyBlurb,
  "grand-thai-natural": LIVE.grandNaturalTitle,
};
