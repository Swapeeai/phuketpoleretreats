# Phuket Pole Retreats

Next.js rebuild of [phuketpoleretreats.com](https://www.phuketpoleretreats.com/). Customer-facing wording, instructors, packages, and the first-page hero video are taken from the live Squarespace site. The visual theme is a **bright tropical day** palette (lagoon green, sky blue, sand, cream) — the orange logo stays, UI accents do not. Booking adds Stripe **pay in full** or **€500 deposit today and monthly payments after**.

The live site is **Squarespace**. This repo cannot log into that CMS, so the bookable slice lives here.

## Run locally

```bash
npm install
cp .env.example .env.local   # optional — skip Stripe keys to use mock checkout
npm run build && npm start
```

Open [http://127.0.0.1:43211](http://127.0.0.1:43211).

`npm run dev` also works on the same port; production `npm start` is more reliable for the booking form.

## Palette

| Token | Hex | Use |
| --- | --- | --- |
| Lagoon / primary | `#1b7f78` | Buttons, links, selected states, chat bubble, focus rings |
| Ocean | `#2f9aa8` | Complementary sea blue |
| Sky | `#eaf5f8` | Footer, Instagram, airy section backgrounds |
| Aqua | `#e3f4f0` | Soft wash, marquee |
| Sand | `#faf6ee` | Alternate section background |
| Cream page | `#faf8f3` | Page background |
| White card | `#ffffff` | Cards / forms |
| Ink | `#243832` | Body text |

Logo may remain orange; it is not used as the UI accent.

## Imagery

Self-hosted in `public/images/` (see [IMAGE_CREDITS.md](./IMAGE_CREDITS.md)):

- Phuket / tropical scenery from Unsplash (Unsplash License), including Thai longtail-boat scenes behind the class levels and boat-trip sections
- Real Ayara Kamala studio, aerial, pool, and room photos from the live retreat site

Instagram: [@phuketpoleretreats](https://www.instagram.com/phuketpoleretreats) in the header, footer, and a gallery of official venue stills that link to the profile.

The **Workshop Timetable** lives at `/timetable` (and still on the homepage). It shows the official colourful timetable graphic (full-width, tap to open full size), with a tropical photo band at the top of the page, workshop dates 28 January–1 February 2027 and hotel package 27 January–2 February 2027. Saturday 30 January has its own boat-trip section.

## Stripe keys

Paste these into `.env.local` from the Stripe Dashboard (test mode first):

| Variable | What it is |
| --- | --- |
| `STRIPE_SECRET_KEY` | `sk_test_...` or `sk_live_...` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `pk_test_...` or `pk_live_...` |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` for `/api/webhooks/stripe` |
| `NEXT_PUBLIC_SITE_URL` | Public origin, e.g. `https://www.phuketpoleretreats.com` |
| `RESEND_API_KEY` | Resend API key. Server only. Confirmation mail after a paid checkout. |
| `BOOKING_FROM` | Optional From header. Defaults to `Phuket Pole Retreats <bookings@phuketpoleretreats.com>`. |
| `BOOKING_REPLY_TO` | Optional Reply-To on both booking emails. Server only. If unset, the server uses its built-in reply-to. Not rendered on the site. |
| `BOOKING_NOTIFY_EMAILS` | Comma-separated organizer inboxes. Server only. Not rendered on the site. |

A paid `checkout.session.completed` emails the guest and, when `BOOKING_NOTIFY_EMAILS` is set, the organizers. Unpaid sessions and the checkout-creation request do not send mail. No WhatsApp message is sent.

If `STRIPE_SECRET_KEY` is missing, checkout opens a **mock Stripe page** so the flow is demoable.

Webhook (when keys exist): `https://YOUR_DOMAIN/api/webhooks/stripe` — events `checkout.session.completed`, `invoice.paid`, `invoice.payment_failed`.

## How payments work

- **Pay in full:** Stripe Checkout `mode: payment` charges the package total today.
- **€500 deposit today:** Stripe Checkout `mode: subscription`. First invoice is the **deposit** (plus any cent adjustment). Then at most **3** automatic charges, on the same day of each following month. The January 2027 limit can cut that to 2 or 1. If no charge date is left, pay in full. Nothing is billed in February 2027 or later. `cancel_at` is set after the last of those charges.

Packages, prices, instructors, dates, and policies match the live site (EUR).

## SEO

Unique titles and meta descriptions for the Phuket pole retreat, Ayara Kamala pole camp, and the 2027 intermediate / advanced / pro training week. One H1 per page. Canonical and `og:url` use `https://www.phuketpoleretreats.com` (a `vercel.app` host is never used, and non-www / preview hosts stay `noindex` via middleware). Open Graph image is the self-hosted 1200×630 file at `/images/og/phuket-pole-retreat.jpg`. JSON-LD covers Organization, WebSite, Event, Offer, FAQPage, and BreadcrumbList. `sitemap.xml` and `robots.txt` list the public pages. Visible retreat copy stays Tara’s.

`NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` adds the Search Console meta tag only when it is set.

## Cookies, Meta, and Google ads

A cookie banner (Accept / Reject) stores the choice in `localStorage` under `ppr-cookie-consent`. Reject loads no marketing scripts. The Meta Pixel is not in the initial HTML and `fbevents.js` loads only after Accept. Google tags load after Accept only when `NEXT_PUBLIC_GA_MEASUREMENT_ID` and/or `NEXT_PUBLIC_GOOGLE_ADS_ID` is set — a missing Google ID does not emit an empty script tag. No Google Ads ID is configured (the old account is closed).

| Variable | Where the owner copies it |
| --- | --- |
| `NEXT_PUBLIC_META_PIXEL_ID` | Optional override. Default is the public Pixel `1078532138132230` (Events Manager → Data sources → pixel → Settings → Pixel ID). Still loads only after Accept. |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Google Analytics → Admin → Data streams → web stream → Measurement ID (`G-…`) |
| `NEXT_PUBLIC_GOOGLE_ADS_ID` | Google Ads → Goals → Conversions → Google tag, or Tools → Data manager → Google tag → Tag ID (`AW-…`) |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | Search Console → Settings → Ownership verification → HTML tag → `content` value only |

Set them in Vercel → Project → Settings → Environment Variables and redeploy. They are inlined at build time. Do not commit real IDs.

After Accept, the Meta Pixel sends PageView on each navigation, ViewContent on `/book` and package pages, InitiateCheckout when a valid booking is submitted, and Purchase on `/checkout/success` when `session_id` is present (EUR when `total` is present). Google Consent Mode v2 defaults `ad_storage`, `analytics_storage`, `ad_user_data`, and `ad_personalization` to denied until Accept, then gtag sends `page_view`, `view_item` on a package, `begin_checkout`, and `purchase`. The `AW-` tag is what builds Google Ads remarketing audiences. To count purchases as Ads conversions, import the GA4 `purchase` event into Google Ads (there is no separate conversion-label variable).

## Contact & chat

There is no public email address. The **Contact us** form (`/contact`) and the lagoon-green **How can I help you?** bubble both open WhatsApp with a prefilled message. The form asks for name, email, WhatsApp number, a free-text subject, and a message — all bundled into the WhatsApp text.

- Number: **+66 92 832 0802** (`wa.me/66928320802`)
- Phones: `https://wa.me/66928320802?text=...`
- Desktop: `https://web.whatsapp.com/send?phone=66928320802&text=...`

The customer UI does not name the organisers. Instructor **Jenny Liebert** is still listed with the teaching team.

## Scripts

- `npm run dev` — development on port **43211**
- `npm run build` / `npm start` — production on the same port
- `npm run lint` — ESLint
