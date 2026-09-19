# uiteFOC — Data Contracts

This is the frontier between the two branches. The UI does not care how a payload is
produced; it cares that these shapes never change silently. Any change here is a PR
we both review.

## Conventions

- **Time** — ISO 8601 with explicit offset, always UTC: `"2026-09-19T14:32:00Z"`.
  The UI formats to `Europe/Bucharest` for display. Never send a pre-formatted date.
- **Coordinates** — WGS84, `lat` / `lon` as numbers, in that order in objects and
  `[lon, lat]` in GeoJSON (GeoJSON order is the standard's, not ours).
- **Numbers** — SI units, never strings: metres, m/s, hectares, degrees, Kelvin.
  Unit suffixes live in the field name (`speedMs`, `areaHa`, `brightnessK`).
- **Nullability** — a field that may be absent is `null`, never `""`, `0`, or omitted.
  Optional *keys* mean "this API version may not send it"; `null` means "we asked and
  there is no value".
- **Enums** — lowercase snake or kebab strings, never integers. The UI switch has a
  `default` arm that renders an "unknown" state rather than crashing.
- **Confidence** — always `0..1` float, never a percentage. The UI multiplies.
- **Pagination** — cursor-based: `{ items, nextCursor, total }`. `nextCursor: null`
  ends the list.
- **Errors** — every non-2xx response is
  `{ error: { code: string, message: string, details?: object } }`. `code` is stable
  and machine-readable; `message` is Romanian and shown to the user as a fallback.

---

## 1. Fire incident

The central object. Everything on the incident map is one of these, whatever produced it.

```jsonc
{
  "id": "inc_01J8F3Q2K9",
  "location": { "lat": 45.6421, "lon": 25.5887 },
  "detectedAt": "2026-09-19T11:04:00Z",
  "updatedAt":  "2026-09-19T14:32:00Z",
  "source": "firms",                    // firms | news | user | cv | manual
  "status": "active",                   // active | contained | extinguished | unverified
  "confidence": 0.91,                   // 0..1
  "verified": true,                     // human or cross-source confirmed
  "admin": {
    "county": "Brașov",
    "countyCode": "BV",                 // ISO 3166-2:RO without the RO- prefix
    "locality": "Râșnov",               // null when only the county is known
    "siruta": 40232                     // null when unresolved
  },
  "geometry": {                         // null for point-only detections
    "type": "Polygon",
    "coordinates": [[[25.58, 45.64], [25.59, 45.64], [25.59, 45.65], [25.58, 45.64]]]
  },
  "areaHa": 14.2,                       // null when unknown
  "metrics": {
    "brightnessK": 331.4,               // FIRMS brightness, null for non-satellite
    "frpMw": 12.8,                      // fire radiative power
    "scanTrackKm": [1.1, 1.0]           // FIRMS footprint, null otherwise
  },
  "title": "Incendiu de vegetație în apropiere de Râșnov",   // null for raw detections
  "summary": "Aproximativ 14 ha de pășune, intervin trei autospeciale.",  // null
  "sourceRef": {
    "provider": "NASA FIRMS VIIRS SNPP",  // or the outlet name, or "utilizator"
    "url": "https://firms.modaps.eosdis.nasa.gov/...",   // null for user reports
    "externalId": "VIIRS_20260919_1104_45.64_25.58",
    "fetchedAt": "2026-09-19T11:22:00Z"
  },
  "media": [
    { "id": "med_7K2", "kind": "image", "url": "https://.../med_7K2.jpg",
      "thumbUrl": "https://.../med_7K2_320.jpg", "width": 1920, "height": 1080,
      "capturedAt": "2026-09-19T11:02:00Z", "attribution": "utilizator" }
  ],
  "relatedIds": ["inc_01J8F3Q1AA"]      // deduplicated siblings, [] when none
}
```

**What the UI derives, so the backend must not send it:** the recency bucket, the
marker color, "acum 2 ore", the distance to the user, and the confidence percentage.
Send `detectedAt` and coordinates; the client computes the rest, because it must stay
correct while the tab sits open for an hour.

### List response

`GET /api/incidents?bbox=20.2,43.6,29.7,48.3&since=2026-09-12T00:00:00Z&source=firms,news&limit=500`

```jsonc
{
  "items": [ /* FireIncident[] */ ],
  "nextCursor": "eyJvIjo1MDB9",
  "total": 1284,
  "generatedAt": "2026-09-19T14:35:02Z",
  "bbox": [20.2, 43.6, 29.7, 48.3]
}
```

### GeoJSON response (what the map layer consumes directly)

`GET /api/incidents.geojson?...` — same filters, MapLibre-ready:

```jsonc
{
  "type": "FeatureCollection",
  "features": [{
    "type": "Feature",
    "id": "inc_01J8F3Q2K9",
    "geometry": { "type": "Point", "coordinates": [25.5887, 45.6421] },
    "properties": {
      "id": "inc_01J8F3Q2K9",
      "detectedAtMs": 1789305840000,   // epoch ms — MapLibre expressions can't parse ISO
      "source": "firms",
      "status": "active",
      "confidence": 0.91,
      "areaHa": 14.2,
      "county": "Brașov",
      "locality": "Râșnov"
    }
  }]
}
```

`detectedAtMs` exists because the marker color is computed inside a MapLibre style
expression (`["interpolate", ["linear"], ["-", ["literal", now], ["get","detectedAtMs"]], ...]`),
and style expressions have no date parser. It is the one denormalized field we accept.

### Realtime stream

`GET /api/incidents/stream` (SSE). Events: `incident.created`, `incident.updated`,
`incident.resolved`. `data` is a full `FireIncident`, never a diff — the client
replaces by `id` and never has to reconcile a partial.

---

## 2. Environmental data

`GET /api/environment?lat=45.64&lon=25.58`

```jsonc
{
  "location": { "lat": 45.6421, "lon": 25.5887 },
  "observedAt": "2026-09-19T14:00:00Z",
  "provider": "Open-Meteo",
  "wind": {
    "speedMs": 6.4,
    "gustMs": 11.2,
    "directionDeg": 214,        // meteorological: the direction the wind comes FROM
    "directionCardinal": "SV",  // pre-localized, the UI uses it verbatim
    "trend": "rising"           // rising | steady | falling | null
  },
  "temperature": { "airC": 29.4, "dewPointC": 8.1, "humidityPct": 24 },
  "precipitation": {
    "last24hMm": 0.0,
    "last7dMm": 1.2,
    "daysSinceRain": 11,
    "dailyMm": [0,0,1.2,0,0,0,0,0,0,0,0,0,0,0]   // oldest first, 14 days, null if unavailable
  },
  "airQuality": {
    "aqi": 128,
    "scale": "eaqi",            // eaqi | us-epa
    "category": "unhealthy_sensitive",  // good | moderate | unhealthy_sensitive | unhealthy | very_unhealthy | hazardous
    "dominant": "pm25",
    "pm25": 41.2,
    "pm10": 68.0,
    "observedAt": "2026-09-19T13:00:00Z"
  }
}
```

`directionDeg` is the meteorological convention — wind *from* 214° blows *toward* 34°.
The arrow glyph in `WindRose` rotates by `directionDeg + 180`. Stating this here is
the whole reason the field is not just called `direction`.

### Wind field (map overlay)

`GET /api/environment/wind-field?bbox=...&resolution=0.25`

```jsonc
{
  "observedAt": "2026-09-19T14:00:00Z",
  "bbox": [20.2, 43.6, 29.7, 48.3],
  "resolutionDeg": 0.25,
  "grid": {
    "rows": 19, "cols": 38,
    "u": [ /* rows*cols floats, eastward m/s, row-major from NW */ ],
    "v": [ /* rows*cols floats, northward m/s */ ]
  }
}
```

Flat typed arrays, not an array of objects — a 0.25° grid over Romania is ~700 cells
and nested objects would triple the payload for no gain.

---

## 3. Spread prediction

`GET /api/incidents/{id}/spread`

```jsonc
{
  "incidentId": "inc_01J8F3Q2K9",
  "generatedAt": "2026-09-19T14:30:00Z",
  "model": { "name": "spread-rf", "version": "0.3.1" },
  "basedOn": { "windObservedAt": "2026-09-19T14:00:00Z", "fuelModel": "grass" },
  "horizons": [
    { "minutes": 60,  "confidence": 0.74,
      "geometry": { "type": "Polygon", "coordinates": [[[ /* ... */ ]]] } },
    { "minutes": 180, "confidence": 0.51,
      "geometry": { "type": "Polygon", "coordinates": [[[ /* ... */ ]]] } },
    { "minutes": 360, "confidence": 0.29,
      "geometry": { "type": "Polygon", "coordinates": [[[ /* ... */ ]]] } }
  ],
  "smokePlume": {                       // null when not modelled
    "bearingDeg": 34,
    "geometry": { "type": "Polygon", "coordinates": [[[ /* ... */ ]]] }
  },
  "disclaimer": "Estimare automată. Nu înlocuiește informarea oficială ISU."
}
```

`confidence` per horizon drives the overlay's fill opacity, so the 6-hour ring is
visibly a guess. The UI renders `disclaimer` verbatim next to the legend — it is not
optional chrome, and it comes from the backend so the wording can change without a
frontend deploy.

---

## 4. Fire Danger Index grid

`GET /api/risk?date=2026-09-19&resolution=0.1`

```jsonc
{
  "date": "2026-09-19",
  "generatedAt": "2026-09-19T05:00:00Z",
  "model": "fwi-canadian",
  "resolutionDeg": 0.1,
  "legend": [
    { "class": 1, "label": "Scăzut",     "fwiMin": 0,    "fwiMax": 5.2 },
    { "class": 2, "label": "Moderat",    "fwiMin": 5.2,  "fwiMax": 11.2 },
    { "class": 3, "label": "Ridicat",    "fwiMin": 11.2, "fwiMax": 21.3 },
    { "class": 4, "label": "Foarte ridicat", "fwiMin": 21.3, "fwiMax": 38.0 },
    { "class": 5, "label": "Extrem",     "fwiMin": 38.0, "fwiMax": null }
  ],
  "cells": {
    "type": "FeatureCollection",
    "features": [{
      "type": "Feature",
      "geometry": { "type": "Polygon", "coordinates": [[[ /* cell */ ]]] },
      "properties": {
        "cellId": "45.6_25.5",
        "fwi": 24.6,
        "class": 4,
        "components": { "ffmc": 91.2, "dmc": 48.0, "dc": 310.5, "isi": 9.1, "bui": 61.2 }
      }
    }]
  }
}
```

`legend` travels with the data so the thresholds can be recalibrated for Romanian fuel
types without a frontend change. The UI reads `class` for color and `legend[].label`
for the text — it never hardcodes a threshold.

---

## 5. Media upload & detection

`POST /api/media` — `multipart/form-data`: `file`, plus optional
`reportedLat`, `reportedLon`, `note`.

Immediate response (processing is async):

```jsonc
{
  "mediaId": "med_7K2",
  "status": "processing",        // processing | done | failed | rejected
  "uploadedAt": "2026-09-19T14:40:00Z",
  "pollUrl": "/api/media/med_7K2",
  "estimatedSeconds": 8
}
```

`GET /api/media/{mediaId}` when done:

```jsonc
{
  "mediaId": "med_7K2",
  "status": "done",
  "kind": "image",                    // image | video
  "url": "https://.../med_7K2.jpg",
  "thumbUrl": "https://.../med_7K2_320.jpg",
  "dimensions": { "width": 1920, "height": 1080 },
  "detection": {
    "verdict": "fire",                // fire | smoke | both | none | inconclusive
    "confidence": 0.87,
    "model": { "name": "yolov8n-wildfire", "version": "1.2.0" },
    "processedAt": "2026-09-19T14:40:09Z",
    "boxes": [
      { "label": "fire",  "confidence": 0.87, "bbox": [0.41, 0.52, 0.18, 0.13] },
      { "label": "smoke", "confidence": 0.62, "bbox": [0.33, 0.20, 0.40, 0.35] }
    ],
    "frameIndex": null                // video only: which frame scored highest
  },
  "exif": {
    "present": true,
    "capturedAt": "2026-09-19T14:38:12Z",
    "gps": { "lat": 45.6430, "lon": 25.5901, "accuracyM": 12 },   // null if absent
    "device": "Pixel 8",
    "orientation": 1
  },
  "validation": {
    "gpsMatchesReported": true,
    "distanceFromReportedM": 140,     // null when either side is missing
    "capturedWithinWindow": true,     // capture time vs. upload time
    "flags": []                       // e.g. ["no_exif", "gps_mismatch", "stale_capture"]
  },
  "linkedIncidentId": null            // set once promoted to an incident
}
```

`bbox` is `[x, y, w, h]` **normalized to 0..1**, origin top-left. Normalized because
the UI renders the frame at whatever width the layout gives it and must not know the
original pixel dimensions to draw a box. This is the single most breakage-prone field
in the contract — if the model outputs `[x1,y1,x2,y2]` pixels, convert on your side.

Rejection (`status: "rejected"`) carries `error.code` from:
`file_too_large` · `unsupported_format` · `no_frames_decoded` · `duplicate_upload`.

---

## 6. Proximity alerts

`POST /api/alerts/subscription`

```jsonc
{
  "pushSubscription": { /* the raw Web Push PushSubscription JSON */ },
  "location": { "lat": 45.64, "lon": 25.58, "accuracyM": 30 },
  "radiusKm": 15,
  "minSeverity": "moderate",          // any | moderate | high
  "quietHours": { "fromHour": 23, "toHour": 7 } // null to disable
}
```

Alert delivered to the UI (push payload and `GET /api/alerts/active` item):

```jsonc
{
  "alertId": "alr_44F",
  "incidentId": "inc_01J8F3Q2K9",
  "issuedAt": "2026-09-19T14:41:00Z",
  "distanceM": 7400,
  "bearingDeg": 118,
  "severity": "high",                 // moderate | high | critical
  "headline": "Incendiu la 7,4 km de tine",
  "body": "Vegetație uscată lângă Râșnov, detectat acum 20 de minute.",
  "incident": { /* the full FireIncident, so the banner renders offline */ },
  "actions": [
    { "id": "view",    "label": "Vezi pe hartă", "href": "/harta?incident=inc_01J8F3Q2K9" },
    { "id": "dismiss", "label": "Renunță" }
  ]
}
```

The whole incident is embedded rather than referenced: a push can arrive while the app
is closed and the phone is on a mountain with no signal, and the banner still has to
render something true.

---

## 7. Zone history

`GET /api/history?county=BV&from=2015-01-01&to=2026-09-19`
(or `?lat=&lon=&radiusKm=` for a map click)

```jsonc
{
  "zone": { "kind": "county", "code": "BV", "name": "Brașov",
            "geometry": { "type": "MultiPolygon", "coordinates": [] } },
  "range": { "from": "2015-01-01", "to": "2026-09-19" },
  "summary": {
    "totalIncidents": 412,
    "totalAreaHa": 3180.5,
    "largestIncident": { "id": "inc_2019_BV_07", "areaHa": 640.0, "detectedAt": "2019-08-11T09:12:00Z" },
    "peakMonth": 8,
    "trend": "increasing"             // increasing | stable | decreasing | null
  },
  "byYear": [
    { "year": 2026, "count": 38, "areaHa": 291.4, "byMonth": [0,1,2,4,9,7,12,2,1,0,0,0] }
  ],
  "incidents": { "items": [ /* FireIncident[], newest first */ ], "nextCursor": null }
}
```

`byMonth` is always 12 entries, January-first, zero-filled — the chart must never
branch on a missing month.

---

## 8. Satellite detections

Satellite passes are ingested as `FireIncident` with `source: "firms"`, so the map
layer needs no second code path. The raw feed is exposed separately only for the
"Satelit" layer, which shows unclustered per-pass pixels:

`GET /api/satellite/detections?bbox=...&since=...`

```jsonc
{
  "provider": "NASA FIRMS",
  "instrument": "VIIRS_SNPP_NRT",     // VIIRS_SNPP_NRT | VIIRS_NOAA20_NRT | MODIS_NRT
  "fetchedAt": "2026-09-19T14:20:00Z",
  "attribution": "Date: NASA FIRMS. Use subject to NASA EOSDIS data policy.",
  "detections": [{
    "lat": 45.6421, "lon": 25.5887,
    "acquiredAt": "2026-09-19T11:04:00Z",
    "brightnessK": 331.4,
    "frpMw": 12.8,
    "confidence": "high",             // FIRMS enum: low | nominal | high
    "daynight": "D",
    "scanKm": 1.1, "trackKm": 1.0,
    "incidentId": "inc_01J8F3Q2K9"    // null when not yet clustered into an incident
  }]
}
```

`attribution` is rendered verbatim under the map whenever the layer is on — NASA's
data policy requires it, and hardcoding it in the frontend means it goes stale.

---

## TypeScript source of truth

Every shape above exists as an exported type in
[`web/lib/types.ts`](../web/lib/types.ts) and as a zod schema in
`web/lib/schemas.ts`. The frontend validates every response against the schema in
development and logs a structured diff on mismatch, so a contract drift shows up as a
console error on my side within one request instead of as a blank panel three days later.
