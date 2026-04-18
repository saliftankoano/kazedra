# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run start     # Start production server
npm run lint      # Run ESLint
```

There are no test commands configured in this project.

## Architecture

This is a Next.js 15 (App Router) landing page for Kazedra Technologies, a software company based in Burkina Faso. The primary product featured is **Roogo**, a clothing generation tool.

### Page Structure

The main landing page (`src/app/page.tsx`) is a client component that composes section components with smooth-scroll navigation via React refs:

```
Header → Hero → LogoTicker → Why → Pricing → Testimonials → Waitlist → Footer
```

Each section lives in `src/sections/`. The page passes refs to `Header` so nav links can scroll to the corresponding section.

### API Routes

- `src/app/api/checkout_sessions/route.js` — Stripe subscription checkout session creation
- `src/app/api/webhooks.js` — Stripe webhook handler
- `src/app/api/generate/route.ts` — ComfyUI/RunPod clothing generation (currently commented out/disabled)
- `src/app/api/bookings/route.ts` — Deprecated (returns 410 Gone). Superseded by `/api/payments/initiate`.
- `src/app/api/bookings/availability/route.ts` — Read-only slot availability for the `/visites-3d` calendar
- `src/app/api/payments/initiate/route.ts` — Creates a `pending_payment` booking and opens a PawaPay deposit (Mobile Money)
- `src/app/api/payments/status/route.ts` — Client poll endpoint; DB-first, falls back to PawaPay `/v2/deposits/{id}`
- `src/app/api/pawapay/callback/route.ts` — PawaPay webhook (IP-whitelisted in prod); flips booking to `confirmed` on `COMPLETED` and fires SMS

### 3D virtual tours (`/visites-3d`)

Marketing + booking page for the on-site 3D scan service. Sections live in `src/sections/Visites*.tsx`, booking UI in `src/components/booking/` (incl. `PaymentModal.tsx` for the Mobile Money flow), shared helpers in `src/lib/time-slots.ts`, `src/lib/booking-schema.ts`, `src/lib/supabase.ts`, `src/lib/africastalking.ts`, `src/lib/pawapay.ts`. Supabase schema is at `supabase/migrations/0001_bookings.sql` + `0002_payments.sql` (PawaPay columns, status extension, view update). Paiement obligatoire Mobile Money à la réservation via PawaPay (Orange + Moov), hold 8 min. See `docs/external-services.md` for pricing, SMS costs, PawaPay details, Supabase schema, and env vars.

### Styling

- Tailwind CSS with a custom design system via CSS variables in `src/app/globals.css`
- Custom breakpoints: `sm` (375px), `md` (768px), `lg` (1200px)
- shadcn/ui components in `src/components/ui/` with Radix UI primitives underneath
- `cn()` utility in `src/lib/utils.ts` merges Tailwind classes (clsx + tailwind-merge)

### SVG Imports

The webpack config supports two SVG import modes:
- `import icon from './icon.svg?url'` — returns URL string
- `import Icon from './icon.svg'` — returns React component (via @svgr/webpack)

### Environment Variables

Required in `.env.local` (not committed):
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `RUNPOD_API_KEY` (for the disabled clothing generation feature)
- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` / `SUPABASE_SERVICE_ROLE_KEY` (3D tour bookings)
- `AT_USERNAME` / `AT_API_KEY` / `AT_SENDER_ID` (optional) (Africa's Talking SMS)
- `TEAM_PHONE` (in `+226XXXXXXXX` format — where team SMS notifications go)
- `PAWAPAY_LOCAL_MODE` (`sandbox` | `live`) / `PAWAPAY_SANDBOX_URL` / `PAWAPAY_SANDBOX_API_TOKEN` / `PAWAPAY_LIVE_URL` / `PAWAPAY_LIVE_API_TOKEN` (Mobile Money deposits for 3D tour bookings; prod forces live)

### Path Alias

`@/*` maps to `src/*` — use this for all internal imports.
