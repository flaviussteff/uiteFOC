import { RECENCY_BG, RECENCY_LEGEND_LABELS, type RecencyBucket } from "@/lib/recency";
import type { RiskLegendEntry } from "@/lib/types";

const BUCKETS: RecencyBucket[] = [0, 1, 2, 3];

const RISK_BG = [
  "bg-risk-1",
  "bg-risk-2",
  "bg-risk-3",
  "bg-risk-4",
  "bg-risk-5",
] as const;

/**
 * Bottom-left map overlay. Two variants because the two maps never share a ramp:
 * recency on /harta, FDI classes on /risc.
 */
export function MapLegend({
  variant = "recency",
  riskLegend,
}: {
  variant?: "recency" | "risk";
  /** Comes from the backend so thresholds can be recalibrated without a deploy. */
  riskLegend?: RiskLegendEntry[];
}) {
  return (
    <div className="rounded-xl bg-paper-white/92 p-12 shadow-overlay backdrop-blur-sm">
      <p className="mb-8 text-[11px] font-medium uppercase tracking-[0.25px] text-ash-gray">
        {variant === "recency" ? "Detectat" : "Risc de incendiu"}
      </p>

      <ul className="flex items-start gap-12">
        {variant === "recency"
          ? BUCKETS.map((bucket) => (
              <li key={bucket} className="flex flex-col items-center gap-4">
                <span className={`size-8 rounded-full ${RECENCY_BG[bucket]}`} aria-hidden="true" />
                <span className="font-mono text-[11px] text-slate">
                  {RECENCY_LEGEND_LABELS[bucket]}
                </span>
              </li>
            ))
          : (riskLegend ?? []).map((entry) => (
              <li key={entry.class} className="flex flex-col items-center gap-4">
                <span
                  className={`size-8 rounded-full ${RISK_BG[entry.class - 1]}`}
                  aria-hidden="true"
                />
                <span className="font-mono text-[11px] text-slate">{entry.label}</span>
              </li>
            ))}
      </ul>
    </div>
  );
}
