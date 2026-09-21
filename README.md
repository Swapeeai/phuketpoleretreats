# Phuket Pole Retreats

Next.js rebuild of [phuketpoleretreats.com](https://www.phuketpoleretreats.com/) with Stripe pay-in-full or €500 deposit plus automatic monthly installments, and page-level SEO.

The live site is **Squarespace**. This repo cannot log into that CMS, so the bookable slice lives here — same 2027 retreat, instructors, EUR prices, and Ayara Kamala copy.

## Run locally

```bash
npm install
cp .env.example .env.local   # optional — skip Stripe keys to use mock checkout
npm run dev
```

Open [http://127.0.0.1:43211](http://127.0.0.1:43211).

## Stripe keys

Paste these into `.env.local` from the Stripe Dashboard (test mode first):

| Variable | What it is |
| --- | --- |
| `STRIPE_SECRET_KEY` | `sk_test_...` or `sk_live_...` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `pk_test_...` or `pk_live_...` (Checkout redirect does not need it, but keep it for the account) |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` for `/api/webhooks/stripe` |
| `NEXT_PUBLIC_SITE_URL` | Public origin, e.g. `https://www.phuketpoleretreats.com` |

If `STRIPE_SECRET_KEY` is missing, checkout opens a **mock Stripe page** so the flow is demoable.

Webhook (when keys exist): `https://YOUR_DOMAIN/api/webhooks/stripe` — events `checkout.session.completed`, `invoice.paid`, `invoice.payment_failed`.

## How installments work

- **Pay in full:** Stripe Checkout `mode: payment` charges the package total today.
- **Installments:** Stripe Checkout `mode: subscription`. First invoice is the **€500 deposit today**. Recurring monthly prices start at the next billing date (`billing_cycle_anchor`). Subscription `cancel_at` is set after the last installment (on or before **28 November 2026**, 60 days before check-in). Stripe bills the saved card; nobody chases monthly payments.

Packages and prices match the live Squarespace shop (EUR).

## SEO

Unique titles and meta descriptions for 2027 (the live Squarespace tags still mention April 2026), one H1 per page, Event/Offer JSON-LD, canonical URLs, Open Graph, `sitemap.xml`, `robots.txt`, and `next/image` for LCP.

## Scripts

- `npm run dev` — development on port **43211**
- `npm run build` / `npm start` — production on the same port
- `npm run lint` — ESLint
