/**
 * Banded scale with a pointer — for values that mean nothing without their
 * breakpoints. The bands are drawn to scale and labelled at the breaks, so the
 * reader sees *where in the scale* a number sits, not just the number.
 */

export interface ScaleBand {
  upTo: number;
  label: string;
  className: string;
}

/** US EPA AQI breakpoints. EAQI is a 1-6 index and needs its own band set. */
export const AQI_BANDS_EPA: ScaleBand[] = [
  { upTo: 50, label: "bun", className: "bg-risk-1" },
  { upTo: 100, label: "moderat", className: "bg-risk-2" },
  { upTo: 150, label: "sensibil", className: "bg-risk-3" },
  { upTo: 200, label: "nesănătos", className: "bg-risk-4" },
  { upTo: 300, label: "periculos", className: "bg-risk-5" },
];

export function ScaleStrip({
  value,
  bands,
  unit,
}: {
  value: number;
  bands: ScaleBand[];
  unit?: string;
}) {
  const max = bands[bands.length - 1].upTo;
  const clamped = Math.max(0, Math.min(value, max));
  const pct = (clamped / max) * 100;

  let lower = 0;

  return (
    <div className="pt-8">
      {/* Pointer rides above the strip so it never hides the band it marks. */}
      <div className="relative h-10">
        <div
          className="absolute -translate-x-1/2 text-center"
          style={{ left: `${pct}%` }}
        >
          <span className="block font-mono text-[12px] font-medium tabular leading-none text-midnight-ink">
            {value}
          </span>
          <svg width="9" height="5" viewBox="0 0 9 5" className="mx-auto mt-2" aria-hidden="true">
            <path d="M0 0 L9 0 L4.5 5 Z" fill="var(--color-midnight-ink)" />
          </svg>
        </div>
      </div>

      <div className="flex h-6 items-stretch gap-[1px]">
        {bands.map((band) => {
          const width = ((band.upTo - lower) / max) * 100;
          lower = band.upTo;
          return (
            <span
              key={band.upTo}
              className={band.className}
              style={{ width: `${width}%` }}
              title={band.label}
              aria-hidden="true"
            />
          );
        })}
      </div>

      <div className="relative mt-3 h-10">
        {bands.slice(0, -1).map((band) => (
          <span
            key={band.upTo}
            className="absolute -translate-x-1/2 font-mono text-[9px] tabular text-ash-gray"
            style={{ left: `${(band.upTo / max) * 100}%` }}
          >
            {band.upTo}
          </span>
        ))}
        <span className="absolute right-0 font-mono text-[9px] text-ash-gray">
          {unit}
        </span>
      </div>
    </div>
  );
}
