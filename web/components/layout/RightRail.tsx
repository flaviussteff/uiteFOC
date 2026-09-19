import type { ReactNode } from "react";

/**
 * The instrument rail.
 *
 * Deliberately a different register from the rest of the app: where the map
 * chrome and the document pages are paper — rounded, shadowed, airy — this
 * panel is the instrument. Square corners, hairline rules, graph-paper ground,
 * no elevation. Depth comes from density instead of shadow.
 *
 * 340px on desktop; a right-edge sheet below lg, a bottom sheet below sm.
 */
export function RightRail({
  children,
  open = true,
}: {
  children: ReactNode;
  open?: boolean;
}) {
  return (
    <aside
      aria-label="Instrumente: alerte, mediu și incidente active"
      data-open={open}
      className={`
        instrument-ground flex min-h-0 flex-col overflow-y-auto border-l border-midnight-ink
        max-lg:fixed max-lg:inset-y-0 max-lg:right-0 max-lg:z-40 max-lg:w-[340px]
        max-lg:transition-transform max-lg:data-[open=false]:translate-x-full
        max-sm:inset-x-0 max-sm:top-auto max-sm:h-[62dvh] max-sm:w-auto
        max-sm:data-[open=false]:translate-x-0 max-sm:data-[open=false]:translate-y-[calc(100%-64px)]
      `}
    >
      {children}
    </aside>
  );
}

/**
 * Rail header — a title bar, not a card heading. Carries the panel's own
 * identity plus whatever is keyed to the whole rail (the observation station).
 */
export function RailHeader({ station, at }: { station: string; at: string }) {
  return (
    <header className="sticky top-0 z-10 flex items-baseline gap-6 border-b border-midnight-ink bg-midnight-ink px-10 py-6">
      <h2 className="font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-paper-white">
        panou date
      </h2>
      <span className="ml-auto truncate font-mono text-[9px] tabular text-ash-gray">
        {station} · {at}
      </span>
    </header>
  );
}

/** Footer telemetry strip: sources, timezone, and the debug switch. */
export function RailFooter({
  debug,
  onToggleDebug,
  sources,
}: {
  debug: boolean;
  onToggleDebug: () => void;
  sources: string[];
}) {
  return (
    <footer className="mt-auto border-t border-rule bg-parchment px-10 py-6">
      <div className="flex items-center gap-6">
        <span className="font-mono text-[9px] uppercase tracking-[0.08em] text-ash-gray">
          src
        </span>
        <span className="truncate font-mono text-[9px] text-slate">{sources.join(" · ")}</span>

        <button
          type="button"
          onClick={onToggleDebug}
          aria-pressed={debug}
          className={`ml-auto shrink-0 border px-4 font-mono text-[9px] uppercase leading-[14px] tracking-[0.08em] transition-colors ${
            debug
              ? "border-midnight-ink bg-midnight-ink text-paper-white"
              : "border-rule-strong text-ash-gray hover:border-midnight-ink hover:text-midnight-ink"
          }`}
        >
          dev {debug ? "on" : "off"}
        </button>
      </div>

      <p className="mt-3 font-mono text-[9px] text-ash-gray">
        tz Europe/Bucharest · crs WGS84 · unități SI
      </p>
    </footer>
  );
}
