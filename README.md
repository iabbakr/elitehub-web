# EliteHub NG — Web Application

> Nigeria's trusted marketplace web frontend, built with **Next.js 15 App Router**.
> Mirrors the mobile app (React Native / Expo) but optimised for SEO, web browsing, and acquisition.

---

## Architecture Overview

```
Mobile App (React Native)     Web App (Next.js)
━━━━━━━━━━━━━━━━━━━━━━━━━     ━━━━━━━━━━━━━━━━━━━━━━━━━
Full buying experience    ←→   Browse-only + App Gates
Cart / Checkout               → Redirects to App Store
Orders / Wallet               → Redirects to App Store
Escrow / Disputes             → Redirects to App Store
Seller Dashboard              → Redirects to App Store
Push Notifications            → Email / Web (future)
```

**Key principle:** The web app is a **product discovery engine**. Every product is fully indexed by Google. Any action that requires money or accounts (cart, checkout, orders, wallet, seller tools) shows an `AppGateModal` that drives the user to download the mobile app.

---

## Tech Stack

| Layer         | Technology                        |
|---------------|-----------------------------------|
| Framework     | Next.js 15 (App Router)           |
| Language      | TypeScript 5                      |
| Styling       | Tailwind CSS 3 + CSS Variables    |
| Fonts         | Playfair Display + DM Sans        |
| Images        | next/image + Cloudinary transforms|
| Data          | Same backend API as mobile app    |
| SEO           | JSON-LD, Open Graph, Sitemap, ISR |
| Hosting       | Vercel (recommended)              |

---

## Project Structure

```
elitehub-web/
│
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout, global SEO metadata
│   ├── globals.css               # Brand design tokens, Tailwind utilities
│   ├── page.tsx                  # Homepage (hero + categories + products)
│   ├── loading.tsx               # Global loading state
│   ├── not-found.tsx             # 404 page
│   ├── sitemap.ts                # Dynamic XML sitemap (includes all products)
│   ├── robots.ts                 # robots.txt (blocks auth/checkout pages)
│   │
│   ├── products/
│   │   ├── page.tsx              # Product listing with filters + ISR
│   │   └── [productId]/
│   │       ├── page.tsx          # Product detail (SSG + ISR)
│   │       └── loading.tsx       # Skeleton while loading
│   │
│   ├── services/
│   │   └── page.tsx              # Service providers landing page
│   │
│   └── api/
│       └── products/route.ts     # Edge proxy with 60s cache
│
├── components/
│   ├── layout/
│   │   ├── Header.tsx            # Sticky nav, search, category bar, mobile menu
│   │   ├── Footer.tsx            # App download CTA + links
│   │   └── AppBanner.tsx         # Dismissible iOS/Android install banner
│   │
│   ├── products/
│   │   ├── ProductCard.tsx       # Product card (image, price, gate cart/wishlist)
│   │   ├── ProductGrid.tsx       # Responsive CSS grid container
│   │   ├── ProductFilters.tsx    # Desktop sidebar + mobile bottom sheet
│   │   ├── ProductSearch.tsx     # Debounced search input
│   │   ├── LoadMoreButton.tsx    # Pagination with useTransition
│   │   ├── ProductImageGallery.tsx # Thumbnail strip + lightbox
│   │   ├── ProductActions.tsx    # Quantity + Add to Cart + Buy Now (all gated)
│   │   └── RelatedProducts.tsx   # Related items below product detail
│   │
│   ├── services/
│   │   └── ServiceCategoryGrid.tsx # Service categories (all gated → app)
│   │
│   ├── seo/
│   │   └── JsonLd.tsx            # Organization, Product, Breadcrumb, WebSite schema
│   │
│   └── ui/
│       ├── AppGateModal.tsx      # ★ THE GATE — drives all conversions to app
│       └── Skeleton.tsx          # Shimmer loading skeletons
│
├── lib/
│   ├── firebase.ts               # Singleton Firebase client init
│   ├── products.ts               # fetchProducts, fetchProduct, Cloudinary helpers
│   └── utils.ts                  # cn(), GATED_FEATURES config, store URLs
│
├── types/
│   └── index.ts                  # Shared TypeScript types (mirrors mobile app)
│
├── public/
│   └── manifest.json             # PWA manifest
│
├── .env.local.example            # All required environment variables
├── next.config.ts                # Image domains, ISR, security headers
├── tailwind.config.ts            # Brand colours + design tokens
├── tsconfig.json                 # TypeScript config with @/* alias
└── postcss.config.js             # Tailwind + autoprefixer
```

---

## Quick Start

### 1. Prerequisites

- Node.js 20+
- npm 10+
- Firebase project (same one as your mobile app)
- Your backend API running

### 2. Install

```bash
# Clone / extract the project
cd elitehub-web

# Install dependencies
npm install
```

### 3. Environment Variables

```bash
cp .env.local.example .env.local
```

Open `.env.local` and fill in your values. All Firebase keys are the same as your mobile app — just rename `EXPO_PUBLIC_` → `NEXT_PUBLIC_`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=elitehub-kqlvr.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=elitehub-kqlvr
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=elitehub-kqlvr.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=730593166111
NEXT_PUBLIC_FIREBASE_APP_ID=1:730593166111:web:...

NEXT_PUBLIC_API_BASE_URL=https://elitehub-backend.onrender.com/api/v1
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dswwtuano
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 5. Build for Production

```bash
npm run build
npm start
```

---

## Deployment

### Vercel (Recommended — zero config)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set env vars in Vercel dashboard or:
vercel env add NEXT_PUBLIC_FIREBASE_API_KEY
# ... repeat for all env vars
```

Vercel automatically:
- Detects Next.js and configures edge functions
- Enables ISR (Incremental Static Regeneration)
- Provides a global CDN
- Renews SSL automatically

### Other Platforms

**Netlify:**
```bash
npm run build
# Publish: .next directory
# Build command: npm run build
# Publish directory: .next
```

**Docker:**
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]
```

Add `output: 'standalone'` to `next.config.ts` for Docker.

---

## How the App Gate Works

Every action that requires authentication or money shows `AppGateModal`:

```
User clicks "Add to Cart"
        ↓
AppGateModal opens
        ↓
Shows: title, description, feature checklist
Shows: "Download on App Store" button
Shows: "Get it on Google Play" button
        ↓
User downloads app → completes purchase there
```

**Gated features and their messages:**

| Feature           | Trigger                    | Message                                    |
|-------------------|----------------------------|--------------------------------------------|
| `cart`            | Add to Cart button         | "Add to Cart — Get the App"                |
| `checkout`        | Buy Now button             | "Checkout on Mobile"                       |
| `orders`          | Orders nav link            | "Track Your Orders"                        |
| `wallet`          | Wallet nav link            | "EliteHub Wallet"                          |
| `wishlist`        | Heart/Save button          | "Save to Wishlist"                         |
| `auth`            | Sign In link               | "Sign In Required"                         |
| `dispute`         | Dispute link               | "Open a Dispute"                           |
| `seller_dashboard`| Sell nav link              | "Sell on EliteHub"                         |

To add a new gated feature, update `GATED_FEATURES` in `lib/utils.ts`.

---

## SEO Strategy

### What's indexed by Google

- ✅ Homepage
- ✅ All product pages (`/products/[id]`)
- ✅ Product listing pages (`/products?category=...`)
- ✅ Category pages
- ✅ Services page

### What's blocked from crawlers

- ❌ `/api/*` (internal routes)
- ❌ `/checkout` (no web checkout exists)
- ❌ `/orders` (requires auth)
- ❌ `/wallet` (requires auth)
- ❌ `/admin` (admin tools)

### JSON-LD Structured Data

Every product page includes:
```json
{
  "@type": "Product",
  "name": "...",
  "offers": { "priceCurrency": "NGN", "price": 50000 },
  "image": "https://res.cloudinary.com/..."
}
```

This enables **Google Shopping rich results** — products appear with price, availability, and image directly in search results.

### Sitemap

`/sitemap.xml` is auto-generated at build time and includes:
- Static pages
- All category filter pages  
- All active product pages (up to 500 per build)

It regenerates on every deployment and via ISR.

### Performance targets

| Metric            | Target  |
|-------------------|---------|
| LCP               | < 2.5s  |
| FID/INP           | < 100ms |
| CLS               | < 0.1   |
| Lighthouse score  | 90+     |

Achieved via:
- `next/image` with Cloudinary transforms (WebP/AVIF auto)
- ISR (pages pre-built, served from CDN)
- Font preconnect + display:swap
- Code splitting per route

---

## Caching Strategy

| Layer          | Cache Duration | Method                          |
|----------------|---------------|----------------------------------|
| Product list   | 60 seconds     | ISR `revalidate: 60`            |
| Product detail | 5 minutes      | ISR `revalidate: 300`           |
| Bank list      | 7 days         | AsyncStorage (mobile)           |
| Sitemap        | Per build      | Static generation               |
| Images         | 1 year         | Cloudinary CDN + next/image     |
| API proxy      | 60 seconds     | `Cache-Control: s-maxage=60`    |

---

## Customisation Guide

### Update App Store URLs

In `lib/utils.ts`:
```ts
export const APP_STORE_URL = "https://apps.apple.com/app/YOUR_APP_ID";
export const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=YOUR_PACKAGE";
```

### Add a New Category to the Homepage

In `app/page.tsx`, add to the `CATEGORIES` array:
```ts
{ label: "My Category", icon: "🆕", href: "/products?category=My_Category", bg: "from-blue-50 to-blue-100", accent: "text-blue-600" },
```

### Change the Brand Colours

In `app/globals.css`:
```css
:root {
  --navy: #0B2E33;        /* Change primary colour */
  --gold: #C9A84C;        /* Change accent colour */
}
```

Also update `tailwind.config.ts` to match.

### Adjust ISR Revalidation Time

In `lib/products.ts`:
```ts
const res = await fetch(url, {
  next: { revalidate: 120 }, // Change to 2 minutes
});
```

### Add Google Analytics

In `app/layout.tsx`, add inside `<head>`:
```tsx
<Script src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXX" strategy="afterInteractive" />
<Script id="ga" strategy="afterInteractive">{`
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXX');
`}</Script>
```

---

## Adding Pages

### Simple static page (e.g. About Us)

Create `app/about/page.tsx`:
```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | EliteHub NG",
  description: "...",
};

export default function AboutPage() {
  return (
    <div className="section py-20">
      <h1 className="font-display text-4xl font-bold text-navy-DEFAULT">About Us</h1>
      {/* content */}
    </div>
  );
}
```

### Dynamic page with data (e.g. Seller Profile)

Create `app/seller/[sellerId]/page.tsx` — follow the pattern in `app/products/[productId]/page.tsx`.

---

## Backend API Reference

The web app calls the same backend as the mobile app. Key endpoints used:

| Endpoint                    | Used In               | Cache    |
|-----------------------------|-----------------------|----------|
| `GET /products`             | Product listing, homepage | 60s  |
| `GET /products/:id`         | Product detail page   | 300s     |
| `GET /system/config`        | Category config       | Build    |

All other endpoints (orders, wallet, auth, disputes) are **not called from the web** — they only run from the mobile app.

---

## Troubleshooting

### "Products not loading"

1. Check your `NEXT_PUBLIC_API_BASE_URL` in `.env.local`
2. Ensure your backend is running and accessible
3. Check browser console for CORS errors
4. Try `curl https://elitehub-backend.onrender.com/api/v1/products` directly

### "Images not showing"

1. Confirm `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` is set correctly
2. Check `next.config.ts` has `res.cloudinary.com` in `remotePatterns`
3. Cloudinary URLs must start with `https://res.cloudinary.com/`

### "Build fails with TypeScript errors"

```bash
# Check types without building
npx tsc --noEmit
```

Common fix: ensure all `async` server components `await` their `params`:
```tsx
// ✅ Correct (Next.js 15)
const { productId } = await params;
```

### "Sitemap is empty"

The sitemap fetches products at build time. If your backend is down during build, it falls back to static pages only. This is normal — redeploy once the backend is healthy.

---

## Security Notes

- **No secret keys** are ever sent to the browser. All `NEXT_PUBLIC_*` vars are public by design.
- Firebase Admin SDK credentials (if used for server-side reads) must **never** be prefixed with `NEXT_PUBLIC_`.
- The web app has **no write access** to orders, wallets, or user accounts — all mutations go through the mobile app.
- The `/api/products` proxy strips auth headers before forwarding.

---

## Roadmap / Future Features

- [ ] **Google Shopping feed** (`/shopping-feed.xml`)
- [ ] **Web Push Notifications** (price drop alerts)
- [ ] **Seller public profiles** (`/seller/[sellerId]`)
- [ ] **Search autocomplete** (Algolia or Typesense)
- [ ] **Dark mode** support
- [ ] **i18n** (Yoruba, Hausa, Igbo)
- [ ] **Web Analytics** (Plausible / PostHog)
- [ ] **Social login preview** (view-only, full auth still on app)

---

## Contributing

1. Create a feature branch: `git checkout -b feat/my-feature`
2. Make your changes
3. Run `npm run lint` and fix any issues
4. Run `npm run build` to verify production build
5. Open a pull request

---

## License

© EliteHub NG. All rights reserved.
