import { RECENCY_LEGEND_LABELS, type RecencyBucket } from "@/lib/recency";
import type { FireIncident } from "@/lib/types";

/**
 * Severity badge — replaces the generic coloured dot.
 *
 * Three stacked chevrons, filled from the top down: three for a fire detected
 * in the last six hours, none for one older than three days. Colour repeats the
 * recency ramp, but the glyph carries the same information on its own, so the
 * badge still reads in grayscale or with colour-vision deficiency. An
 * unverified incident gets a diagonal hatch behind the glyph — a texture, not
 * another colour, because the colour channel is already spoken for.
 */

const STROKE: Record<RecencyBucket, string> = {
  0: "text-recency-0",
  1: "text-recency-1",
  2: "text-recency-2",
  3: "text-recency-3",
};

export function SeverityBadge({
  bucket,
  unverified = false,
  status,
}: {
  bucket: RecencyBucket;
  unverified?: boolean;
  status?: FireIncident["status"];
}) {
  const filled = 3 - bucket;

  return (
    <span
      className={`relative flex size-24 shrink-0 items-center justify-center border border-rule bg-parchment ${STROKE[bucket]}`}
      role="img"
      aria-label={`Detectat ${RECENCY_LEGEND_LABELS[bucket]}${unverified ? ", neverificat" : ""}`}
      title={`clasa T${bucket} · ${RECENCY_LEGEND_LABELS[bucket]}${status ? ` · ${status}` : ""}`}
    >
      {unverified && (
        <span className="hatch absolute inset-0 text-ash-gray opacity-45" aria-hidden="true" />
      )}

      <svg width="12" height="14" viewBox="0 0 12 14" aria-hidden="true" className="relative">
        {[0, 1, 2].map((i) => (
          <path
            key={i}
            d={`M1.5 ${11.5 - i * 4.2} L6 ${7.3 - i * 4.2} L10.5 ${11.5 - i * 4.2}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="square"
            opacity={i < filled ? 1 : 0.16}
          />
        ))}
      </svg>
    </span>
  );
}

/**
 * Status pill. Square, hairline, monospace — the same information a coloured
 * SaaS chip would carry, set as a field code instead of a decoration.
 */
export function StatusPill({ status }: { status: FireIncident["status"] }) {
  const STYLES: Record<FireIncident["status"], string> = {
    active: "border-recency-0 text-recency-0",
    contained: "border-forest-pulse text-forest-pulse",
    extinguished: "border-rule-strong text-ash-gray",
    unverified: "border-rule-strong text-stone",
  };

  const LABELS: Record<FireIncident["status"], string> = {
    active: "ACTIV",
    contained: "CONTROL",
    extinguished: "STINS",
    unverified: "NEVERIF",
  };

  return (
    <span
      className={`border px-3 font-mono text-[9px] font-medium leading-[13px] tracking-[0.08em] ${STYLES[status]}`}
    >
      {LABELS[status]}
    </span>
  );
}
