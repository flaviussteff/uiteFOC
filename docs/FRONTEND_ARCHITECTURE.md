# uiteFOC — Frontend Architecture

Owner: frontend branch. Nothing in this document describes backend behaviour; every
server interaction is expressed as a URL plus a payload shape defined in
[`API_CONTRACTS.md`](./API_CONTRACTS.md).

## Stack

| Concern | Choice | Why |
|---|---|---|
| Framework | **Next.js 15, App Router, TypeScript** | File-based routing matches the feature list almost one-to-one; server components fetch the read-heavy pages (history, guide) without shipping their data twice |
| Styling | **Tailwind v4** with the `@theme` block from `DESIGN.md` | Tokens live in one place and are the same ones the design reference publishes |
| Map | **MapLibre GL JS** + `react-map-gl` | Vector tiles, free basemaps, GPU rendering for thousands of FIRMS points. No API-key lock-in |
| Map data | GeoJSON sources + `cluster: true` | Clustering is a source option, not our code |
| Server state | **TanStack Query** | Polling, stale windows, cache invalidation, and request dedup for the incident feed |
| Client state | **Zustand** | Two small stores: map view state, user preferences |
| Realtime | **SSE** (`EventSource`) for the incident stream | One-way push, no socket infrastructure; falls back to a 60s poll |
| Forms | **react-hook-form** + **zod** | The zod schemas double as runtime validators for backend payloads |
| Charts | **visx** or plain SVG | AQI and FWI history are simple line/area charts; no heavyweight chart library |
| PWA | `next-pwa` + Workbox | Offline tile and incident cache for the hiking use case |

Rendering strategy per route:

- `/` `/harta` — client-rendered shell (map is browser-only), data via TanStack Query
- `/risc` — server component fetches the day's risk grid, client component renders it
- `/incarca` — client, file handling only
- `/istoric/[judet]` — server-rendered, cached; the zone click deep-links into it
- `/ghid` — fully static (MDX)

## Folder structure

```
web/
├── app/
│   ├── layout.tsx                  # <html>, fonts, providers, skip-link
│   ├── globals.css                 # @theme tokens + base layer
│   ├── page.tsx                    # → redirect to /harta
│   ├── (shell)/                    # routes that render inside the app shell
│   │   ├── layout.tsx              # AppShell: sidebar + topbar + rail slot
│   │   ├── harta/
│   │   │   ├── page.tsx            # incident map dashboard
│   │   │   └── @detail/            # parallel route: incident drawer
│   │   │       └── [incidentId]/page.tsx
│   │   ├── risc/page.tsx           # Fire Danger Index heatmap
│   │   ├── incarca/page.tsx        # media upload portal
│   │   ├── istoric/
│   │   │   ├── page.tsx            # county picker
│   │   │   └── [judet]/page.tsx    # zone history timeline
│   │   └── alerte/page.tsx         # alert subscription settings
│   ├── ghid/
│   │   ├── layout.tsx              # document layout, 1200px column
│   │   ├── page.tsx                # emergency hub index
│   │   ├── prim-ajutor/page.tsx
│   │   └── legal/page.tsx
│   └── api/
│       └── config/route.ts         # public runtime config only — no data logic
│
├── components/
│   ├── layout/
│   │   ├── AppShell.tsx            # grid: sidebar | map | rail
│   │   ├── Sidebar.tsx
│   │   ├── SidebarNavItem.tsx
│   │   ├── TopBar.tsx
│   │   └── RightRail.tsx           # sheet on tablet, bottom-sheet on phone
│   ├── map/
│   │   ├── MapCanvas.tsx           # MapLibre instance owner, imperative
│   │   ├── MapPlaceholder.tsx      # what ships today, before MapLibre lands
│   │   ├── IncidentLayer.tsx       # GeoJSON source + clustered circle layers
│   │   ├── SatelliteLayer.tsx      # FIRMS points, separate source
│   │   ├── SpreadOverlay.tsx       # ML prediction polygons
│   │   ├── WindLayer.tsx           # barbs / particle overlay
│   │   ├── RiskChoropleth.tsx      # FDI cells — /risc only
│   │   ├── MapLegend.tsx
│   │   ├── LayerSwitcher.tsx
│   │   ├── TimelineScrubber.tsx
│   │   ├── MapSearch.tsx
│   │   └── useMapViewState.ts
│   ├── incidents/
│   │   ├── IncidentFeed.tsx        # virtualized list
│   │   ├── IncidentRow.tsx
│   │   ├── IncidentDetail.tsx      # drawer body
│   │   ├── IncidentSourceBadge.tsx
│   │   └── SeverityDot.tsx
│   ├── alerts/
│   │   ├── AlertsContainer.tsx     # stacks up to 3, then collapses
│   │   ├── AlertBanner.tsx
│   │   ├── ProximitySettings.tsx   # radius slider, quiet hours
│   │   └── useGeolocation.ts
│   ├── upload/
│   │   ├── UploadDropzone.tsx
│   │   ├── UploadQueue.tsx
│   │   ├── DetectionResultCard.tsx
│   │   ├── DetectionBoxOverlay.tsx # draws boxes over the frame
│   │   └── ExifReadout.tsx
│   ├── environment/
│   │   ├── EnvironmentPanel.tsx
│   │   ├── DataReadout.tsx
│   │   ├── WindRose.tsx
│   │   └── AirQualityScale.tsx
│   ├── history/
│   │   ├── ZoneHistoryTimeline.tsx
│   │   ├── HistoryYearGroup.tsx
│   │   └── SeasonChart.tsx
│   └── ui/                         # primitives, no domain knowledge
│       ├── Card.tsx
│       ├── Pill.tsx
│       ├── PillButton.tsx
│       ├── Tag.tsx
│       ├── SearchInput.tsx
│       ├── Skeleton.tsx
│       ├── EmptyState.tsx
│       └── ErrorState.tsx
│
├── lib/
│   ├── types.ts                    # every shape in API_CONTRACTS.md
│   ├── schemas.ts                  # zod mirrors of those types
│   ├── api.ts                      # typed fetch wrappers, one per endpoint
│   ├── queries.ts                  # TanStack Query keys + hooks
│   ├── recency.ts                  # detectedAt → recency bucket + token
│   ├── geo.ts                      # haversine, bearing, bbox helpers
│   ├── format.ts                   # ro-RO dates, distances, units
│   └── mock/
│       ├── incidents.ts            # fixtures matching the contract exactly
│       ├── risk.ts
│       └── environment.ts
│
├── stores/
│   ├── useMapStore.ts              # viewport, active layers, selected incident
│   └── usePrefsStore.ts            # radius, units, reduced motion, locale
│
├── public/
│   ├── fonts/                      # Inter, self-hosted
│   └── icons/
│
└── tests/
    ├── components/
    └── e2e/
```

## Component hierarchy

```
RootLayout
└── Providers  (QueryClient · Theme · Locale)
    │
    ├── (shell)/layout → AppShell
    │   ├── Sidebar
    │   │   └── SidebarNavItem ×5            [Harta · Risc · Încarcă · Istoric · Ghid]
    │   ├── TopBar
    │   │   ├── BrandLogoBadge
    │   │   ├── MapSearch
    │   │   └── AlertBell → count from useProximityAlerts()
    │   │
    │   ├── {children}                        ← route content
    │   │
    │   └── RightRail
    │       ├── AlertsContainer
    │       │   └── AlertBanner ×n            props: ProximityAlert
    │       ├── EnvironmentPanel
    │       │   ├── DataReadout ×4            [vânt · rafale · AQI · umiditate]
    │       │   └── WindRose                  props: WindObservation
    │       └── IncidentFeed
    │           └── IncidentRow ×n            props: FireIncident
    │
    ├── /harta/page
    │   └── MapCanvas                         owns the MapLibre instance
    │       ├── IncidentLayer                 source: FeatureCollection<FireIncident>
    │       ├── SatelliteLayer                source: FeatureCollection<SatelliteDetection>
    │       ├── WindLayer                     source: WindField
    │       ├── SpreadOverlay                 source: SpreadPrediction
    │       ├── LayerSwitcher                 overlay, top-right
    │       ├── MapLegend                     overlay, bottom-left
    │       └── TimelineScrubber              overlay, bottom-center
    │   └── @detail/[incidentId] → IncidentDetail   (parallel route drawer)
    │
    ├── /risc/page
    │   └── MapCanvas
    │       ├── RiskChoropleth                source: RiskGrid
    │       └── MapLegend variant="risk"
    │
    ├── /incarca/page
    │   ├── UploadDropzone
    │   ├── UploadQueue
    │   │   └── DetectionResultCard ×n        props: DetectionResult
    │   │       ├── DetectionBoxOverlay
    │   │       └── ExifReadout
    │   └── ProximitySettings (inline CTA)
    │
    ├── /istoric/[judet]/page
    │   ├── SeasonChart                       props: ZoneHistory["byYear"]
    │   └── ZoneHistoryTimeline
    │       └── HistoryYearGroup → IncidentRow ×n
    │
    └── /ghid/*  (static MDX inside the 1200px document layout)
```

### Ownership rules

1. **One map instance per route.** `MapCanvas` owns it; every layer component is
   declarative and receives data through props. No child ever calls `map.flyTo`
   directly — it dispatches to `useMapStore`, and `MapCanvas` reacts.
2. **`components/ui/` knows nothing about fires.** If a primitive imports from
   `lib/types.ts`, it belongs in a domain folder instead.
3. **Data fetching lives in `lib/queries.ts`.** Components call hooks, never `fetch`.
4. **Every list component ships four states** — loading (`Skeleton`), empty
   (`EmptyState`), error (`ErrorState`), loaded. The empty state is designed copy,
   not a blank div.

## Route ↔ feature map

| Feature | Route | Primary components |
|---|---|---|
| Interactive incident map | `/harta` | `MapCanvas` · `IncidentLayer` · `IncidentFeed` |
| Satellite auto-plotting | `/harta` layer | `SatelliteLayer` · `LayerSwitcher` |
| News-scraped incidents | `/harta` layer | `IncidentLayer` filtered on `source: "news"` |
| Media upload + detection | `/incarca` | `UploadDropzone` · `DetectionResultCard` |
| Proximity push alerts | `/alerte` + global | `AlertsContainer` · `ProximitySettings` · `useGeolocation` |
| Wind / AQI + spread overlay | `/harta` rail + layer | `EnvironmentPanel` · `SpreadOverlay` |
| Zone history on click | `/istoric/[judet]` | `ZoneHistoryTimeline` · `SeasonChart` |
| Fire Danger Index heatmap | `/risc` | `RiskChoropleth` · `MapLegend variant="risk"` |
| Emergency info hub | `/ghid/*` | static MDX |

## Performance budget

- Incident GeoJSON is fetched once per viewport change, debounced 400ms, and
  clustered by MapLibre. Above ~2,000 features the source switches to a tiled
  endpoint (`/tiles/incidents/{z}/{x}/{y}.pbf`) — the contract for that is in
  `API_CONTRACTS.md`, and until it exists the client caps at `limit=2000`.
- `IncidentFeed` virtualizes past 50 rows.
- Detection frames are downscaled client-side to max 1920px before upload, so the
  ML service never receives a 12MP phone photo.
- Target: LCP under 2.5s on a mid-range Android over 4G, with the map skeleton
  painting before tiles arrive.

## Accessibility

- Map data is never available only as color: the `IncidentFeed` is the
  screen-reader-accessible equivalent of the marker layer, and keyboard `Tab`
  moves through feed rows, focusing the matching marker.
- All `--data-*` colors are paired with a text label in the legend and in every row.
- Alert banners use `role="status"` (`aria-live="polite"`); a fire inside the radius
  uses `role="alert"` (`assertive`) exactly once per incident.
- Motion: the <6h marker pulse and all map easing respect `prefers-reduced-motion`.
- Target AA contrast on every text/background pair in `DESIGN.md`; the yellow
  recency swatch never carries text.

## Branch conventions

- Frontend work lands on `feat/fe-*` branches, backend on `feat/be-*`.
- The two sides meet only at `lib/types.ts` and `lib/schemas.ts`. A change to either
  is a PR that both of us review, and it is the only kind of PR that blocks.
- Until an endpoint exists, `lib/api.ts` reads from `lib/mock/` behind
  `NEXT_PUBLIC_USE_MOCKS=1`. Swapping to the real backend is one env var.
