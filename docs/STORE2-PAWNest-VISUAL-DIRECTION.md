# PawNest (store2) — Forest & Amber · F3 visual direction

**Project:** `dropship_store_2` · **Tenant:** `store2`  
**Status:** Direction + SVG assets (no AI batch). Product/category photos: CJ or `placehold.co` until CEO approves `max_images`.

## Brand idea

Calm Scandinavian-meets-forest pet shop: natural greens, warm amber accents, cream background. Shapes are rounded, line weight ~2px, no glossy 3D. Photography (later): real pets in home interiors, soft daylight — not stock “smiling dog on white”.

## Palette (canonical — matches `theme_json.colors`)

| Token | Hex | Use |
|-------|-----|-----|
| primary | `#2D6A4F` | CTAs, links, key UI |
| secondary | `#1B4332` | Hero gradients, depth |
| accent | `#D4A373` | Highlights, nest strokes, badges |
| background | `#F7F5F0` | Page canvas |
| text | `#1C1917` | Body, headings |
| muted | `#57534E` | Meta, captions |

**Contrast:** Body text on `#F7F5F0` passes WCAG AA. White text on `#2D6A4F` / `#1B4332` for hero overlays only.

## Typography (UI agent)

- **Headings:** Fraunces (Google Fonts), weights 500–700  
- **Body:** Source Sans 3, 400/600  
- **Logo wordmark in SVG:** Georgia fallback until Fraunces loads in header (prefer HTML text + mark for production header).

## Logo

| Asset | Path | Notes |
|-------|------|--------|
| Full lockup | `/tenants/store2/logo.svg` | Mark + “PawNest” + eyebrow “FOREST & AMBER” |
| App / favicon mark | `/tenants/store2/logo-mark.svg` | 64×64, nest + paw on cream |

**Concept:** Amber nest arcs over forest-green paw pad — home + pet, no cartoon mascot.

**Clear space:** ≥ height of mark on all sides. Min width lockup ~140px; below that use mark only.

**Don’t:** drop shadows, gradients on wordmark, rotate, recolor greens/amber.

## Homepage hero (for UI implementation)

```
┌─────────────────────────────────────────────────────────────┐
│  [logo]                              Cart                   │
├─────────────────────────────────────────────────────────────┤
│  BG: hero-banner.svg (cover) + gradient scrim 40%           │
│  eyebrow (muted, uppercase tracking)                        │
│  H1 Fraunces — headline from theme_json.copy.hero           │
│  subheadline max-w-xl                                       │
│  [CTA primary #D4A373 or #2D6A4F] [CTA secondary outline]   │
├─────────────────────────────────────────────────────────────┤
│  Trust strip — 4 cols desktop, 2 mobile                     │
├─────────────────────────────────────────────────────────────┤
│  “Kategorie” — 7 tiles (icon + title + teaser)              │
│  image: placeholder_url OR CJ when linked                   │
├─────────────────────────────────────────────────────────────┤
│  Product grid (7 SKU)                                       │
├─────────────────────────────────────────────────────────────┤
│  FAQ (4 items, not dominant)                                │
└─────────────────────────────────────────────────────────────┘
```

- **Hero background:** `/tenants/store2/hero-banner.svg` (`object-fit: cover`, min-height ~320px mobile / ~420px desktop).  
- **Scrim:** `linear-gradient(90deg, #1B4332ee 0%, #1B433266 55%, transparent 100%)` for text legibility.  
- Copy: `theme_json.copy.hero` or `src/lib/pawnest-copy.ts`.

## Category tiles (7)

Use icons until CJ images exist:

| slug | Icon |
|------|------|
| gps | `/tenants/store2/icons/gps.svg` |
| slow-feeder | `/tenants/store2/icons/slow-feeder.svg` |
| legowiska | `/tenants/store2/icons/legowiska.svg` |
| fontanny | `/tenants/store2/icons/fontanny.svg` |
| polki | `/tenants/store2/icons/polki.svg` |
| szczotki | `/tenants/store2/icons/szczotki.svg` |
| szelki-led | `/tenants/store2/icons/szelki-led.svg` |

Photo placeholders (already in DB): `placehold.co` URLs in migration `007` — same hex as palette.

## Open Graph / social (placeholder — no AI batch)

Until approved batch:

- **OG 1200×630:** `https://placehold.co/1200x630/2D6A4F/F7F5F0?text=PawNest`  
- **Twitter 1200×675:** `https://placehold.co/1200x675/1B4332/F7F5F0?text=PawNest`  
- **Favicon:** wire `/tenants/store2/logo-mark.svg` (or export 32/180 PNG from mark in Canva — $0).

Suggested `metadata` for store2 home (UI): `openGraph.images` → placehold URL above; replace after CEO OK + real OG export.

## AI image batch (gated)

**Not run.** When CEO sets `max_images` in approvals:

1. Compare 1–2 samples (Pollinations / Nano Banana / DALL·E) per category hero + 1 lifestyle hero.  
2. Batch only after explicit OK.  
3. Prefer CJ supplier images for PDP; AI only for gaps.

**Prompt seed (lifestyle hero):** “Minimal Scandinavian living room, dog bed and cat shelf, forest green and amber textile accents, soft window light, no text, no logo, editorial photo.”

## Canva checklist ($0)

- [ ] Export PNG favicon set from `logo-mark.svg`  
- [ ] OG template 1200×630 with palette + tagline PL  
- [ ] Optional email header 600×200 same style  

## Handoff to UI agent

1. Header: `theme_json.logo` → `<Image src={logo} alt={tenant.name} />`, hide redundant text tagline on mobile if cramped.  
2. Load Fraunces + Source Sans 3 when `tenant.slug === 'store2'`.  
3. Build `PawNestHomeHero`, `CategoryGrid`, `TrustStrip` from `pawnest-copy.ts` / theme.  
4. Keep FAQ below fold; H1 on home = hero headline (not “Products”).
