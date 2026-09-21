# Phuket Pole Retreats

Next.js rebuild of [phuketpoleretreats.com](https://www.phuketpoleretreats.com/). Customer-facing wording, instructors, packages, and the first-page hero video are taken from the live Squarespace site. The visual theme is a **tropical escape** palette (jungle green, sand, cream) — the orange logo stays, UI accents do not. Booking adds Stripe **pay in full** or **€500 deposit today and monthly payments after**.

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
| Jungle / primary | `#0f5e52` | Buttons, links, selected states, chat bubble, focus rings |
| Deep jungle | `#0c2f29` | Footer, overlays, demo banner |
| Ocean | `#2a8f8c` | Soft complementary accent |
| Sunset | `#d4896a` | Small highlight only |
| Sand | `#f4efe6` | Page background |
| Cream card | `#fffcf7` | Cards / forms |
| Ink | `#1a2a24` | Body text |

Logo may remain orange; it is not used as the UI accent.

## Imagery

Self-hosted in `public/images/` (see [IMAGE_CREDITS.md](./IMAGE_CREDITS.md)):

- Phuket / tropical scenery from Unsplash (Unsplash License)
- Real Ayara Kamala studio, aerial, pool, and room photos from the live retreat site

Instagram: [@phuketpoleretreats](https://www.instagram.com/phuketpoleretreats) in the header, footer, and a gallery of official venue stills that link to the profile.

## Stripe keys

Paste these into `.env.local` from the Stripe Dashboard (test mode first):

| Variable | What it is |
| --- | --- |
| `STRIPE_SECRET_KEY` | `sk_test_...` or `sk_live_...` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `pk_test_...` or `pk_live_...` |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` for `/api/webhooks/stripe` |
| `NEXT_PUBLIC_SITE_URL` | Public origin, e.g. `https://www.phuketpoleretreats.com` |

If `STRIPE_SECRET_KEY` is missing, checkout opens a **mock Stripe page** so the flow is demoable.

Webhook (when keys exist): `https://YOUR_DOMAIN/api/webhooks/stripe` — events `checkout.session.completed`, `invoice.paid`, `invoice.payment_failed`.

## How payments work

- **Pay in full:** Stripe Checkout `mode: payment` charges the package total today.
- **€500 deposit today:** Stripe Checkout `mode: subscription`. First invoice is the **€500 deposit**. Remaining balance is billed monthly (`billing_cycle_anchor`) and the subscription `cancel_at` is set after the last payment (on or before **28 November 2026**, 60 days before check-in).

Packages, prices, instructors, dates, and policies match the live site (EUR).

## SEO

Unique titles and meta descriptions for 2027, one H1 per page, semantic headings, Open Graph + Twitter cards, canonical URLs, JSON-LD (Organization, WebSite, Event/Offer, BreadcrumbList, FAQPage), `sitemap.xml`, `robots.txt`, and descriptive image alts. Keywords (pole retreat, pole camp, pole training week, intermediate / advanced / pro) sit in titles, descriptions, and alts — visible body copy stays Tara’s.

## Contact & chat

There is no public email address. The **Contact us** form (`/contact`) and the jungle-green **How can I help you?** bubble both open WhatsApp with a prefilled message:

- Number: **+66 92 832 0802** (`wa.me/66928320802`)
- Phones: `https://wa.me/66928320802?text=...`
- Desktop: `https://web.whatsapp.com/send?phone=66928320802&text=...`

## Scripts

- `npm run dev` — development on port **43211**
- `npm run build` / `npm start` — production on the same port
- `npm run lint` — ESLint
