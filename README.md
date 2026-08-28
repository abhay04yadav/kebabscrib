# Kebab’s Crib

Marketing site and ordering front end for Kebab’s Crib, Dubai Marina — built from the
Claude Design canvas (`Kebabs Crib Home` / `Menu` / `Cart` / `Chat` / `Configurator`).

Next.js 16 (App Router) · React 19 · TypeScript · no CSS framework — the design tokens
from the canvas live in [`app/globals.css`](app/globals.css).

## Running locally

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm start          # serve the production build
```

## What’s implemented

**Home (`/`)** — sticky nav that shrinks on scroll and shows live open/closed status,
hero carousel (auto-rotating, arrows, dots, swipe), two videos that autoplay muted while
on screen and unmute on tap, Our Story, the gallery marquee with a lightbox, the review
marquee, the map/hours/contact block, and the footer.

**Menu (`/menu`)** — category chips, search, price/popularity sort, live result counts,
grouped grid, and an empty state. `/menu?dish=<name>` opens that dish’s configurator
directly, which is how the hero “Order now” buttons deep-link.

**Item configurator** — size / meat / sauces / extras / salad per the canvas spec, with
required-group gating, the “first two sauces free” pricing rule, a 200-character kitchen
note, and quantity. Dishes with required modifiers (French Taco, Baguettes) open it
instead of adding blind; the rest add straight from the card.

**Cart** — one store shared by the menu, the configurator, the chatbot and both pages
([`lib/cart.tsx`](lib/cart.tsx)), persisted to `localStorage` so it survives navigation
and reloads. Identical lines merge. Checkout hands off to the delivery partners, matching
the canvas.

**Crib Bot** — the scripted flow from the canvas, wired to the real cart: chips carry
declared side effects (`size:`, `meat:`, `sauce:`, `commit:taco`, `add:fries`, …) so
building a taco in chat puts the correctly priced line in the cart. Typed messages are
routed by keyword to the same nodes, with a fallback that offers the four things it can
actually do. Its cart and checkout cards read live cart state, not fixtures.

## Deploying to Vercel

No configuration needed — Vercel detects Next.js and uses `npm run build`.

```bash
npx vercel        # preview
npx vercel --prod # production
```

Or import the repo at vercel.com/new. There are no environment variables and no backend;
images and video stream from Cloudinary, and the display font ships in `public/fonts/`.

## Data

Menu items, prices, modifier groups and delivery partners: [`lib/menu.ts`](lib/menu.ts).
Slides, gallery, reviews, videos and contact details: [`lib/content.ts`](lib/content.ts).
Opening hours: [`lib/hours.ts`](lib/hours.ts). Chatbot script: [`lib/bot.ts`](lib/bot.ts).
