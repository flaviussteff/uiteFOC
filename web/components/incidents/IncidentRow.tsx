"use client";

import { SeverityDot } from "./SeverityDot";
import { area, percent, relativeTime, SOURCE_LABELS } from "@/lib/format";
import { incidentRecency } from "@/lib/recency";
import { Tag } from "@/components/ui/Pill";
import type { FireIncident } from "@/lib/types";

/**
 * One incident. The same component renders in the live feed, in search results
 * and in zone history, so an incident looks identical wherever it is met.
 */
export function IncidentRow({
  incident,
  selected = false,
  onSelect,
  onHover,
}: {
  incident: FireIncident;
  selected?: boolean;
  onSelect?: (id: string) => void;
  onHover?: (id: string | null) => void;
}) {
  const bucket = incidentRecency(incident);
  const place = incident.admin.locality
    ? `${incident.admin.locality}, ${incident.admin.county}`
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
      className={`flex w-full items-start gap-12 rounded-xl p-16 text-left transition-colors ${
        selected ? "bg-paper-white shadow-sm" : "bg-paper-white hover:bg-linen"
      }`}
    >
      <span className="pt-4">
        <SeverityDot bucket={bucket} />
      </span>

      <span className="min-w-0 flex-1">
        <span className="block truncate text-[14px] font-semibold">{place}</span>
        <span className="block text-[13px] text-slate">
          {relativeTime(incident.detectedAt)} · {area(incident.areaHa)}
        </span>
      </span>

      <span className="flex shrink-0 flex-col items-end gap-4">
        <Tag>{SOURCE_LABELS[incident.source] ?? incident.source}</Tag>
        <span className="font-mono text-[11px] text-ash-gray">
          {percent(incident.confidence)}
        </span>
      </span>
    </button>
  );
}
