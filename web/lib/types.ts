/**
 * Data contracts between the frontend and the backend.
 * Prose version with examples: ../../docs/API_CONTRACTS.md
 *
 * Rules that hold everywhere in this file:
 *  - timestamps are ISO 8601 UTC strings
 *  - units are SI and named in the field (speedMs, areaHa, brightnessK)
 *  - confidence is 0..1, never a percentage
 *  - "may be absent" is null, never "" or 0
 */

export type IsoDateTime = string; // "2026-09-19T14:32:00Z"
export type IsoDate = string; // "2026-09-19"

export interface GeoPoint {
  lat: number;
  lon: number;
}

/** [west, south, east, north] */
export type BBox = [number, number, number, number];

export interface GeoJsonPolygon {
  type: "Polygon";
  coordinates: number[][][];
}

export interface GeoJsonMultiPolygon {
  type: "MultiPolygon";
  coordinates: number[][][][];
}

/* ------------------------------------------------------------------ *
 * 1. Fire incident
 * ------------------------------------------------------------------ */

export type FireSource = "firms" | "news" | "user" | "cv" | "manual";
export type FireStatus = "active" | "contained" | "extinguished" | "unverified";

export interface AdminArea {
  county: string;
  /** ISO 3166-2:RO without the RO- prefix, e.g. "BV" */
  countyCode: string;
  locality: string | null;
  siruta: number | null;
}

export interface MediaRef {
  id: string;
  kind: "image" | "video";
  url: string;
  thumbUrl: string;
  width: number;
  height: number;
  capturedAt: IsoDateTime | null;
  attribution: string;
}

export interface FireIncident {
  id: string;
  location: GeoPoint;
  detectedAt: IsoDateTime;
  updatedAt: IsoDateTime;
  source: FireSource;
  status: FireStatus;
  confidence: number;
  verified: boolean;
  admin: AdminArea;
  geometry: GeoJsonPolygon | null;
  areaHa: number | null;
  metrics: {
    brightnessK: number | null;
    frpMw: number | null;
    scanTrackKm: [number, number] | null;
  };
  title: string | null;
  summary: string | null;
  sourceRef: {
    provider: string;
    url: string | null;
    externalId: string;
    fetchedAt: IsoDateTime;
  };
  media: MediaRef[];
  relatedIds: string[];
}

export interface Paginated<T> {
  items: T[];
  nextCursor: string | null;
  total: number;
}

export interface IncidentListResponse extends Paginated<FireIncident> {
  generatedAt: IsoDateTime;
  bbox: BBox;
}

/** Properties the map layer reads inside MapLibre style expressions. */
export interface IncidentFeatureProperties {
  id: string;
  /** epoch ms — style expressions cannot parse ISO strings */
  detectedAtMs: number;
  source: FireSource;
  status: FireStatus;
  confidence: number;
  areaHa: number | null;
  county: string;
  locality: string | null;
}

/* ------------------------------------------------------------------ *
 * 2. Environment
 * ------------------------------------------------------------------ */

export type AqiCategory =
  | "good"
  | "moderate"
  | "unhealthy_sensitive"
  | "unhealthy"
  | "very_unhealthy"
  | "hazardous";

export interface WindObservation {
  speedMs: number;
  gustMs: number | null;
  /** Meteorological convention: the direction the wind blows FROM. */
  directionDeg: number;
  /** Pre-localized cardinal, rendered verbatim. */
  directionCardinal: string;
  trend: "rising" | "steady" | "falling" | null;
}

export interface AirQuality {
  aqi: number;
  scale: "eaqi" | "us-epa";
  category: AqiCategory;
  dominant: string;
  pm25: number | null;
  pm10: number | null;
  observedAt: IsoDateTime;
}

export interface EnvironmentSnapshot {
  location: GeoPoint;
  observedAt: IsoDateTime;
  provider: string;
  wind: WindObservation;
  temperature: { airC: number; dewPointC: number | null; humidityPct: number };
  precipitation: {
    last24hMm: number;
    last7dMm: number;
    daysSinceRain: number;
    /** Oldest first, one entry per day, 14 expected. null when unavailable. */
    dailyMm: number[] | null;
  };
  airQuality: AirQuality | null;
}

export interface WindField {
  observedAt: IsoDateTime;
  bbox: BBox;
  resolutionDeg: number;
  grid: { rows: number; cols: number; u: number[]; v: number[] };
}

/* ------------------------------------------------------------------ *
 * 3. Spread prediction
 * ------------------------------------------------------------------ */

export interface SpreadHorizon {
  minutes: number;
  confidence: number;
  geometry: GeoJsonPolygon;
}

export interface SpreadPrediction {
  incidentId: string;
  generatedAt: IsoDateTime;
  model: { name: string; version: string };
  basedOn: { windObservedAt: IsoDateTime; fuelModel: string };
  horizons: SpreadHorizon[];
  smokePlume: { bearingDeg: number; geometry: GeoJsonPolygon } | null;
  /** Rendered verbatim next to the overlay legend. */
  disclaimer: string;
}

/* ------------------------------------------------------------------ *
 * 4. Fire Danger Index
 * ------------------------------------------------------------------ */

export type RiskClass = 1 | 2 | 3 | 4 | 5;

export interface RiskLegendEntry {
  class: RiskClass;
  label: string;
  fwiMin: number;
  fwiMax: number | null;
}

export interface RiskCellProperties {
  cellId: string;
  fwi: number;
  class: RiskClass;
  components: { ffmc: number; dmc: number; dc: number; isi: number; bui: number };
}

export interface RiskGrid {
  date: IsoDate;
  generatedAt: IsoDateTime;
  model: string;
  resolutionDeg: number;
  legend: RiskLegendEntry[];
  cells: {
    type: "FeatureCollection";
    features: Array<{
      type: "Feature";
      geometry: GeoJsonPolygon;
      properties: RiskCellProperties;
    }>;
  };
}

/* ------------------------------------------------------------------ *
 * 5. Media & detection
 * ------------------------------------------------------------------ */

export type MediaStatus = "processing" | "done" | "failed" | "rejected";
export type DetectionVerdict = "fire" | "smoke" | "both" | "none" | "inconclusive";

export interface DetectionBox {
  label: string;
  confidence: number;
  /** [x, y, w, h] normalized 0..1, origin top-left. */
  bbox: [number, number, number, number];
}

export interface ExifReadout {
  present: boolean;
  capturedAt: IsoDateTime | null;
  gps: (GeoPoint & { accuracyM: number | null }) | null;
  device: string | null;
  orientation: number | null;
}

export interface MediaAnalysis {
  mediaId: string;
  status: MediaStatus;
  kind: "image" | "video";
  url: string;
  thumbUrl: string;
  dimensions: { width: number; height: number };
  detection: {
    verdict: DetectionVerdict;
    confidence: number;
    model: { name: string; version: string };
    processedAt: IsoDateTime;
    boxes: DetectionBox[];
    frameIndex: number | null;
  } | null;
  exif: ExifReadout;
  validation: {
    gpsMatchesReported: boolean | null;
    distanceFromReportedM: number | null;
    capturedWithinWindow: boolean | null;
    flags: string[];
  };
  linkedIncidentId: string | null;
}

/* ------------------------------------------------------------------ *
 * 6. Proximity alerts
 * ------------------------------------------------------------------ */

export type AlertSeverity = "moderate" | "high" | "critical";

export interface ProximityAlert {
  alertId: string;
  incidentId: string;
  issuedAt: IsoDateTime;
  distanceM: number;
  bearingDeg: number;
  severity: AlertSeverity;
  headline: string;
  body: string;
  /** Embedded in full so a push banner renders with no network. */
  incident: FireIncident;
  actions: Array<{ id: string; label: string; href?: string }>;
}

export interface AlertSubscription {
  pushSubscription: unknown;
  location: GeoPoint & { accuracyM: number | null };
  radiusKm: number;
  minSeverity: "any" | "moderate" | "high";
  quietHours: { fromHour: number; toHour: number } | null;
}

/* ------------------------------------------------------------------ *
 * 7. Zone history
 * ------------------------------------------------------------------ */

export interface ZoneHistory {
  zone: {
    kind: "county" | "radius";
    code: string;
    name: string;
    geometry: GeoJsonMultiPolygon | null;
  };
  range: { from: IsoDate; to: IsoDate };
  summary: {
    totalIncidents: number;
    totalAreaHa: number;
    largestIncident: { id: string; areaHa: number; detectedAt: IsoDateTime } | null;
    peakMonth: number | null;
    trend: "increasing" | "stable" | "decreasing" | null;
  };
  byYear: Array<{
    year: number;
    count: number;
    areaHa: number;
    /** Always 12 entries, January first, zero-filled. */
    byMonth: number[];
  }>;
  incidents: Paginated<FireIncident>;
}

/* ------------------------------------------------------------------ *
 * 8. Satellite feed
 * ------------------------------------------------------------------ */

export interface SatelliteDetection {
  lat: number;
  lon: number;
  acquiredAt: IsoDateTime;
  brightnessK: number;
  frpMw: number;
  confidence: "low" | "nominal" | "high";
  daynight: "D" | "N";
  scanKm: number;
  trackKm: number;
  incidentId: string | null;
}

export interface SatelliteFeed {
  provider: string;
  instrument: string;
  fetchedAt: IsoDateTime;
  /** Required by the data policy — rendered verbatim under the map. */
  attribution: string;
  detections: SatelliteDetection[];
}

/* ------------------------------------------------------------------ *
 * Errors
 * ------------------------------------------------------------------ */

export interface ApiError {
  error: { code: string; message: string; details?: Record<string, unknown> };
}
