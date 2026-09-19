"use client";

import { SeverityBadge, StatusPill } from "./SeverityBadge";
import { area, coords, relativeTime, SOURCE_LABELS } from "@/lib/format";
import { incidentRecency } from "@/lib/recency";
import type { FireIncident } from "@/lib/types";

/** Confidence as ten countable cells — a read-off, not a decoration. */
function ConfidenceCells({ value }: { value: number }) {
  const lit = Math.round(value * 10);

  return (
    <span className="flex items-center gap-4" title={`Încredere model: ${value.toFixed(2)}`}>
      <span className="flex gap-[1px]" aria-hidden="true">
        {Array.from({ length: 10 }, (_, i) => (
          <span
            key={i}
            className={`h-6 w-3 ${i < lit ? "bg-graphite" : "bg-linen"}`}
          />
        ))}
      </span>
      <span className="font-mono text-[10px] tabular text-slate">{value.toFixed(2)}</span>
    </span>
  );
}

/**
 * One incident, set as a log line rather than a card.
 *
 * Left gutter carries the row index and the severity badge; the body is two
 * monospace lines of field data. Square corners and a hairline separator — the
 * row belongs to a table, not to a stack of floating chips.
 */
export function IncidentRow({
  incident,
  index,
  selected = false,
  onSelect,
  onHover,
}: {
  incident: FireIncident;
  index: number;
  selected?: boolean;
  onSelect?: (id: string) => void;
  onHover?: (id: string | null) => void;
}) {
  const bucket = incidentRecency(incident);
  const place = incident.admin.locality
    ? `${incident.admin.locality}, ${incident.admin.countyCode}`
    : incident.admin.county;

  return (
    <button
      type="button"
      onClick={() => onSelect?.(incident.id)}
      onMouseEnter={() => onHover?.(incident.id)}
      onMouseLeave={() => onHover?.(null)}
      onFocus={() => onHover?.(incident.id)}
      onBlur={() => onHover?.(null)}
      aria-pressed={selected}
      className={`flex w-full gap-8 border-l-2 px-8 py-8 text-left transition-colors ${
        selected
          ? "border-l-midnight-ink bg-sunlit-cream/40"
          : "border-l-transparent hover:bg-parchment"
      }`}
    >
      <span className="flex flex-col items-center gap-4 pt-1">
        <span className="font-mono text-[9px] tabular text-ash-gray">
          {String(index + 1).padStart(2, "0")}
        </span>
        <SeverityBadge
          bucket={bucket}
          unverified={!incident.verified}
          status={incident.status}
        />
      </span>

      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-6">
          <span className="truncate text-[13px] font-semibold tracking-[-0.01em]">
            {place}
          </span>
          <span className="ml-auto shrink-0">
            <StatusPill status={incident.status} />
          </span>
        </span>

        <span className="mt-2 block font-mono text-[10px] tabular text-slate">
          {coords(incident.location)} · {area(incident.areaHa)}
        </span>

        <span className="mt-4 flex items-center gap-8">
          <ConfidenceCells value={incident.confidence} />
          <span className="ml-auto font-mono text-[9px] uppercase tracking-[0.06em] text-ash-gray">
            {SOURCE_LABELS[incident.source] ?? incident.source}
          </span>
        </span>

        <span className="mt-2 block font-mono text-[9px] text-ash-gray">
          {relativeTime(incident.detectedAt)} · {incident.id}
        </span>
      </span>
    </button>
  );
}
