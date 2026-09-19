# uiteFOC — frontend

Next.js 15 (App Router) · TypeScript · Tailwind v4 · MapLibre.

```bash
cd web
npm install
cp .env.example .env.local
npm run dev        # http://localhost:3000 → redirects to /harta
```

Nothing has been installed or built yet — `node_modules` is absent, so `npm install`
is the first real step. The code is written against the versions pinned in
`package.json`.

## What exists

| Area | State |
|---|---|
| App shell (sidebar, topbar, right rail) | done, responsive down to 640px |
| Map area | `MapPlaceholder` — real geometry, real overlays, no tiles yet |
| Map overlays (legend, layer switcher, period control) | done |
| Alerts container + banners | done, stacks to three then collapses |
| Incident feed + row + severity dot | done, four states |
| Environment panel + readouts | done |
| Data contracts (`lib/types.ts`) | complete, mirrors `docs/API_CONTRACTS.md` |
| Mock fixtures | `lib/mock/` — shaped exactly like the contracts |
| Risk map, upload portal, history, guide | routes designed in `docs/UI_WIREFRAMES.md`, not built |

## The boundary

The frontend talks to the backend through exactly the shapes in
[`../docs/API_CONTRACTS.md`](../docs/API_CONTRACTS.md), typed in `lib/types.ts`.
While `NEXT_PUBLIC_USE_MOCKS=1`, every component reads from `lib/mock/` instead, so
the UI can be built and reviewed before a single endpoint exists.

Two things the backend must never send, because the client derives them and must keep
them correct in a tab left open for an hour:

- the recency bucket and the marker color — send `detectedAt`, we compute the rest
- relative time strings ("acum 2 ore") and distances — send timestamps and coordinates

One thing the client cannot derive and the backend must send: `detectedAtMs` on GeoJSON
features. MapLibre style expressions have no date parser, and the marker color is an
expression over that number.

## Conventions

- Tailwind's spacing scale is set to `--spacing: 1px`, so `p-16` is 16px and every
  utility matches `DESIGN.md` literally. Stay on the documented steps.
- Colors come from tokens only. A hex literal in a component is a bug.
- `components/ui/` knows nothing about fires; if a primitive imports `lib/types.ts`,
  it belongs in a domain folder.
- Every list ships loading, empty, error and loaded states. An empty region is
  designed copy, never a blank div.
- Branches: `feat/fe-*`. The only PRs that block the other side are changes to
  `lib/types.ts` or `docs/API_CONTRACTS.md`.
