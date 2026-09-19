import type { ReactNode } from "react";

/**
 * One measurement. No card chrome — readouts sit directly on the rail's Fog Gray
 * and are separated by hairlines. Values are monospace with tabular numerals so
 * a refresh never nudges the layout.
 */
export function DataReadout({
  label,
  value,
  unit,
  detail,
  accent,
}: {
  label: string;
  value: string;
  unit?: string;
  detail?: string;
  /** Optional 4px category underline, e.g. the AQI class color. */
  accent?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 border-b border-linen py-12 last:border-b-0">
      <span className="text-[11px] font-medium uppercase tracking-[0.25px] text-ash-gray">
        {label}
      </span>
      <span className="flex items-baseline gap-4">
        <span className="font-mono text-heading-sm font-semibold">{value}</span>
        {unit && <span className="text-[13px] text-slate">{unit}</span>}
      </span>
      {accent}
      {detail && <span className="text-caption text-slate">{detail}</span>}
    </div>
  );
}
