"use client";

import { useMemo, useState } from "react";
import { IncidentRow } from "./IncidentRow";
import { InstrumentBlock } from "@/components/ui/Instrument";
import { ErrorState, Skeleton } from "@/components/ui/States";
import type { FireIncident } from "@/lib/types";

type SortKey = "recent" | "area" | "confidence";

const SORTS: Array<{ key: SortKey; label: string }> = [
  { key: "recent", label: "recent" },
  { key: "area", label: "supraf." },
  { key: "confidence", label: "conf." },
];

/**
 * The incident table.
 *
 * This is the keyboard-accessible equivalent of the marker layer: everything on
 * the map is reachable here as text, and it keeps working if the map dies. The
 * sort control is a hairline segmented switch rather than a dropdown, so the
 * available orderings are visible without opening anything.
 */
export function IncidentFeed({
  incidents,
  loading = false,
  error = false,
  selectedId,
  onSelect,
  onHover,
  onRetry,
}: {
  incidents: FireIncident[];
  loading?: boolean;
  error?: boolean;
  selectedId?: string | null;
  onSelect?: (id: string) => void;
  onHover?: (id: string | null) => void;
  onRetry?: () => void;
}) {
  const [sort, setSort] = useState<SortKey>("recent");

  const sorted = useMemo(() => {
    const copy = [...incidents];
    if (sort === "area") copy.sort((a, b) => (b.areaHa ?? 0) - (a.areaHa ?? 0));
    else if (sort === "confidence") copy.sort((a, b) => b.confidence - a.confidence);
    else copy.sort((a, b) => Date.parse(b.detectedAt) - Date.parse(a.detectedAt));
    return copy;
  }, [incidents, sort]);

  return (
    <InstrumentBlock
      label="Incidente active"
      stamp={`n=${incidents.length}`}
      payload={incidents}
      dense
    >
      <div className="flex items-center gap-0 border-b border-rule bg-parchment px-8 py-4">
        <span className="font-mono text-[9px] uppercase tracking-[0.08em] text-ash-gray">
          sort
        </span>
        <span className="ml-8 flex divide-x divide-rule border border-rule">
          {SORTS.map((s) => (
            <button
              key={s.key}
              type="button"
              onClick={() => setSort(s.key)}
              aria-pressed={sort === s.key}
              className={`px-6 py-2 font-mono text-[9px] uppercase tracking-[0.06em] transition-colors ${
                sort === s.key
                  ? "bg-midnight-ink text-paper-white"
                  : "bg-paper-white text-slate hover:bg-linen"
              }`}
            >
              {s.label}
            </button>
          ))}
        </span>
      </div>

      {loading ? (
        <div className="flex flex-col gap-1 p-8" aria-busy="true">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-56 rounded-none" />
          ))}
        </div>
      ) : error ? (
        <ErrorState body="Lista de incidente nu a putut fi încărcată." onRetry={onRetry} />
      ) : sorted.length === 0 ? (
        <p className="px-10 py-24 text-center font-mono text-[10px] leading-relaxed text-ash-gray">
          0 incidente în zona vizibilă
          <br />
          <span className="text-stone">mărește zona sau extinde perioada</span>
        </p>
      ) : (
        <ul className="divide-y divide-rule">
          {sorted.map((incident, i) => (
            <li key={incident.id}>
              <IncidentRow
                incident={incident}
                index={i}
                selected={selectedId === incident.id}
                onSelect={onSelect}
                onHover={onHover}
              />
            </li>
          ))}
        </ul>
      )}
    </InstrumentBlock>
  );
}
