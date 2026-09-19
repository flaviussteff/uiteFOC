import { create } from "zustand";
import type { MapLayerId } from "@/components/map/LayerSwitcher";

/**
 * Map view state. No component calls map.flyTo directly — they write here and
 * MapCanvas reacts, so there is exactly one place that owns the camera.
 */
interface MapState {
  center: { lat: number; lon: number };
  zoom: number;
  activeLayers: MapLayerId[];
  selectedId: string | null;
  hoveredId: string | null;
  sinceDays: number;

  setView: (center: { lat: number; lon: number }, zoom?: number) => void;
  toggleLayer: (id: MapLayerId) => void;
  select: (id: string | null) => void;
  hover: (id: string | null) => void;
  setSinceDays: (days: number) => void;
}

/** Romania, whole-country view. */
const ROMANIA_CENTER = { lat: 45.9432, lon: 24.9668 };

export const useMapStore = create<MapState>((set) => ({
  center: ROMANIA_CENTER,
  zoom: 6,
  activeLayers: ["incidents"],
  selectedId: null,
  hoveredId: null,
  sinceDays: 7,

  setView: (center, zoom) => set((s) => ({ center, zoom: zoom ?? s.zoom })),
  toggleLayer: (id) =>
    set((s) => ({
      activeLayers: s.activeLayers.includes(id)
        ? s.activeLayers.filter((l) => l !== id)
        : [...s.activeLayers, id],
    })),
  select: (selectedId) => set({ selectedId }),
  hover: (hoveredId) => set({ hoveredId }),
  setSinceDays: (sinceDays) => set({ sinceDays }),
}));
