# Fashion Template System

A reusable, animation-led fashion eCommerce **landing page**. One codebase can re-skin into different client stores by changing configuration only.

```
ONE CODEBASE + CONFIGURABLE THEMES + CONFIGURABLE ANIMATIONS + REUSABLE SECTIONS = MANY CLIENT STORES
```

Stack: Next.js 16 (App Router, Cache Components), React 19, TypeScript (strict), Tailwind CSS v4, Motion, GSAP + ScrollTrigger + SplitText, Lenis, Three.js / React Three Fiber, Zustand, Zod, Lucide.

## Quick start

```bash
npm install
npm run dev                                # http://localhost:3000
npm run build && npm start                 # production

NEXT_PUBLIC_PREVIEW_PANEL=false npm run build   # ship without the demo panel
```

Active client: `maison-studio` (Maison Ã‰lan, international, USD). Add more clients under `src/clients/` (see **Adding a client**).

## Design principles

These rules keep every client site from looking template- or AI-generated:

- **One working typeface** carries headings, UI and body text. The display face is reserved for the wordmark and hero-scale titles.
- **A fixed type scale** (`t-hero`, `t-h1`, `t-h2`, `t-lead`, `t-body`, `t-small`, `t-label`). Sections never invent sizes.
- **Neutral surfaces, photography carries the colour.** The accent is used sparingly: focus, sale marks, small highlights.
- **Consistent photography.** Within one client, pick photos with the same light, backdrop and grading.
- **One section header pattern:** title left, quiet link right.
- **Glass only over imagery** (see below), never on flat cards.
- **No grain, no glow, no decorative gradients.**

## Landing page sections

Each section comes from the client's `site.config.ts`, in the order listed there. Every section has an `id` (used as its anchor) and an `enabled` flag.

| Type | What it does | Animation owner |
| --- | --- | --- |
| `intro-hero` | Cinematic first-visit intro (~3.5s, once per session, skippable): intro line reveals, three photos fly in and fan, then open into the final hero. The markup is the final layout, so SEO, no-JS, reduced motion and return visits see it directly. Set `stageColor` to the photo backdrop so the shots blend in. | GSAP timeline + SplitText |
| `campaign-hero` | One full-bleed photo or a two-panel split (Women / Men), headline and two CTAs | GSAP SplitText, Motion |
| `service-highlights` | Trust strip: delivery, exchange, COD, secure payment | Motion stagger |
| `category-grid` | "Shop by category" portrait tiles | Motion stagger |
| `lookbook-hero` | Runway hero. The active look stands centre stage. Upcoming looks queue up behind it, smaller and blurred. Includes a "shop the look" column, swipe and keyboard navigation. | Motion (cards), GSAP SplitText (title) |
| `brand-statement` | Large statement whose words light up as you scroll, plus stats | GSAP ScrollTrigger scrub |
| `clothing-rail` | "The Drop": illustrated garments on a chrome rail. They swing when the cursor brushes past and lift on hover. Includes a size availability panel and a ticker. | GSAP (swing layer), Motion (panel) |
| `shop-the-look` | Outfit carousel with numbered hotspots synced to an item list, plus a bundle discount | Motion |
| `collections-ring` | WebGL ring of collection panels you can drag to turn. Hovering the list rotates the matching panel to the front. | R3F (lazy-loaded) |
| `editorial-story` | Chapters from the atelier. On desktop the section pins and scrolls horizontally, with masked image reveals. | GSAP ScrollTrigger (pin + `containerAnimation`) |
| `fitting-room` | Room backdrop with a giant word, an arched "mirror" and a 3D glass card carousel. "Try on" swaps the model photo. Has size, colour and add-to-bag controls. | Motion |
| `product-grid` | New arrivals in an asymmetric or uniform grid. Cards swap image on hover and offer quick add. | Motion stagger |
| `promo-banner` | Full-bleed parallax campaign | GSAP parallax, SplitText |
| `testimonials` | Three-up review grid with star ratings and the purchased product | Motion stagger |
| `newsletter` | Email capture (see the integration points below) | Motion |

The cart drawer, wishlist, header, mobile menu and footer are shared by every section.

## Project structure

```
src/
  app/                     layout (theme boot, providers), page (section list), globals.css
  config/
    schema/                Zod schemas: theme, animation, site/sections, catalog
    themes/index.ts        4 presets: luxury, minimal, streetwear, organic
    fonts.ts / fonts.meta.ts   next/font registry, exposed as CSS variables
    site.config.ts         active-client entry point (siteConfig, themeConfig, â€¦)
  clients/
    _demo/                 shared demo catalog + Unsplash media helper
    maison-studio/         site.config Â· theme.config Â· animation.config Â· products Â· index
    index.ts               registry, validation, cross-reference checks, lookups
  theme/                   theme â†’ CSS vars, no-flash boot script, preview controller
  animations/              presets, provider, Lenis, GSAP utils, scroll recipes, Motion variants
  components/
    layout/ ui/ cart/ products/ animations/ sections/<one folder per section>
  store/                   Zustand: cart, wishlist, preview (persisted, hydrated after mount)
  preview/                 live customization panel (code-split, removable)
```

## Theme engine

- A theme sets colours, typography, layout tokens and effects. It is validated with Zod (`config/schema/theme.ts`).
- `theme/css-vars.ts` turns a theme into `--t-*` CSS variables. `globals.css` maps those into Tailwind tokens (`bg-background`, `text-accent`, `font-display`, `rounded-card`, â€¦).
- Components never hardcode brand colours. Changing the theme re-skins everything.
- Helper utilities `type-display`, `type-heading`, `type-logo`, the `t-*` type scale, `container-theme`, `section-y` and `glass` read the theme tokens.
- **Presets:**

  | Preset | Fonts | Palette |
  | --- | --- | --- |
  | Atelier (`luxury`) | Bodoni Moda + Hanken Grotesk | Warm white, ink, bronze |
  | Minimal | Albert Sans + Tenor Sans | White, charcoal |
  | Streetwear | Anton + Familjen Grotesk, blackletter logo | Black, red |
  | Organic | Gilda Display + Jost | Cream, olive, clay |
  | Heritage | Marcellus + Hanken Grotesk | Ivory, maroon, antique gold |

- **Bangla support:** every font stack falls back to Anek Bangla (sans) or Tiro Bangla (serif). Bengali text renders in a matching style on any theme, and the Bengali fonts only download when Bangla glyphs appear on the page.
- **No flash of the wrong theme:**
  - The client theme is rendered server-side as a `<style>` tag.
  - A tiny blocking script re-applies preview overrides from localStorage before first paint.
  - The same script sets `data-motion` so CSS knows whether reveal animations will run.
- `effects.imageBlend`:
  - On light themes, `multiply` makes studio backdrops melt into the page, giving the runway a "cut-out" look without cut-out assets.
  - Dark themes use `normal`. For dark brands, shoot or choose photos with dark backdrops.
- `effects.glass` turns on frosted glass for UI that floats over photography: the scrolled header, fitting-room controls, hotspot labels, quick-add bars and hero labels.
  - It is deliberately not used on cards or sections. On flat backgrounds glass reads as a grey box and is a strong "template" signal.
  - When it is off, or when the device asks for reduced transparency, the same `glass` class renders a solid surface.

**Create a client theme:**

```ts
// clients/<client>/theme.config.ts
import { createTheme } from "@/config/schema/theme";
import { luxuryTheme } from "@/config/themes";

export default createTheme(luxuryTheme, {
  id: "acme",
  name: "Acme",
  colors: { accent: "#9C7A3C" },
  typography: { body: "albert" },
  layout: { buttonRadius: "0px" },
});
```

The preview panel's **Copy theme** button exports the current tweaks as JSON, ready to paste into `createTheme`.

**Add a font:**
1. Load it in `config/fonts.ts` with a `variable`.
2. Register it in `config/fonts.meta.ts`.
3. Reference its key in a theme.

## Animation engine

- **Presets** (`animations/animation-presets.ts`):
  - **Luxury:** slow, line reveals, subtle parallax
  - **Minimal:** subtle; the horizontal story becomes a vertical story
  - **Bold:** character reveals, scale, fast
  - **Creative:** word reveals, masks, horizontal storytelling
- **Client config** (`animation.config.ts`) sets `enabled`, `preset`, `durationScale`, per-key `overrides` and `smoothScroll` (Lenis `lerp` and `wheelMultiplier`).
- **Ownership rule:** each element is animated by GSAP *or* Motion, never both. GSAP-driven layers are marked in code comments, for example `.rail-swing` and `.story-media`.
- **Cleanup:** every GSAP effect runs inside `useGSAP`, which reverts tweens, ScrollTriggers and SplitText on unmount or config change. Listeners are removed in cleanups.
- **Lenis** is driven by GSAP's ticker and feeds `ScrollTrigger.update`, so they share one animation frame loop. Lenis pauses while drawers or menus are open.
- **Reduced motion:** `prefers-reduced-motion`, or the global toggle, turns off GSAP reveals, Lenis, the WebGL ring (it falls back to an image mosaic), marquees and auto-advance.
- **Failsafe:** if content is hidden for a reveal and the reveal never runs, a 3s CSS failsafe makes it visible anyway.

## Live preview panel

The **Customize** button (bottom right) lets you:
- switch the theme preset, colours (primary, secondary, accent, background, text) and the display, heading and body fonts
- change the animation preset and duration scale
- turn animations and smooth scrolling on or off
- reset to the defaults, or copy the current theme

Settings persist in localStorage, for preview only.

To hide the panel, set `features.previewPanel: false` in the client config or `NEXT_PUBLIC_PREVIEW_PANEL=false`. To remove it entirely, delete `src/preview`.

## Adding a client

1. Copy `src/clients/maison-studio` to `src/clients/<new-client>` and edit its four config files.
2. Register it in `src/clients/index.ts`.
3. Run with `NEXT_PUBLIC_CLIENT=<new-client>`.
4. Add the client's image host to `images.remotePatterns` in `next.config.ts`.

The build fails loudly if the config doesn't match the schemas, or if a section points at a missing product, look or collection id.

## Integration points (backend not included)

| Feature | Status | Where to connect |
| --- | --- | --- |
| Product data | Demo catalog (`clients/_demo/catalog.ts`) | Replace `products.ts` with a CMS or commerce fetch that returns the same `Catalog` shape |
| Cart | Client-side Zustand store | `store/cart-store.ts`: sync `lines` to Shopify Storefront, Medusa, etc. |
| Checkout | **Not functional.** The button is disabled and labelled. | Add checkout routes and a payment provider |
| Newsletter | Demo mode when no `endpoint` is set: it validates locally and sends nothing | Set `endpoint` on the newsletter section (POST `{ email }`) |
| Search / collection links | Anchor links within the landing page | Point `href`s at real routes once those pages exist |

## Performance notes

- The homepage is prerendered static. Sections are server components; interactivity lives in small client islands.
- Three.js loads only when the collections section nears the viewport. The canvas stops rendering while off screen, and textures are routed through the Next image optimizer.
- All images use `next/image` with explicit `sizes`. Media sits in aspect-ratio boxes, so there is no layout shift.
- Fonts are self-hosted via `next/font`. Only the default client's fonts are preloaded.
- Marquees are CSS-only. The grain overlay is one fixed pseudo-element.
- Demo images come from Unsplash. The first request per size goes through the optimizer and then is cached.

## Library choices

GSAP (with SplitText, free since 3.13), Motion, Lenis and Three.js/R3F cover every effect on this page. These were left out on purpose:

| Library | Reason it was left out |
| --- | --- |
| Barba.js | Hijacks navigation and conflicts with the App Router |
| Lottie, Rive | Need designer-made animation assets |
| Anime.js, PixiJS, Theatre.js | Overlap with GSAP and Three.js |

Each can be added per section if a client's design needs it.
