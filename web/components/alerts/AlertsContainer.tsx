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
    <section aria-label="Alerte de proximitate" className="flex flex-col gap-6">
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
          className="border border-rule bg-paper-white px-8 py-6 text-left font-mono text-[10px] uppercase tracking-[0.08em] text-slate hover:bg-parchment"
        >
          + {hidden} {hidden === 1 ? "incendiu" : "incendii"} în raza setată
        </button>
      )}
    </section>
  );
}
