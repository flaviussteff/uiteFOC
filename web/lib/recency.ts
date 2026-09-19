import type { FireIncident } from "./types";

/**
 * Recency is computed on the client, never sent by the backend: a tab left open
 * for an hour must re-bucket its markers without a refetch.
 */
export type RecencyBucket = 0 | 1 | 2 | 3;

const SIX_HOURS = 6 * 3600_000;
const ONE_DAY = 24 * 3600_000;
const THREE_DAYS = 3 * ONE_DAY;

export const RECENCY_LABELS: Record<RecencyBucket, string> = {
  0: "sub 6 ore",
  1: "6–24 ore",
  2: "1–3 zile",
  3: "peste 3 zile",
};

export const RECENCY_LEGEND_LABELS: Record<RecencyBucket, string> = {
  0: "<6h",
  1: "6–24h",
  2: "24h–3z",
  3: ">3z",
};

/** Tailwind class fragments, so the ramp is never inlined as a hex literal. */
export const RECENCY_TEXT: Record<RecencyBucket, string> = {
  0: "text-recency-0",
  1: "text-recency-1",
  2: "text-recency-2",
  3: "text-recency-3",
};

export const RECENCY_BG: Record<RecencyBucket, string> = {
  0: "bg-recency-0",
  1: "bg-recency-1",
  2: "bg-recency-2",
  3: "bg-recency-3",
};

export function recencyBucket(detectedAt: string, now = Date.now()): RecencyBucket {
  const age = now - new Date(detectedAt).getTime();
  if (age < SIX_HOURS) return 0;
  if (age < ONE_DAY) return 1;
  if (age < THREE_DAYS) return 2;
  return 3;
}

/** An extinguished fire always reads as stale, whatever its timestamp says. */
export function incidentRecency(incident: FireIncident, now = Date.now()): RecencyBucket {
  if (incident.status === "extinguished") return 3;
  return recencyBucket(incident.detectedAt, now);
}
