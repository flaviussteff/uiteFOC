"use client";

export type MapLayerId = "incidents" | "satellite" | "wind" | "spread";

const LAYERS: Array<{ id: MapLayerId; label: string }> = [
  { id: "incidents", label: "Incidente" },
  { id: "satellite", label: "Satelit" },
  { id: "wind", label: "Vânt" },
  { id: "spread", label: "Predicție" },
];

/**
 * Multi-select segmented control, top-right of the map. Presentational only —
 * the active set lives in useMapStore so layer components can subscribe to it.
 */
export function LayerSwitcher({
  active,
  onToggle,
}: {
  active: MapLayerId[];
  onToggle: (id: MapLayerId) => void;
}) {
  return (
    <div
      role="group"
      aria-label="Straturi pe hartă"
      className="flex gap-4 rounded-full bg-fog-gray/95 p-4 shadow-overlay backdrop-blur-sm"
    >
      {LAYERS.map((layer) => {
        const on = active.includes(layer.id);

        return (
          <button
            key={layer.id}
            type="button"
            aria-pressed={on}
            onClick={() => onToggle(layer.id)}
            className={`rounded-full px-12 py-8 text-[13px] font-medium transition-colors ${
              on
                ? "bg-paper-white text-midnight-ink shadow-subtle-2"
                : "text-slate hover:text-midnight-ink"
            }`}
          >
            {layer.label}
          </button>
        );
      })}
    </div>
  );
}
