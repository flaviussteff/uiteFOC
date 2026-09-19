"use client";

import { useState } from "react";
import { AlertsContainer } from "@/components/alerts/AlertsContainer";
import { EnvironmentPanel } from "@/components/environment/EnvironmentPanel";
import { IncidentFeed } from "@/components/incidents/IncidentFeed";
import { RailFooter, RailHeader } from "@/components/layout/RightRail";
import { DebugProvider } from "@/components/ui/Instrument";
import { clockTime } from "@/lib/format";
import { useMapStore } from "@/stores/useMapStore";
import { MOCK_ALERTS, MOCK_ENVIRONMENT, MOCK_INCIDENTS } from "@/lib/mock/incidents";

/**
 * Rail content for /harta.
 *
 * Reads the same store the map writes to, which is why hovering a row can
 * highlight a marker without either side importing the other. The dev switch in
 * the footer force-opens every module's raw payload at once.
 */
export default function HartaRail() {
  const { selectedId, select, hover } = useMapStore();
  const [debug, setDebug] = useState(false);

  const active = MOCK_INCIDENTS.filter((i) => i.status !== "extinguished");

  return (
    <DebugProvider enabled={debug}>
      <RailHeader
        station={MOCK_ENVIRONMENT.location.lat.toFixed(2) + "," + MOCK_ENVIRONMENT.location.lon.toFixed(2)}
        at={clockTime(MOCK_ENVIRONMENT.observedAt)}
      />

      <div className="flex flex-col gap-10 p-10">
        <AlertsContainer alerts={MOCK_ALERTS} onView={select} />

        <EnvironmentPanel data={MOCK_ENVIRONMENT} />

        <IncidentFeed
          incidents={active}
          selectedId={selectedId}
          onSelect={select}
          onHover={hover}
        />
      </div>

      <RailFooter
        debug={debug}
        onToggleDebug={() => setDebug((v) => !v)}
        sources={["NASA FIRMS", "Open-Meteo", "scraper"]}
      />
    </DebugProvider>
  );
}
