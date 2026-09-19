"use client";

import { IncidentRow } from "./IncidentRow";
import { EmptyState, ErrorState, Skeleton } from "@/components/ui/States";
import type { FireIncident } from "@/lib/types";

/**
 * The accessible equivalent of the marker layer: everything visible on the map
 * is reachable here by keyboard, with its status as text. If the map dies, this
 * keeps working.
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
  if (loading) {
    return (
      <div className="flex flex-col gap-8" aria-busy="true">
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} className="h-72" />
        ))}
      </div>
    );
  }

  if (error) {
    return <ErrorState body="Lista de incidente nu a putut fi încărcată." onRetry={onRetry} />;
  }

  if (incidents.length === 0) {
    return (
      <EmptyState
        title="Niciun incendiu activ în zona vizibilă"
        body="Mărește zona hărții sau schimbă perioada din bara de jos."
      />
    );
  }

  return (
    <ul className="flex flex-col gap-8">
      {incidents.map((incident) => (
        <li key={incident.id}>
          <IncidentRow
            incident={incident}
            selected={selectedId === incident.id}
            onSelect={onSelect}
            onHover={onHover}
          />
        </li>
      ))}
    </ul>
  );
}
