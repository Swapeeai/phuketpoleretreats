# Phuket Pole Retreats

Next.js rebuild of [phuketpoleretreats.com](https://www.phuketpoleretreats.com/). Customer-facing wording, colours, instructors, packages, and the first-page hero video are taken from the live Squarespace site. Booking adds Stripe **pay in full** or **€500 deposit today and monthly payments after**.

The live site is **Squarespace**. This repo cannot log into that CMS, so the bookable slice lives here.

## Run locally

```bash
npm install
cp .env.example .env.local   # optional — skip Stripe keys to use mock checkout
npm run build && npm start
```

Open [http://127.0.0.1:43211](http://127.0.0.1:43211).

`npm run dev` also works on the same port; production `npm start` is more reliable for the booking form.

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

Unique titles and meta descriptions for 2027 (the live Squarespace tags still mention April 2026), one H1 per page, Event/Offer JSON-LD, canonical URLs, Open Graph, `sitemap.xml`, `robots.txt`. Homepage copy is Tara’s live wording.

## Scripts

- `npm run dev` — development on port **43211**
- `npm run build` / `npm start` — production on the same port
- `npm run lint` — ESLint
