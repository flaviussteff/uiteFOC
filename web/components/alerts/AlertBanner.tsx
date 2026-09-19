"use client";

import { distance, relativeTime } from "@/lib/format";
import { incidentRecency } from "@/lib/recency";
import type { ProximityAlert } from "@/lib/types";

const RAIL = ["bg-recency-0", "bg-recency-1", "bg-recency-2", "bg-recency-3"] as const;

/**
 * One proximity warning. The left rail carries the incident's recency color; the
 * distance is the largest thing on the card because it is the only number that
 * decides whether the reader has to do something.
 */
export function AlertBanner({
  alert,
  onDismiss,
  onView,
}: {
  alert: ProximityAlert;
  onDismiss?: (alertId: string) => void;
  onView?: (incidentId: string) => void;
}) {
  const bucket = incidentRecency(alert.incident);

  return (
    <article
      role="alert"
      className="flex overflow-hidden rounded-xl bg-paper-white shadow-overlay"
    >
      <span aria-hidden="true" className={`w-4 shrink-0 ${RAIL[bucket]}`} />

      <div className="flex min-w-0 flex-col gap-8 p-16">
        <div className="flex items-baseline gap-8">
          <span className="font-mono text-heading-sm font-semibold">
            {distance(alert.distanceM)}
          </span>
          <span
            aria-hidden="true"
            className="text-[14px] text-slate"
            style={{ transform: `rotate(${alert.bearingDeg}deg)`, display: "inline-block" }}
          >
            ↑
          </span>
        </div>

        <div className="min-w-0">
          <p className="truncate text-[15px] font-medium">
            {alert.incident.admin.locality ?? alert.incident.admin.county}
            {alert.incident.admin.locality ? `, ${alert.incident.admin.county}` : ""}
          </p>
          <p className="text-caption text-slate">{relativeTime(alert.incident.detectedAt)}</p>
        </div>

        <div className="flex gap-8">
          <button
            type="button"
            onClick={() => onView?.(alert.incidentId)}
            className="rounded-full border border-linen px-12 py-4 text-[13px] font-medium text-slate hover:bg-fog-gray"
          >
            Vezi pe hartă
          </button>
          <button
            type="button"
            onClick={() => onDismiss?.(alert.alertId)}
            className="rounded-full px-12 py-4 text-[13px] font-medium text-ash-gray hover:bg-fog-gray"
          >
            Renunță
          </button>
        </div>
      </div>
    </article>
  );
}
