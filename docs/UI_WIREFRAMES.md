# uiteFOC — Screen Wireframes

Layout intent for the four primary surfaces. Tokens referenced here are defined in
[`DESIGN.md`](../DESIGN.md); data shapes in [`API_CONTRACTS.md`](./API_CONTRACTS.md).

Sizes are desktop-first at 1440×900 unless stated. Breakpoints: `lg` 1024px,
`md` 768px, `sm` 640px.

---

## 1. `/harta` — Incident dashboard

The default screen and the one that has to survive being left open on a second monitor
all day.

```
┌────────────────────────────────────────────────────────────────────────────────┐
│ ▣ uiteFOC   [ Caută localitate, județ sau lat, lon        🔍 ]      🔔 3   ⚙︎  │ 56px TopBar
├──────────┬──────────────────────────────────────────────┬──────────────────────┤
│          │  ┌────────────────────────────────────┐      │ ⚠ ALERTE             │
│ ◉ Harta  │  │ Incidente · Satelit · Vânt · Pred. │ ←────┼── LayerSwitcher      │
│ ◷ Risc   │  └────────────────────────────────────┘      │ ┃ 7,4 km   ↖ NE      │
│ ↑ Încarcă│                                              │ ┃ Râșnov, BV         │
│ ⧗ Istoric│              ●                               │ ┃ acum 20 min        │
│ ⓘ Ghid   │                    ◉ ← pulsing <6h           │ ┃ [Vezi] [Renunță]   │
│          │         ●                                    │ ├────────────────────┤
│  ────    │                ●        ●                    │ MEDIU · Râșnov       │
│          │                                              │ VÂNT                 │
│ Filtre   │   ●                          ●               │ 6,4 m/s  ↗ SV        │
│ ☑ Satelit│                                              │ rafale 11,2 m/s      │
│ ☑ Știri  │            ⬤ 12  ← cluster                   │ UMIDITATE            │
│ ☑ Useri  │                                              │ 24 %                 │
│ ☐ Stinse │  ┌──────────────┐        ┌────────────────┐  │ AQI                  │
│          │  │ ● <6h        │        │ ◀━━━━●━━━━━━▶  │  │ 128 ▁▂▃▅ moderat     │
│ Ultimele │  │ ● 6–24h      │        │ 12 sept → azi  │  │ FĂRĂ PLOAIE          │
│ [7 zile ▾]│  │ ● 24h–3z     │        └────────────────┘  │ 11 zile              │
│          │  │ ● >3z        │         TimelineScrubber    ├──────────────────────┤
│          │  └──────────────┘                            │ INCIDENTE ACTIVE  38 │
│          │   MapLegend            © MapLibre · NASA FIRMS│ ● Râșnov, BV         │
│          │                                              │   acum 20 min · 14 ha│
│  240px   │            full-bleed map canvas             │   satelit      0.91  │
│          │                                              │ ● Bran, BV           │
│          │                                              │   acum 2 ore · 3 ha  │
│          │                                              │ ● Zărnești, BV       │
└──────────┴──────────────────────────────────────────────┴──────────────────────┘
                                                                      340px rail
```

**Structure.** Three-column grid, `grid-template-columns: var(--shell-sidebar-width) 1fr var(--shell-rail-width)`,
`height: 100dvh`, no page scroll — only the rail's inner regions scroll.

**Map canvas.** Desaturated basemap (grayscale terrain), full bleed, bleeding under
the floating overlays. Four overlay anchors, each `--radius-xl`, Paper White at 92%,
`--shadow-overlay`, 16px from their edges:

- top-left — `MapSearch` (moves into the TopBar above `lg`, stays on the map below it)
- top-right — `LayerSwitcher`
- bottom-left — `MapLegend`
- bottom-center — `TimelineScrubber`, collapsed to a single "Perioadă" chip below `md`

**Markers.** Circle layers, radius 6→14px interpolated on zoom, fill from the recency
ramp via a MapLibre expression over `detectedAtMs`, 2px Paper White stroke. Incidents
under 6h carry a 2s pulse halo — killed under `prefers-reduced-motion`. Clusters are
Midnight Ink circles with white tabular-nums counts; a cluster whose newest member is
<6h old gets a `--data-recency-0` ring instead of a fill, so recency survives clustering.

**Selection.** Clicking a marker pushes `/harta/[incidentId]` (parallel route) and
opens a 420px drawer from the right, overlaying the rail: detection time, source with
link, area, confidence, the last three media thumbnails, a "Prognoză extindere" toggle
that loads `SpreadOverlay`, and "Vezi istoricul zonei" linking to `/istoric/[judet]`.
Hovering a feed row highlights the matching marker and vice versa — one `selectedId`
in `useMapStore`, two subscribers.

**Empty and failure states.** No incidents in view: the rail feed shows an
`EmptyState` reading "Niciun incendiu activ în zona vizibilă" with a "Vezi toată țara"
ghost button — never a blank column. Tile failure: the map area renders the
`MapPlaceholder` grid with a retry pill, and the feed keeps working, because the list
is the accessible equivalent of the map and must not die with it.

**Responsive.**
- `lg` — rail becomes a right-edge sheet, toggled by the 🔔 button; map takes the space.
- `md` — sidebar collapses to a 56px icon rail.
- `sm` — map fills the viewport; the rail becomes a bottom sheet with three detents
  (72px handle showing "38 incidente active" → 50% → full). Alert banners float above
  the sheet at the top of the map, never inside it.

---

## 2. `/risc` — Fire Danger Index heatmap

Deliberately a separate route. Two colour ramps in one viewport would make both
unreadable, and the two maps answer different questions: *where is it burning* vs.
*where would it burn*.

```
┌────────────────────────────────────────────────────────────────────────────────┐
│ ▣ uiteFOC   [ Caută...                            ]              🔔 3    ⚙︎    │
├──────────┬────────────────────────────────────────────────────────────────────┤
│ ◌ Harta  │  Indicele de risc de incendiu          [ azi ▾ ]  [ + 3 zile ▾ ]   │ 22px heading
│ ◉ Risc   │  Calculat 19 sept, 05:00 · model FWI canadian                      │ 13px Slate
│ ↑ Încarcă│ ┌────────────────────────────────────────────────────────────────┐ │
│ ⧗ Istoric│ │                                                                │ │
│ ⓘ Ghid   │ │        ▨▨▨░░░                                                  │ │
│          │ │      ▨▨███▨▨░░          choropleth: 0.1° cells                 │ │
│  ────    │ │     ░▨███████▨▨░        5 classes, no markers, no incidents    │ │
│          │ │      ░▨▨███▨▨░                                                 │ │
│ Straturi │ │        ░░▨▨░                                                   │ │
│ ◉ Cells  │ │                                                                │ │
│ ○ Județe │ │  ┌───────────────────────────────┐                             │ │
│ ☐ Contur │ │  │ Scăzut ▪▪▪▪▪ Extrem           │  ← MapLegend variant="risk" │ │
│   ISU    │ │  │ 1  2  3  4  5                 │                             │ │
│          │ │  └───────────────────────────────┘                             │ │
│          │ └────────────────────────────────────────────────────────────────┘ │
│          │  ┌──────────────┬──────────────┬──────────────┬──────────────────┐ │
│          │  │ FFMC   91.2  │ DMC    48.0  │ DC    310.5  │ Zile fără ploaie │ │
│          │  │ combustibil  │ humus        │ secetă       │ 11               │ │
│          │  └──────────────┴──────────────┴──────────────┴──────────────────┘ │
│          │  Ce înseamnă clasa 4? Vegetația uscată se aprinde de la o scânteie │
│          │  și focul se propagă rapid cu vânt peste 15 km/h. …               │
└──────────┴────────────────────────────────────────────────────────────────────┘
```

**Structure.** Same shell, no right rail — the risk view has no incident feed. The map
sits in a 12px-radius card inset 24px from the shell edges, which is the visual signal
that this is an analysis view and not the live one.

**Interaction.** Hovering a cell shows a cursor-following tooltip with FWI value, class
label, and the four component indices in monospace. Clicking a cell pins that readout
into the component strip below the map. The date control steps back 30 days and
forward through the forecast horizon the backend provides; the "Calculat" line always
states when, because a risk map with an ambiguous timestamp is worse than none.

**Explanation block.** Below the fold, one plain-language paragraph per class,
expanding on click, written for a person deciding whether to light a fire in their
yard — not for a forestry engineer. This is the part of the page that makes the map
actionable, so it is content, not filler.

**Responsive.** `md` and below: the component strip becomes a 2×2 grid; the legend
docks under the map rather than floating over it.

---

## 3. `/incarca` — Media upload portal

A document-width page, not a map shell — this is the one flow where the user is
looking at their own photo, not at Romania.

```
┌────────────────────────────────────────────────────────────────────────────────┐
│ ▣ uiteFOC   [ Caută...                            ]              🔔 3    ⚙︎    │
├──────────┬────────────────────────────────────────────────────────────────────┤
│ ◌ Harta  │            Verifică o poză sau un clip                             │ 29px
│ ◌ Risc   │   Modelul caută foc și fum. Rezultatul nu e o confirmare oficială. │ 15px Slate
│ ◉ Încarcă│                                                                    │
│ ⧗ Istoric│   ┌──────────────────────────────────────────────────────────┐     │
│ ⓘ Ghid   │   │                          ↑                               │     │
│          │   │        Trage fișierele aici sau alege de pe dispozitiv   │     │  UploadDropzone
│          │   │        JPG, PNG, HEIC, MP4 · max 50 MB · max 60 s        │     │  dashed Linen
│          │   └──────────────────────────────────────────────────────────┘     │
│          │                                                                    │
│          │   ┌──────────────────────────────────────────────────────────┐     │
│          │   │ ┌────────────────────┐   FOC  0.87                       │     │
│          │   │ │  [frame with red   │   ▰▰▰▰▰▰▰▰▱▱                      │     │  DetectionResultCard
│          │   │ │   detection boxes] │                                    │     │
│          │   │ │  ┌──┐ fire 0.87    │   EXIF                            │     │
│          │   │ │  └──┘ smoke 0.62   │   captat  19 sept 14:38           │     │
│          │   │ └────────────────────┘   GPS     45.6430, 25.5901        │     │
│          │   │                          device  Pixel 8                 │     │
│          │   │  ✓ GPS la 140 m de locația raportată                     │     │
│          │   │  ✓ Captat acum 4 minute                                  │     │
│          │   │                        [ Trimite ca semnalare ]          │     │
│          │   └──────────────────────────────────────────────────────────┘     │
│          │                                                                    │
│          │   Ce se întâmplă cu poza ta →                                      │
└──────────┴────────────────────────────────────────────────────────────────────┘
```

**States, in order.** Idle dropzone → per-file queue rows with a determinate upload bar
→ an indeterminate "Se analizează…" shimmer with the backend's `estimatedSeconds` as a
countdown → result card. A failure replaces the card in place with an `ErrorState`
carrying the `error.code` mapped to Romanian copy and a "Încearcă din nou" pill; the
file stays in the queue so nothing has to be re-picked.

**Detection boxes.** Drawn as absolutely-positioned divs over the frame from the
normalized `bbox`, 2px `--data-recency-0` border, label chip bottom-left in 11px
monospace on 70% black. The frame keeps its aspect ratio in a `max-width: 100%`
container so boxes stay aligned at every width.

**Verdict honesty.** `none` and `inconclusive` get equal visual weight to `fire` — same
card, Slate copy, no red. A model that says "nu sunt sigur" and looks like a failure
teaches people to ignore it. Confidence is always shown as a bar plus its number; the
"Trimite ca semnalare" action stays enabled even below threshold, because the human
looking at their own photo knows more than the model does.

**Privacy line.** "Ce se întâmplă cu poza ta" expands into what is stored, that EXIF
GPS is read, and how to submit without location. Required before any camera upload
ships, not a nice-to-have.

---

## 4. `/istoric/[judet]` and `/ghid/*` — History and emergency hub

### Zone history

Reached by clicking a zone on the map or from the sidebar. Document layout, 1200px
column on Parchment.

```
┌────────────────────────────────────────────────────────────────────────────────┐
│  ← Înapoi la hartă                                                             │
│                                                                                │
│  Brașov                                                        [ 2015–2026 ▾ ] │ 29px heading
│  412 incendii · 3.180 ha · cel mai mare: 640 ha, august 2019                   │ 15px Slate
│                                                                                │
│  ┌──────────────────────────────────────────────────────────────────────────┐  │
│  │  ▁▂▃▅█▇▅▃▂▁▁▁   ▁▂▄▆█▆▄▂▁▁▁▁   ▁▃▅█▇▅▂▁▁▁▁▁                             │  │ SeasonChart
│  │  I F M A M I I A S O N D                                                 │  │ incidents/month
│  │  2024            2025            2026                                    │  │ stacked by year
│  └──────────────────────────────────────────────────────────────────────────┘  │
│                                                                                │
│  2026 ────────────────────────────────────────────────────── 38 incendii ─────│ HistoryYearGroup
│   ● 19 sept · Râșnov · 14 ha · satelit                                        │ IncidentRow
│   ● 11 sept · Bran · 3 ha · știri                                             │
│   ● 04 sept · Zărnești · 27 ha · satelit                                      │
│   ⌄ încă 35                                                                    │
│                                                                                │
│  2025 ────────────────────────────────────────────────────── 51 incendii ─────│
└────────────────────────────────────────────────────────────────────────────────┘
```

Years are collapsible groups, newest first, current year open. Each row is the same
`IncidentRow` used in the live feed — one component, three contexts, so an incident
looks identical wherever the user meets it. The season chart is the page's one piece
of analysis: it answers "is this normal for September here?" before the list answers
"what happened".

### Emergency hub `/ghid`

Static MDX, document layout, a 240px sticky table of contents on the left at `lg+`.

```
┌────────────────────────────────────────────────────────────────────────────────┐
│  ┌─────────────────────────┐                                                   │
│  │ 112                     │  ← persistent call card, top of every /ghid page  │
│  │ Sună dacă vezi foc.     │     Ember Alert rail, filled pill "Sună 112"      │
│  │ [ Sună 112 ]            │     tel: link, always above the fold              │
│  └─────────────────────────┘                                                   │
│                                                                                │
│  Cuprins          Dacă vezi un incendiu                                        │
│  ─ Dacă vezi...   1. Sună 112 și spune județul, comuna și un reper.            │
│  ─ Prim ajutor    2. Nu te apropia de fum. …                                   │
│  ─ Evacuare                                                                    │
│  ─ Cadru legal    Prim ajutor — arsuri și inhalare de fum                      │
│  ─ Prevenire      ┌──────────────────────────────────────────────┐             │
│                   │ ⚠ Informație generală, nu sfat medical.      │             │
│                   └──────────────────────────────────────────────┘             │
│                   …                                                            │
└────────────────────────────────────────────────────────────────────────────────┘
```

Three rules for this section:

1. **The 112 card is above the fold on every page in `/ghid`** and is a real `tel:`
   link. Someone reaching this section may be reading it outdoors with one hand.
2. **Every medical and legal block opens with a scope disclaimer** in a Sunlit Cream
   callout, and every legal claim carries the law number and its date. Legal text goes
   stale; undated legal text is a liability.
3. **Fully static and cached offline** by the service worker at install time. This is
   the one section whose entire value depends on working with no signal.

---

## Cross-screen behaviour

**Alert banners** render in the rail on `/harta` and as a fixed stack under the TopBar
everywhere else, so an alert is never invisible because the user happened to be reading
the guide. Maximum three; the fourth collapses the stack to "încă 4 incendii în zona ta".

**Loading.** Every screen paints its shell, its sidebar, and its static copy
immediately; only the data regions show skeletons. Nothing waits on the map.

**Offline.** A `navigator.onLine === false` state puts a Stone-colored strip under the
TopBar: "Ești offline. Datele sunt de acum X minute." Cached incidents stay visible
and are marked stale rather than hidden — an old fire location is more useful than an
empty map.
