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

This is the Next.js 15 (App Router) marketing site for **Kazedra Technologies**, a Burkinabè software company. The home page (`src/app/page.tsx`) is the company landing page. The site is dedicated to Kazedra's **software development / consulting** positioning; all real-estate-adjacent branding (including the 3D virtual tour service) lives under the Roogo brand.

Kazedra's main consumer product is **Roogo**, a rental marketplace for residential and commercial properties in Burkina Faso (Android Feb 2026, iOS Apr 2026). Roogo's code lives in separate repos — not this one. The former **3D virtual tour service** (`/visites-3d`) migrated to the Roogo site in July 2026; this site now 308-redirects `/visites-3d` to `https://www.roogobf.com/visites-3d` (see `next.config.mjs`).

The home page's section structure (`Hero → LogoTicker → Why → Pricing → Testimonials → Waitlist → Footer`) was originally built as the waitlist for an AI clothing-generation product, since pivoted. The disabled RunPod/ComfyUI route at `src/app/api/generate/route.ts` and the `RUNPOD_API_KEY` env var are leftovers from that era.

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

(Supabase, Africa's Talking, and PawaPay vars were removed when the 3D visits service migrated to roogo-web — delete them from the hosting env too.)

### Path Alias

`@/*` maps to `src/*` — use this for all internal imports.
