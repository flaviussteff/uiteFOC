const RO = "ro-RO";

export function relativeTime(iso: string, now = Date.now()): string {
  const diffMs = now - new Date(iso).getTime();
  const minutes = Math.round(diffMs / 60_000);

  if (minutes < 1) return "chiar acum";
  if (minutes < 60) return `acum ${minutes} min`;

  const hours = Math.round(minutes / 60);
  if (hours < 24) return `acum ${hours} ${hours === 1 ? "oră" : "ore"}`;

  const days = Math.round(hours / 24);
  if (days < 30) return `acum ${days} ${days === 1 ? "zi" : "zile"}`;

  return new Intl.DateTimeFormat(RO, { day: "numeric", month: "short", year: "numeric" })
    .format(new Date(iso));
}

export function clockTime(iso: string): string {
  return new Intl.DateTimeFormat(RO, {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Bucharest",
  }).format(new Date(iso));
}

export function distance(metres: number): string {
  if (metres < 1000) return `${Math.round(metres)} m`;
  return `${new Intl.NumberFormat(RO, { maximumFractionDigits: 1 }).format(metres / 1000)} km`;
}

export function area(hectares: number | null): string {
  if (hectares === null) return "suprafață necunoscută";
  return `${new Intl.NumberFormat(RO, { maximumFractionDigits: 1 }).format(hectares)} ha`;
}

export function percent(confidence: number): string {
  return `${Math.round(confidence * 100)}%`;
}

export function coords({ lat, lon }: { lat: number; lon: number }): string {
  return `${lat.toFixed(4)}, ${lon.toFixed(4)}`;
}

/** Meteorological bearing → the arrow's rotation (wind blows TOWARD +180°). */
export function windArrowRotation(directionDeg: number): number {
  return (directionDeg + 180) % 360;
}

export const SOURCE_LABELS: Record<string, string> = {
  firms: "satelit",
  news: "știri",
  user: "utilizator",
  cv: "foto analizată",
  manual: "verificat manual",
};

export const STATUS_LABELS: Record<string, string> = {
  active: "activ",
  contained: "sub control",
  extinguished: "stins",
  unverified: "neverificat",
};
