import type { ReactNode } from "react";

/**
 * What ships until MapLibre lands, and what the map area falls back to when
 * tiles fail. It keeps the exact geometry of the real canvas — full bleed, with
 * the four overlay anchors — so replacing it is a swap, not a re-layout.
 *
 * The overlay children are real: the legend and layer switcher render on top of
 * this placeholder the same way they will render on top of tiles.
 */
export function MapPlaceholder({
  children,
  attribution = "© MapLibre · OpenStreetMap",
  note = "Harta se încarcă",
}: {
  children?: ReactNode;
  attribution?: string;
  note?: string;
}) {
  return (
    <div className="relative size-full overflow-hidden bg-fog-gray">
      {/* Graticule stand-in for tiles. Decorative only. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "linear-gradient(to right, #e6e6e6 1px, transparent 1px), linear-gradient(to bottom, #e6e6e6 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="pointer-events-none absolute inset-0 grid place-items-center">
        <p className="rounded-full bg-paper-white/80 px-16 py-8 text-caption text-slate">
          {note}
        </p>
      </div>

      {children}

      <p className="absolute bottom-4 right-8 text-[11px] text-ash-gray">{attribution}</p>
    </div>
  );
}

/** Positioned slot for the floating panels that sit over the map. */
export function MapOverlay({
  anchor,
  children,
}: {
  anchor: "top-left" | "top-right" | "bottom-left" | "bottom-center";
  children: ReactNode;
}) {
  const POSITION = {
    "top-left": "left-16 top-16",
    "top-right": "right-16 top-16",
    "bottom-left": "bottom-16 left-16",
    "bottom-center": "bottom-16 left-1/2 -translate-x-1/2",
  } as const;

  return <div className={`absolute z-10 ${POSITION[anchor]}`}>{children}</div>;
}
