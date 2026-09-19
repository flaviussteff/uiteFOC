# uiteFOC — Style Reference
> sunlit editorial chrome, alarming data — warm cream paper that lets the map do the shouting

**Theme:** light

uiteFOC is a sunlit editorial workspace wrapped around an emergency map. The chrome — cream canvas, near-black Inter typography, pill-shaped controls, soft 5%-black shadows — is deliberately calm, because the only things allowed to alarm the user are the incidents on the map. Everything the operator reads sits on pure white cards floating just above the warm paper beneath them; everything the operator *watches* sits on the map, where a strict severity ramp is the entire chromatic vocabulary. Brand color is rationed to a single orange stamp of intent and never competes with data color.

The rule that makes the whole system work: **chrome is warm and quiet, data is saturated and loud, and the two never borrow each other's colors.**

## Tokens — Colors

### Brand & Chrome

| Name | Value | Token | Role |
|------|-------|-------|------|
| Campfire Orange | `#ff6b1a` | `--color-campfire-orange` | Logo badge, notification pills, and brand-punctuation moments — a single warm coral that anchors the palette against the cream canvas. Never appears on the map or on any data surface |
| Ember Brown | `#451a03` | `--color-ember-brown` | Deep brown accent for inline highlight text, tag foregrounds, and quoted advisory copy |
| Sunlit Cream | `#fef3c7` | `--color-sunlit-cream` | Soft warm wash behind tags, badges, and inline callouts |
| Midnight Ink | `#171717` | `--color-midnight-ink` | Primary text, headings, icon strokes, and dark filled buttons |
| Paper White | `#ffffff` | `--color-paper-white` | Card surfaces, elevated panels, and the top of the surface stack |
| Parchment | `#fffdf9` | `--color-parchment` | Page canvas — a barely-warm off-white that gives the whole site its sunlit feel |
| Fog Gray | `#f5f5f5` | `--color-fog-gray` | Muted backgrounds, secondary surface fills, and input field chrome |
| Linen | `#f0f0f0` | `--color-linen` | Subtle dividers, hover wash on rows, and tag backgrounds |
| Ash Gray | `#a3a3a3` | `--color-ash-gray` | Muted helper text, placeholder copy, and disabled labels |
| Slate | `#737373` | `--color-slate` | Secondary text, timestamps, and metadata in lists |
| Graphite | `#525252` | `--color-graphite` | Tertiary text and muted icon strokes |
| Stone | `#8f7668` | `--color-stone` | Warm muted accent for body copy that should feel quieter than Midnight Ink |

### Semantic & Data

Two of these were supporting accents in the source system; in a monitoring product they carry state, and that promotion is deliberate.

| Name | Value | Token | Role |
|------|-------|-------|------|
| Forest Pulse | `#22c55e` | `--color-forest-pulse` | Success and "all clear": verified-safe zones, successful upload, contained incidents, FDI class 1 |
| Ember Alert | `#ef4444` | `--color-ember-alert` | Error and danger state in chrome: failed detection, revoked geolocation, dismissed alert banners |
| Recency 0 | `#dc2626` | `--data-recency-0` | Incident detected < 6h ago — map marker, list dot, alert banner rail |
| Recency 1 | `#f97316` | `--data-recency-1` | 6–24h |
| Recency 2 | `#facc15` | `--data-recency-2` | 24h–3d |
| Recency 3 | `#a8a29e` | `--data-recency-3` | > 3d or extinguished — desaturated stone, drops out of the eye's path |
| Risk 1–5 | `#22c55e` `#a3e635` `#facc15` `#fb923c` `#dc2626` | `--data-risk-1` … `--data-risk-5` | Fire Danger Index classes on the heatmap, low → extreme. Never used on the incident map |

`--data-recency-1` (#f97316) sits close to Campfire Orange on purpose — they must never appear in the same frame. Brand orange is forbidden inside the map viewport and inside any legend.

## Tokens — Typography

### Inter — Sole typeface across UI, headings, and body — no display or serif counterpart. The single-family commitment is deliberate: Inter's geometric neutrality keeps focus on content, and the three-weight range (400 body, 500 metadata, 600 display) carries all hierarchy. · `--font-inter`
- **Substitute:** Inter Tight or IBM Plex Sans
- **Weights:** 400, 500, 600
- **Sizes:** 10, 11, 12, 13, 14, 15, 16, 17, 18, 20, 22, 29, 58
- **Line height:** 1.00–1.80
- **Letter spacing:** -1.8px at 58px display, -0.52px at 29px heading, -0.37px at 22px subheading, +0.25px at 10–12px captions
- **OpenType features:** `"ss01" on, "cv11" on`
- **Role:** Sole typeface across UI, headings, and body — no display or serif counterpart.

### ui-monospace — Measurements, coordinates, and machine output · `--font-ui-monospace`
- **Substitute:** JetBrains Mono or IBM Plex Mono
- **Weights:** 400, 600
- **Sizes:** 11, 12, 13
- **Line height:** 1.00–1.40
- **Numeric:** always `font-variant-numeric: tabular-nums`
- **Role:** Lat/lon pairs, wind speed and bearing, AQI values, FWI indices, confidence scores, timestamps in detail panels, and incident IDs. Any number that changes while the user watches it is monospace, so the glyph box never shifts.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.2 | 0.3px | `--text-caption` |
| body | 15px | 1.5 | — | `--text-body` |
| subheading | 18px | 1.56 | — | `--text-subheading` |
| heading-sm | 22px | 1.4 | -0.37px | `--text-heading-sm` |
| heading | 29px | 1.2 | -0.52px | `--text-heading` |
| display | 58px | 1 | -1.8px | `--text-display` |

Display (58px) belongs to the marketing pages only. Inside the app the ceiling is heading-sm (22px) — an operator console with a 58px headline wastes the viewport the map needs.

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** compact

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 8 | 8px | `--spacing-8` |
| 12 | 12px | `--spacing-12` |
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 32 | 32px | `--spacing-32` |
| 48 | 48px | `--spacing-48` |
| 64 | 64px | `--spacing-64` |
| 72 | 72px | `--spacing-72` |
| 80 | 80px | `--spacing-80` |
| 96 | 96px | `--spacing-96` |
| 160 | 160px | `--spacing-160` |

### Border Radius

| Element | Value | Token |
|---------|-------|-------|
| tags | 9999px | `--radius-full` |
| cards | 12px | `--radius-xl` |
| map overlays | 12px | `--radius-xl` |
| pills | 9999px | `--radius-full` |
| inputs | 8px | `--radius-lg` |
| avatars | 9999px | `--radius-full` |
| buttons | 9999px | `--radius-full` |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| sm | `rgba(0, 0, 0, 0.05) 0px 3px 6px -3px, rgba(0, 0, 0, 0.05)...` | `--shadow-sm` |
| subtle | `rgba(0, 0, 0, 0.08) 0px 1px 1px -1px, rgba(0, 0, 0, 0.08)...` | `--shadow-subtle` |
| subtle-2 | `rgba(0, 0, 0, 0.05) 0px 1px 2px 0px` | `--shadow-subtle-2` |
| overlay | `rgba(0, 0, 0, 0.12) 0px 4px 16px -4px, rgba(0, 0, 0, 0.08) 0px 1px 3px 0px` | `--shadow-overlay` |

`--shadow-overlay` is the one shadow allowed to go past 5% black: panels floating over map tiles need more separation than cards floating over paper.

### Layout

- **Page max-width:** 1200px (marketing and document pages)
- **App shell:** full-bleed, no max-width — the map owns the viewport
- **Section gap:** 64px, 80px on marketing hero sections
- **Card padding:** 16px compact rows, 24px feature panels
- **Element gap:** 8px

## Components

### Brand Logo Badge
**Role:** Persistent brand mark in the top-left of every page

28px rounded square (radius 8px) filled with Campfire Orange (#ff6b1a), white glyph at 16px Inter weight 600 centered inside. Acts as the home button. The only place Campfire Orange appears in the app shell.

### Notification Pill Banner
**Role:** Headline-area announcement strip

Inline pill, 9999px radius, 8px 16px padding, Campfire Orange fill, white text at 13px Inter weight 500. Optional leading 'NOU' tag in a 2-tone orange + dot indicator. Marketing pages only — inside the app, announcements use the Alert Banner instead.

### Hero Headline
**Role:** First-screen page title

58px Inter weight 600 in Midnight Ink, centered, line-height 1.00, letter-spacing -1.8px. Two short lines max. Followed by a 17–18px Inter weight 400 subtitle in Slate (#737373), centered.

### Section Heading
**Role:** Inter-section title in marketing and document pages

29px Inter weight 600 Midnight Ink, centered, line-height 1.20, letter-spacing -0.52px. One to two lines.

### Filled Pill Button
**Role:** Primary interactive action

9999px radius, 8px 16px padding, Midnight Ink background, white text at 14px Inter weight 500. No border. Soft inset highlight from the elevation stack to suggest a tactile surface.

### Ghost Pill Button
**Role:** Secondary action / link-style button

9999px radius, 8px 16px padding, transparent background, 1px Linen (#f0f0f0) border, Slate text. On hover: Fog Gray wash.

### Sidebar Nav Item
**Role:** Navigation row inside the product app

Compact row, 8px 12px padding, small 16px icon in Slate, 14px Inter weight 500 label in Midnight Ink. Active state: Fog Gray fill, Midnight Ink icon. 9999px radius to match the pill language. Optional trailing count chip in Ash Gray monospace.

### Severity Dot
**Role:** Recency indicator on every incident, everywhere

8px circle at `--data-recency-*`, with a 2px Paper White ring so it survives on both card and map-tile backgrounds. On markers under 6 hours old it carries a slow 2s pulse halo; `prefers-reduced-motion` replaces the pulse with a static 1.5px outer ring. Never rendered without an adjacent text label — color alone is not an accessible status channel.

### Incident Row
**Role:** Single incident inside the feed, the search results, or a zone's history

White card surface, 16px padding, 12px radius. Left: Severity Dot + source glyph (satellite / newspaper / camera / pin). Center: locality + county at 14px Inter weight 600 Midnight Ink, then a 13px weight 400 Slate line carrying detection time and area. Right: confidence as a monospace percentage in Ash Gray and a Tag Pill for the source. Whole row is a button; hover applies the Linen wash and highlights the matching map marker.

### Map Legend Chip
**Role:** Recency or risk scale, bottom-left of any map

Paper White surface at 92% opacity, 12px radius, `--shadow-overlay`, 12px padding. A horizontal run of 8px swatches with 11px monospace labels beneath ("<6h", "6–24h", "24h–3z", ">3z"). The FDI heatmap swaps in the five risk classes and their names. Collapses to a single tappable chip below 640px.

### Layer Switcher
**Role:** Toggling map overlays

Segmented pill group, 9999px radius, Fog Gray track, Paper White active thumb with `--shadow-subtle-2`, 13px Inter weight 500 labels. Segments: Incidente · Satelit · Vânt · Predicție. Multi-select; each active segment gets a 6px Severity Dot in its layer color.

### Alert Banner
**Role:** Proximity warning when a fire is inside the user's radius

Full-width strip pinned under the top bar. Paper White surface, 4px left rail in the incident's recency color, 16px padding, 12px radius. Distance in 22px monospace weight 600 ("7,4 km"), locality in 15px Inter weight 500, bearing as a small rotated arrow glyph. Two ghost pill actions: "Vezi pe hartă" and "Renunță". Stacks up to three; beyond that it collapses to a count row.

### Upload Dropzone
**Role:** Photo/video intake for ML detection

Dashed 2px Linen border, 12px radius, Fog Gray fill, 48px vertical padding, centered 24px icon in Ash Gray above 15px Inter weight 500 prompt copy and a 13px Slate hint listing accepted formats and size cap. Drag-over state: Sunlit Cream fill, Campfire Orange dashed border. This is the one place in the app where brand orange is allowed on an interactive state, because there is no map in frame.

### Detection Result Card
**Role:** What the model saw in an uploaded frame

White card, 24px padding, 12px radius. Top: the uploaded frame with detection boxes drawn in `--data-recency-0`, each labelled with class and confidence in 11px monospace on a 70%-black chip. Below: a verdict row (Tag Pill: foc / fum / neconcludent), the confidence bar, and an EXIF readout table in monospace — coordinates, capture time, device. A "Trimite ca semnalare" filled pill when a verdict clears threshold; a Slate explanation line when it does not.

### Data Readout
**Role:** One environmental measurement in the side panel

Label in 11px Inter weight 500 uppercase Ash Gray with +0.25px tracking, value in 22px monospace weight 600 Midnight Ink with tabular numerals, unit in 13px Slate. Wind adds a rotated bearing arrow at 16px; AQI adds a 4px severity underline in its category color. No card chrome — readouts sit directly on the Fog Gray panel, separated by 1px Linen rules.

### Tag / Status Pill
**Role:** Inline metadata badge

9999px radius, 4px 10px padding, 12px Inter weight 500. Variants: Sunlit Cream fill with Ember Brown text (default), Forest Pulse fill with white text (verified / contained), Ember Alert fill with white text (failed / unverified).

### Search Input
**Role:** Locality, county, and coordinate search

Full-width input, 8px radius, 8px 12px padding, Fog Gray fill, Ash Gray placeholder at 14px Inter weight 400. No visible border — the fill is the chrome. Leading 16px search icon in Ash Gray. Accepts a pasted `lat, lon` pair and flies the map there.

### Timeline Scrubber
**Role:** Replaying the last N days of incidents

Horizontal track, 4px Linen rail, 9999px radius, with a Paper White 16px thumb carrying `--shadow-subtle`. Tick density marks days; each tick's height encodes that day's incident count, filled in its recency color. Sits inside a map overlay panel, 12px radius, `--shadow-overlay`.

### App Preview Frame
**Role:** Wrapping frame around product screenshots in marketing

White surface, 12px radius, subtle 5%-black shadow stack, optional browser-chrome header (traffic-light dots, title text) at top. The proof artifact for each feature.

## Do's and Don'ts

### Do
- Use 9999px radius for every interactive element — buttons, tags, avatars, and pills share one full-curve language; 12px is reserved for surfaces
- Layer surfaces as Parchment (#fffdf9) canvas → Paper White (#ffffff) card → Fog Gray (#f5f5f5) inset — never use pure gray borders to separate layers
- Reserve Campfire Orange (#ff6b1a) for the logo, marketing pills, and the upload drag-over state — never for routine CTAs
- Keep the severity ramp as the only chromatic language on data surfaces: markers, legends, alert rails, and heatmap cells all read from `--data-*`
- Pair every color-coded status with a text label or glyph, so recency survives grayscale printing and color-vision deficiency
- Set every changing number in monospace with tabular numerals — coordinates, distances, confidences, and countdowns must not reflow as they update
- Keep the 4px base unit: 8px element gaps, 16–24px card padding, 64–80px marketing section gaps
- Apply the soft 5%-black shadow stack to cards over paper, and `--shadow-overlay` to panels over map tiles
- Desaturate the basemap (grayscale or muted terrain) so incident color is the only saturation in the viewport

### Don't
- Don't introduce a second typeface — the single-family Inter system plus monospace numerals is the design, not a limitation
- Don't add blue, purple, or any cool chromatic accent to the chrome — the palette is warm-only; cool hues belong to the basemap's water only
- Don't put Campfire Orange anywhere near the map — it reads as a 6–24h incident and corrupts the legend
- Don't use hard 1px gray borders to separate cards from the canvas — the warm off-white background already does the work
- Don't run the display size (58px) inside the app shell; 22px is the operator-console ceiling
- Don't animate map markers beyond the single <6h pulse, and always kill it under `prefers-reduced-motion`
- Don't use sharp 0px or 2px radii on surfaces — the 8–12px range is what makes cards feel like paper, not glass
- Don't stack more than three Alert Banners; past that, collapse to a count or the user stops reading all of them

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Parchment Canvas | `#fffdf9` | Page background — warm off-white that absorbs the site into editorial paper |
| 2 | Paper White | `#ffffff` | Card surfaces and the main feed container — pure white lifts content above the canvas |
| 3 | Fog Gray | `#f5f5f5` | Hover states, secondary panels, and the inside of the environmental sidebar |
| 4 | Sunlit Cream | `#fef3c7` | Occasional warm wash for highlighted tags and inline callouts |
| 5 | Map Canvas | basemap | Not a token — the desaturated tile layer, the only surface the `--data-*` ramp is painted on |

## Elevation

- **Card / surface elevation:** `0 3px 6px -3px rgba(0,0,0,0.05), 0 2px 4px -2px rgba(0,0,0,0.05), 0 1px 2px -1px rgba(0,0,0,0.05), 0 1px 1px -1px rgba(0,0,0,0.05), 0 1px 0 -1px rgba(0,0,0,0.05)`
- **Filled button / interactive inset:** `0 1px 1px -1px rgba(0,0,0,0.08), 0 2px 2px -1px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.06), inset 0 1px 0 #fff, inset 0 1px 2px 1px #fff, inset 0 1px 2px 0 rgba(0,0,0,0.06)`
- **Subtle row / chip:** `0 1px 2px 0 rgba(0,0,0,0.05)`
- **Map overlay panel:** `0 4px 16px -4px rgba(0,0,0,0.12), 0 1px 3px 0 rgba(0,0,0,0.08)`

## Imagery

Imagery is split into four strict registers and nothing else. (1) Map captures — desaturated basemap with the severity ramp on top, wrapped in an App Preview Frame, used as the proof artifact for each feature and always centered below its section heading. (2) User-submitted photos and video frames, always shown with their detection boxes and confidence chips drawn on, never cropped in a way that removes the horizon a reviewer needs to judge the frame. (3) Satellite imagery tiles, presented raw with a provider attribution line in 11px Ash Gray — never color-graded, because the coloring carries data. (4) Avatar circles at 24–32px, photo or initials on a solid fill. There is no lifestyle photography, no stock illustration, no 3D renders, and no decorative fire imagery anywhere in the product — a burning forest as ornament next to a live incident feed reads as editorializing a real emergency. Icons throughout the UI are simple, single-weight, monochrome in Slate or Midnight Ink; the brand mark is the only place brand color lives.

## Layout

Marketing and document pages follow a centered, max-width-1200px column with generous vertical rhythm: notification pill → 58px headline → 17px subtitle → App Preview Frame, then alternating heading + screenshot sections at 64–80px vertical padding.

The app itself abandons the max-width entirely and runs a three-column shell at full bleed. A compact 240px left sidebar (icons + labels, Fog Gray hover, collapsible to 56px icons) carries navigation between Harta, Risc, Încarcă, Istoric, and Ghid. The center column is the map canvas, edge to edge, with floating overlay panels — search top-left, layer switcher top-right, legend bottom-left, timeline bottom-center. The right rail is a 340px Fog Gray panel holding the environmental readouts, the active-incident feed, and any Alert Banners; it slides over the map as a sheet below 1024px and becomes a bottom sheet with three detents below 640px. Navigation on marketing pages is a minimal top bar with right-aligned text links — no dropdowns, no mega-menu, no sticky behavior.

## Agent Prompt Guide

QUICK COLOR REFERENCE
- text: #171717 (Midnight Ink)
- background (page): #fffdf9 (Parchment)
- background (card): #ffffff (Paper White)
- background (muted panel): #f5f5f5 (Fog Gray)
- border / divider: #f0f0f0 (Linen)
- accent: #ff6b1a (Campfire Orange) — logo, marketing pills, upload drag-over only
- primary action: no distinct CTA color — Midnight Ink filled pill
- data ramp: #dc2626 → #f97316 → #facc15 → #a8a29e (recency); #22c55e → #dc2626 across five steps (risk)

EXAMPLE COMPONENT PROMPTS
1. **App shell.** Full-bleed three-column grid: 240px sidebar on Fog Gray (#f5f5f5), full-height map canvas center, 340px right rail on Fog Gray. Sidebar rows: 8px 12px padding, 9999px radius, 16px Slate icon + 14px Inter weight 500 label, active state Fog Gray fill on Paper White sidebar.
2. **Incident row.** White card, 12px radius, 16px padding, 1px Linen border. Left: 8px severity dot at #dc2626 with 2px white ring. Center: "Comuna X, Cluj" at 14px Inter weight 600 Midnight Ink, then "acum 2 ore · 14 ha" at 13px weight 400 Slate. Right: "0.91" in 12px monospace Ash Gray and a Sunlit Cream (#fef3c7) tag pill with Ember Brown (#451a03) text reading "satelit".
3. **Alert banner.** Paper White strip, 12px radius, 4px left rail in #dc2626, 16px padding, shadow `0 4px 16px -4px rgba(0,0,0,0.12)`. Distance "7,4 km" at 22px monospace weight 600, locality at 15px Inter weight 500, two ghost pill buttons (9999px radius, 1px Linen border, Slate text) at the right.
4. **Map legend chip.** Paper White at 92% opacity, 12px radius, 12px padding, overlay shadow. Four 8px swatches (#dc2626, #f97316, #facc15, #a8a29e) in a row, each with an 11px monospace Ash Gray label beneath.
5. **Upload dropzone.** 2px dashed Linen border, 12px radius, Fog Gray fill, 48px vertical padding, centered 24px Ash Gray icon, 15px Inter weight 500 prompt, 13px Slate format hint. Drag-over: Sunlit Cream fill, Campfire Orange dashed border.

## Reference Products

- **Watch Duty** — the closest functional sibling: verified wildfire incidents, proximity alerts, and a deliberately calm interface around alarming data
- **Windy** — full-bleed map shell with floating overlay panels and layer switching; the model for the app's chrome-over-map layout
- **NASA Worldview (EOSDIS)** — satellite layer handling, provider attribution, and the timeline scrubber pattern
- **PurpleAir** — environmental readouts paired with a category color ramp and plain-language explanations of what a number means
- **Linear** — Inter-only typography with tight display tracking and a compact, list-driven rhythm; the source of the type system's discipline

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors — brand & chrome */
  --color-campfire-orange: #ff6b1a;
  --color-ember-brown: #451a03;
  --color-sunlit-cream: #fef3c7;
  --color-midnight-ink: #171717;
  --color-paper-white: #ffffff;
  --color-parchment: #fffdf9;
  --color-fog-gray: #f5f5f5;
  --color-linen: #f0f0f0;
  --color-ash-gray: #a3a3a3;
  --color-slate: #737373;
  --color-graphite: #525252;
  --color-stone: #8f7668;

  /* Colors — semantic */
  --color-forest-pulse: #22c55e;
  --color-ember-alert: #ef4444;

  /* Colors — data ramps (map only) */
  --data-recency-0: #dc2626;
  --data-recency-1: #f97316;
  --data-recency-2: #facc15;
  --data-recency-3: #a8a29e;
  --data-risk-1: #22c55e;
  --data-risk-2: #a3e635;
  --data-risk-3: #facc15;
  --data-risk-4: #fb923c;
  --data-risk-5: #dc2626;

  /* Typography — Font Families */
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-ui-monospace: ui-monospace, SFMono-Regular, 'JetBrains Mono', Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.2;
  --tracking-caption: 0.3px;
  --text-body: 15px;
  --leading-body: 1.5;
  --text-subheading: 18px;
  --leading-subheading: 1.56;
  --text-heading-sm: 22px;
  --leading-heading-sm: 1.4;
  --tracking-heading-sm: -0.37px;
  --text-heading: 29px;
  --leading-heading: 1.2;
  --tracking-heading: -0.52px;
  --text-display: 58px;
  --leading-display: 1;
  --tracking-display: -1.8px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-72: 72px;
  --spacing-80: 80px;
  --spacing-96: 96px;
  --spacing-160: 160px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 64px;
  --section-gap-lg: 80px;
  --card-padding: 16px;
  --card-padding-lg: 24px;
  --element-gap: 8px;
  --shell-sidebar-width: 240px;
  --shell-sidebar-collapsed: 56px;
  --shell-rail-width: 340px;
  --shell-topbar-height: 56px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 18px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-sm: rgba(0, 0, 0, 0.05) 0px 3px 6px -3px, rgba(0, 0, 0, 0.05) 0px 2px 4px -2px, rgba(0, 0, 0, 0.05) 0px 1px 2px -1px, rgba(0, 0, 0, 0.05) 0px 1px 1px -1px, rgba(0, 0, 0, 0.05) 0px 1px 0px -1px;
  --shadow-subtle: rgba(0, 0, 0, 0.08) 0px 1px 1px -1px, rgba(0, 0, 0, 0.08) 0px 2px 2px -1px, rgba(0, 0, 0, 0.06) 0px 0px 0px 1px, rgb(255, 255, 255) 0px 1px 0px 0px inset, rgb(255, 255, 255) 0px 1px 2px 1px inset, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px inset;
  --shadow-subtle-2: rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
  --shadow-overlay: rgba(0, 0, 0, 0.12) 0px 4px 16px -4px, rgba(0, 0, 0, 0.08) 0px 1px 3px 0px;

  /* Surfaces */
  --surface-parchment-canvas: #fffdf9;
  --surface-paper-white: #ffffff;
  --surface-fog-gray: #f5f5f5;
  --surface-sunlit-cream: #fef3c7;
}
```

### Tailwind v4

```css
@theme {
  /* Colors — brand & chrome */
  --color-campfire-orange: #ff6b1a;
  --color-ember-brown: #451a03;
  --color-sunlit-cream: #fef3c7;
  --color-midnight-ink: #171717;
  --color-paper-white: #ffffff;
  --color-parchment: #fffdf9;
  --color-fog-gray: #f5f5f5;
  --color-linen: #f0f0f0;
  --color-ash-gray: #a3a3a3;
  --color-slate: #737373;
  --color-graphite: #525252;
  --color-stone: #8f7668;

  /* Colors — semantic */
  --color-forest-pulse: #22c55e;
  --color-ember-alert: #ef4444;

  /* Colors — data ramps */
  --color-recency-0: #dc2626;
  --color-recency-1: #f97316;
  --color-recency-2: #facc15;
  --color-recency-3: #a8a29e;
  --color-risk-1: #22c55e;
  --color-risk-2: #a3e635;
  --color-risk-3: #facc15;
  --color-risk-4: #fb923c;
  --color-risk-5: #dc2626;

  /* Typography */
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-mono: ui-monospace, SFMono-Regular, 'JetBrains Mono', Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 12px;
  --text-caption--line-height: 1.2;
  --text-caption--letter-spacing: 0.3px;
  --text-body: 15px;
  --text-body--line-height: 1.5;
  --text-subheading: 18px;
  --text-subheading--line-height: 1.56;
  --text-heading-sm: 22px;
  --text-heading-sm--line-height: 1.4;
  --text-heading-sm--letter-spacing: -0.37px;
  --text-heading: 29px;
  --text-heading--line-height: 1.2;
  --text-heading--letter-spacing: -0.52px;
  --text-display: 58px;
  --text-display--line-height: 1;
  --text-display--letter-spacing: -1.8px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-72: 72px;
  --spacing-80: 80px;
  --spacing-96: 96px;
  --spacing-160: 160px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 18px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-sm: rgba(0, 0, 0, 0.05) 0px 3px 6px -3px, rgba(0, 0, 0, 0.05) 0px 2px 4px -2px, rgba(0, 0, 0, 0.05) 0px 1px 2px -1px, rgba(0, 0, 0, 0.05) 0px 1px 1px -1px, rgba(0, 0, 0, 0.05) 0px 1px 0px -1px;
  --shadow-subtle: rgba(0, 0, 0, 0.08) 0px 1px 1px -1px, rgba(0, 0, 0, 0.08) 0px 2px 2px -1px, rgba(0, 0, 0, 0.06) 0px 0px 0px 1px, rgb(255, 255, 255) 0px 1px 0px 0px inset, rgb(255, 255, 255) 0px 1px 2px 1px inset, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px inset;
  --shadow-subtle-2: rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
  --shadow-overlay: rgba(0, 0, 0, 0.12) 0px 4px 16px -4px, rgba(0, 0, 0, 0.08) 0px 1px 3px 0px;
}
```
