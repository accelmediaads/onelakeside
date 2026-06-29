# One Lakeside — Landing Site

Marketing landing site for **One Lakeside**, the lakefront condo tower in
downtown Coeur d'Alene, Idaho. Presented by Greg Rowley / **Luxury Homes North
Idaho**. Built as a paid-campaign destination (Meta retargeting + resort
geofencing) for the 5 available residences.

Standalone Next.js app — the landing page is the site root (`/`).

## Stack

- **Next.js 16** (App Router, TypeScript) + **Tailwind v4**
- **GSAP** scroll reveals, **Lenis** smooth scroll
- **react-hook-form** for the inquiry form
- **Follow Up Boss** CRM (server-side via `/api/lead`) + **Web3Forms** email
- **Meta Pixel + GA4** for retargeting and conversion tracking
- Deployed on **Netlify** (`@netlify/plugin-nextjs`)

## Local dev

```bash
npm install
cp .env.example .env.local   # add FUB_API_KEY
npm run dev                  # http://localhost:3000
```

## The 5 residences

| Unit | Beds | Price | Notes |
|------|------|-------|-------|
| 401 | 2 BR | Pricing on request | Largest corner home, lake + resort views |
| 402 | 2 BR | Pricing on request | Corner home, lake + downtown + marina |
| 403 | 1 BR | $649,000 | West-facing, lake-view deck (881 sqft) |
| 408 | 1 BR | $629,000 | Oversized private terrace (779 sqft) |
| 410 | 1 BR | $599,000 | ADA-accessible, big terrace (789 sqft) |

Residence data lives in `app/page.tsx` (`residences`). 401/402 price + bed count
are unconfirmed — verify with the team before final publish.

## Media

- Listing photos + floor plans: `public/one-lakeside/` (SEO-named, compressed)
- Matterport 3D tours: model IDs in `app/page.tsx` (`MATTERPORT_IDS`); loaded
  lazily on click via `components/lhni/ResidenceMedia.tsx` so they add **zero**
  page-load weight
- YouTube walkthrough embedded (`ew3hPTWoqRM`)

## Tracking (retargeting)

- **Meta Pixel** `2135934930019101` — `PageView` on every view (builds the
  retargeting audience) + `Lead` on form submit
- **GA4** `G-YZGS3X48K6` — sitewide + `lhni_lakeside_lead` conversion event
- Both are gated by `lib/analyticsEnabled.ts`, which fires on any real host but
  **not** on `localhost` or `*.netlify.app` previews. No host allowlist needed.

## Lead pipeline

Form submit (`OneLakesideForm`) fires two requests in parallel:
1. **Web3Forms** email notification to the LHNI team (CCs Aaron)
2. **`/api/lead`** → Follow Up Boss, tagged `One Lakeside`, source
   `LHNI One Lakeside LP`

On success it fires the Meta + GA4 conversion events, then routes to
`/thank-you?type=lakeside`.

## Deploy

Connected to Netlify from `main`. Set `FUB_API_KEY` in Netlify env vars.
Production domain: `onelakeside.luxuryhomesnorthidaho.com` (update
`metadataBase` in `app/layout.tsx` if this changes).
