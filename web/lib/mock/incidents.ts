import type { EnvironmentSnapshot, FireIncident, ProximityAlert } from "../types";

/**
 * Fixtures shaped exactly like docs/API_CONTRACTS.md, so the UI can be built and
 * reviewed before the backend exists. Timestamps are relative to load time — the
 * recency ramp has to be visibly doing something in a screenshot.
 */
const now = Date.now();
const ago = (minutes: number) => new Date(now - minutes * 60_000).toISOString();

function incident(partial: Partial<FireIncident> & Pick<FireIncident, "id" | "location" | "detectedAt" | "admin">): FireIncident {
  return {
    updatedAt: partial.detectedAt,
    source: "firms",
    status: "active",
    confidence: 0.8,
    verified: true,
    geometry: null,
    areaHa: null,
    metrics: { brightnessK: null, frpMw: null, scanTrackKm: null },
    title: null,
    summary: null,
    sourceRef: {
      provider: "NASA FIRMS VIIRS SNPP",
      url: null,
      externalId: `mock_${partial.id}`,
      fetchedAt: partial.detectedAt,
    },
    media: [],
    relatedIds: [],
    ...partial,
  };
}

export const MOCK_INCIDENTS: FireIncident[] = [
  incident({
    id: "inc_mock_01",
    location: { lat: 45.5921, lon: 25.4587 },
    detectedAt: ago(22),
    admin: { county: "Brașov", countyCode: "BV", locality: "Râșnov", siruta: 40232 },
    confidence: 0.91,
    areaHa: 14.2,
    metrics: { brightnessK: 331.4, frpMw: 12.8, scanTrackKm: [1.1, 1.0] },
    title: "Incendiu de vegetație lângă Râșnov",
  }),
  incident({
    id: "inc_mock_02",
    location: { lat: 45.5152, lon: 25.3672 },
    detectedAt: ago(140),
    admin: { county: "Brașov", countyCode: "BV", locality: "Bran", siruta: 40358 },
    source: "news",
    confidence: 0.64,
    areaHa: 3.0,
    title: "Pompierii intervin pe un teren viran la Bran",
    sourceRef: {
      provider: "Monitorul de Brașov",
      url: "https://example.ro/stire",
      externalId: "mock_news_02",
      fetchedAt: ago(130),
    },
  }),
  incident({
    id: "inc_mock_03",
    location: { lat: 45.5644, lon: 25.315 },
    detectedAt: ago(9 * 60),
    admin: { county: "Brașov", countyCode: "BV", locality: "Zărnești", siruta: 40465 },
    confidence: 0.77,
    areaHa: 27.4,
    status: "contained",
  }),
  incident({
    id: "inc_mock_04",
    location: { lat: 44.9312, lon: 26.0281 },
    detectedAt: ago(30 * 60),
    admin: { county: "Prahova", countyCode: "PH", locality: "Ploiești", siruta: 130534 },
    source: "user",
    confidence: 0.42,
    status: "unverified",
    verified: false,
  }),
  incident({
    id: "inc_mock_05",
    location: { lat: 46.7712, lon: 23.5901 },
    detectedAt: ago(96 * 60),
    admin: { county: "Cluj", countyCode: "CJ", locality: "Florești", siruta: 56964 },
    confidence: 0.88,
    areaHa: 61.0,
    status: "extinguished",
  }),
];

export const MOCK_ENVIRONMENT: EnvironmentSnapshot = {
  location: { lat: 45.5921, lon: 25.4587 },
  observedAt: ago(35),
  provider: "Open-Meteo",
  wind: {
    speedMs: 6.4,
    gustMs: 11.2,
    directionDeg: 214,
    directionCardinal: "SV",
    trend: "rising",
  },
  temperature: { airC: 29.4, dewPointC: 8.1, humidityPct: 24 },
  precipitation: {
    last24hMm: 0,
    last7dMm: 1.2,
    daysSinceRain: 11,
    dailyMm: [0, 0, 0, 1.2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  },
  airQuality: {
    aqi: 128,
    scale: "us-epa",
    category: "unhealthy_sensitive",
    dominant: "pm25",
    pm25: 41.2,
    pm10: 68,
    observedAt: ago(95),
  },
};

export const MOCK_ALERTS: ProximityAlert[] = [
  {
    alertId: "alr_mock_01",
    incidentId: "inc_mock_01",
    issuedAt: ago(20),
    distanceM: 7400,
    bearingDeg: 118,
    severity: "high",
    headline: "Incendiu la 7,4 km de tine",
    body: "Vegetație uscată lângă Râșnov, detectat acum 20 de minute.",
    incident: MOCK_INCIDENTS[0],
    actions: [
      { id: "view", label: "Vezi pe hartă", href: "/harta?incident=inc_mock_01" },
      { id: "dismiss", label: "Renunță" },
    ],
  },
];
