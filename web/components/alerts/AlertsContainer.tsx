"use client";

import { useState } from "react";
import { AlertBanner } from "./AlertBanner";
import type { ProximityAlert } from "@/lib/types";

const MAX_VISIBLE = 3;

/**
 * Stacks proximity alerts, newest first. Past three it collapses to a count —
 * a stack of eight banners is a stack nobody reads, which is worse than one.
 */
export function AlertsContainer({
  alerts,
  onView,
}: {
  alerts: ProximityAlert[];
  onView?: (incidentId: string) => void;
}) {
  const [dismissed, setDismissed] = useState<string[]>([]);
  const [expanded, setExpanded] = useState(false);

  const live = alerts.filter((a) => !dismissed.includes(a.alertId));
  if (live.length === 0) return null;

  const visible = expanded ? live : live.slice(0, MAX_VISIBLE);
  const hidden = live.length - visible.length;

  return (
    <section aria-label="Alerte de proximitate" className="flex flex-col gap-8">
      {visible.map((alert) => (
        <AlertBanner
          key={alert.alertId}
          alert={alert}
          onView={onView}
          onDismiss={(id) => setDismissed((d) => [...d, id])}
        />
      ))}

      {hidden > 0 && (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="rounded-xl bg-paper-white px-16 py-12 text-left text-[13px] font-medium text-slate shadow-subtle-2 hover:bg-fog-gray"
        >
          încă {hidden} {hidden === 1 ? "incendiu" : "incendii"} în zona ta
        </button>
      )}
    </section>
  );
}
