"use client";

import { distance, relativeTime } from "@/lib/format";
import { incidentRecency } from "@/lib/recency";
import type { ProximityAlert } from "@/lib/types";

const RAIL = ["bg-recency-0", "bg-recency-1", "bg-recency-2", "bg-recency-3"] as const;

/**
 * Proximity warning, set as a bulletin rather than a toast.
 *
 * The distance is the largest thing on it because it is the only number that
 * decides whether the reader has to move. The bearing is drawn as a needle in
 * the same idiom as the wind compass, so "where is it" reads the same way in
 * both places.
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
    <article role="alert" className="flex border border-midnight-ink bg-paper-white">
      <span aria-hidden="true" className={`w-3 shrink-0 ${RAIL[bucket]}`} />

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-6 border-b border-rule bg-midnight-ink px-8 py-3">
          <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-paper-white">
            alertă proximitate
          </span>
          <span className="ml-auto font-mono text-[9px] tabular text-ash-gray">
            {relativeTime(alert.issuedAt)}
          </span>
        </div>

        <div className="flex items-start gap-10 px-8 py-8">
          <div>
            <div className="flex items-baseline gap-3">
              <span className="font-mono text-[24px] font-medium leading-none tabular">
                {distance(alert.distanceM).replace(/\s?km|\s?m$/, "")}
              </span>
              <span className="font-mono text-[10px] text-slate">
                {alert.distanceM < 1000 ? "m" : "km"}
              </span>
            </div>
            <p className="mt-3 font-mono text-[9px] uppercase tracking-[0.08em] text-ash-gray">
              {String(alert.bearingDeg).padStart(3, "0")}° azimut
            </p>
          </div>

          {/* Bearing needle — same instrument idiom as the wind dial. */}
          <svg width="34" height="34" viewBox="0 0 34 34" aria-hidden="true" className="shrink-0">
            <circle cx="17" cy="17" r="15.5" fill="none" stroke="var(--color-rule)" />
            <line x1="17" y1="2.5" x2="17" y2="6" stroke="var(--color-rule-strong)" />
            <g transform={`rotate(${alert.bearingDeg} 17 17)`}>
              <line x1="17" y1="17" x2="17" y2="5" stroke="var(--color-midnight-ink)" strokeWidth="1.5" />
              <path d="M17 3 L20 9 L14 9 Z" fill="var(--color-midnight-ink)" />
            </g>
            <circle cx="17" cy="17" r="1.4" fill="var(--color-midnight-ink)" />
          </svg>

          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-semibold">
              {alert.incident.admin.locality ?? alert.incident.admin.county}
            </p>
            <p className="font-mono text-[10px] text-slate">
              {alert.incident.admin.county}
            </p>
          </div>
        </div>

        <div className="flex divide-x divide-rule border-t border-rule">
          <button
            type="button"
            onClick={() => onView?.(alert.incidentId)}
            className="flex-1 py-6 font-mono text-[10px] uppercase tracking-[0.08em] text-midnight-ink hover:bg-sunlit-cream"
          >
            vezi pe hartă
          </button>
          <button
            type="button"
            onClick={() => onDismiss?.(alert.alertId)}
            className="flex-1 py-6 font-mono text-[10px] uppercase tracking-[0.08em] text-ash-gray hover:bg-linen"
          >
            renunță
          </button>
        </div>
      </div>
    </article>
  );
}
