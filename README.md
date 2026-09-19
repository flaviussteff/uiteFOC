# uiteFOC

Hartă de incendii pentru România: detecție prin satelit, verificare foto cu computer
vision, index zilnic de risc și alerte de proximitate.

## Ce e aici

| Cale | Ce conține |
|---|---|
| [`DESIGN.md`](./DESIGN.md) | Sistemul de design — tokens, tipografie, componente, reguli |
| [`docs/API_CONTRACTS.md`](./docs/API_CONTRACTS.md) | **Frontiera dintre cele două piste.** Formele exacte de date |
| [`docs/FRONTEND_ARCHITECTURE.md`](./docs/FRONTEND_ARCHITECTURE.md) | Structura de foldere, ierarhia de componente, rutele |
| [`docs/UI_WIREFRAMES.md`](./docs/UI_WIREFRAMES.md) | Wireframe-uri și comportament pentru ecranele principale |
| `web/` | Aplicația Next.js (pista A) |

## Cum lucrăm

Două piste paralele, care se ating într-un singur loc — contractele de date.

- **Pista A — platforma:** hartă, frontend, integrare FIRMS, scraping, alerte, PWA.
  Branch-uri `feat/fe-*`.
- **Pista B — inteligența:** computer vision, model de risc FWI, date meteo,
  predicție de propagare, backend. Branch-uri `feat/be-*`.

Nimeni nu dă push direct pe `main`. Singurele PR-uri care blochează cealaltă pistă
sunt cele care schimbă `docs/API_CONTRACTS.md` sau `web/lib/types.ts` — alea le
revizuim amândoi.

Până există backend-ul, frontend-ul citește din `web/lib/mock/` cu
`NEXT_PUBLIC_USE_MOCKS=1`. Trecerea la datele reale e o variabilă de mediu.

## Start rapid (frontend)

```bash
cd web
npm install
cp .env.example .env.local
npm run dev
```

## Surse de date

NASA FIRMS (detecții satelitare) · Open-Meteo (meteo, vânt, calitatea aerului) ·
OpenStreetMap / MapLibre (hartă).
