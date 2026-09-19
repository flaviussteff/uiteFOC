"use client";

interface TopBarProps {
  alertCount?: number;
  onToggleRail?: () => void;
}

export function TopBar({ alertCount = 0, onToggleRail }: TopBarProps) {
  return (
    <header
      className="flex h-[var(--shell-topbar-height)] items-center gap-16 border-b border-linen bg-paper-white px-16"
      style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
    >
      {/* Brand Logo Badge — the only Campfire Orange in the app shell. */}
      <a href="/harta" className="flex items-center gap-8" aria-label="uiteFOC, pagina principală">
        <span
          aria-hidden="true"
          className="grid size-28 place-items-center rounded-lg bg-campfire-orange text-[16px] font-semibold text-paper-white"
        >
          u
        </span>
        <span className="text-[14px] font-semibold tracking-[-0.01em]">uiteFOC</span>
      </a>

      <div className="relative mx-auto w-full max-w-[420px]">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-12 top-1/2 -translate-y-1/2 text-[14px] text-ash-gray"
        >
          ⌕
        </span>
        <input
          id="map-search"
          type="search"
          placeholder="Caută localitate, județ sau lat, lon"
          aria-label="Caută localitate, județ sau coordonate"
          className="w-full rounded-lg bg-fog-gray py-8 pl-32 pr-12 text-[14px] text-midnight-ink placeholder:text-ash-gray"
        />
      </div>

      <button
        type="button"
        onClick={onToggleRail}
        className="relative rounded-full px-12 py-8 text-[14px] text-slate hover:bg-fog-gray"
        aria-label={`Alerte${alertCount > 0 ? `, ${alertCount} active` : ""}`}
      >
        <span aria-hidden="true">🔔</span>
        {alertCount > 0 && (
          <span className="absolute -right-2 -top-2 grid size-18 place-items-center rounded-full bg-recency-0 text-[10px] font-semibold tabular text-paper-white">
            {alertCount}
          </span>
        )}
      </button>
    </header>
  );
}
