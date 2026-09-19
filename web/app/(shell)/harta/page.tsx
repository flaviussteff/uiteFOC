"use client";

import { LayerSwitcher } from "@/components/map/LayerSwitcher";
import { MapLegend } from "@/components/map/MapLegend";
import { MapOverlay, MapPlaceholder } from "@/components/map/MapPlaceholder";
import { useMapStore } from "@/stores/useMapStore";

/**
 * Incident dashboard.
 *
 * The map itself is still MapPlaceholder — swapping in MapLibre means replacing
 * that one component with MapCanvas and feeding it the GeoJSON endpoint from
 * docs/API_CONTRACTS.md. Every overlay around it is final.
 */
export default function HartaPage() {
  const { activeLayers, toggleLayer, sinceDays, setSinceDays } = useMapStore();

  return (
    <MapPlaceholder
      note="Aici vine harta MapLibre"
      attribution="© MapLibre · OpenStreetMap · NASA FIRMS"
    >
      <MapOverlay anchor="top-right">
        <LayerSwitcher active={activeLayers} onToggle={toggleLayer} />
      </MapOverlay>

      <MapOverlay anchor="bottom-left">
        <MapLegend variant="recency" />
      </MapOverlay>

      <MapOverlay anchor="bottom-center">
        <div className="flex items-center gap-12 rounded-xl bg-paper-white/92 px-16 py-12 shadow-overlay backdrop-blur-sm">
          <label htmlFor="since-days" className="text-[11px] uppercase tracking-[0.25px] text-ash-gray">
            Perioadă
          </label>
          <input
            id="since-days"
            type="range"
            min={1}
            max={30}
            value={sinceDays}
            onChange={(e) => setSinceDays(Number(e.target.value))}
            className="w-[180px] accent-midnight-ink"
          />
          <span className="font-mono text-[13px] tabular">
            {sinceDays} {sinceDays === 1 ? "zi" : "zile"}
          </span>
        </div>
      </MapOverlay>
    </MapPlaceholder>
  );
}
