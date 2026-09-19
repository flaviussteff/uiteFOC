"use client";

import { AlertsContainer } from "@/components/alerts/AlertsContainer";
import { EnvironmentPanel } from "@/components/environment/EnvironmentPanel";
import { IncidentFeed } from "@/components/incidents/IncidentFeed";
import { RailSection } from "@/components/layout/RightRail";
import { useMapStore } from "@/stores/useMapStore";
import { MOCK_ALERTS, MOCK_ENVIRONMENT, MOCK_INCIDENTS } from "@/lib/mock/incidents";

/**
 * Rail content for /harta. Reads the same store the map writes to, which is why
 * hovering a row can highlight a marker without either side importing the other.
 */
export default function HartaRail() {
  const { selectedId, select, hover } = useMapStore();

  const active = MOCK_INCIDENTS.filter((i) => i.status !== "extinguished");

  return (
    <>
      <AlertsContainer alerts={MOCK_ALERTS} onView={select} />

      <RailSection title="Mediu · Râșnov">
        <EnvironmentPanel data={MOCK_ENVIRONMENT} />
      </RailSection>

      <RailSection title="Incidente active" count={active.length}>
        <IncidentFeed
          incidents={active}
          selectedId={selectedId}
          onSelect={select}
          onHover={hover}
        />
      </RailSection>
    </>
  );
}
