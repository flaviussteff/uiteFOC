import { DataReadout } from "./DataReadout";
import { clockTime, windArrowRotation } from "@/lib/format";
import type { AqiCategory, EnvironmentSnapshot } from "@/lib/types";

const AQI_LABELS: Record<AqiCategory, string> = {
  good: "bun",
  moderate: "moderat",
  unhealthy_sensitive: "sensibil",
  unhealthy: "nesănătos",
  very_unhealthy: "foarte nesănătos",
  hazardous: "periculos",
};

const AQI_BAR: Record<AqiCategory, string> = {
  good: "bg-risk-1",
  moderate: "bg-risk-2",
  unhealthy_sensitive: "bg-risk-3",
  unhealthy: "bg-risk-4",
  very_unhealthy: "bg-risk-5",
  hazardous: "bg-risk-5",
};

export function EnvironmentPanel({ data }: { data: EnvironmentSnapshot }) {
  const { wind, temperature, precipitation, airQuality } = data;

  return (
    <div className="flex flex-col px-4">
      <DataReadout
        label="Vânt"
        value={data.wind.speedMs.toFixed(1)}
        unit={`m/s · ${wind.directionCardinal}`}
        detail={wind.gustMs ? `rafale ${wind.gustMs.toFixed(1)} m/s` : undefined}
        accent={
          <span
            aria-hidden="true"
            className="text-[16px] text-slate"
            style={{
              display: "inline-block",
              transform: `rotate(${windArrowRotation(wind.directionDeg)}deg)`,
            }}
          >
            ↑
          </span>
        }
      />

      <DataReadout
        label="Umiditate"
        value={String(temperature.humidityPct)}
        unit="%"
        detail={`${temperature.airC.toFixed(1)} °C`}
      />

      <DataReadout
        label="Fără ploaie"
        value={String(precipitation.daysSinceRain)}
        unit={precipitation.daysSinceRain === 1 ? "zi" : "zile"}
        detail={`${precipitation.last7dMm.toFixed(1)} mm în ultimele 7 zile`}
      />

      {airQuality && (
        <DataReadout
          label="Calitatea aerului"
          value={String(airQuality.aqi)}
          unit={AQI_LABELS[airQuality.category]}
          detail={`${airQuality.dominant.toUpperCase()} dominant · ${clockTime(airQuality.observedAt)}`}
          accent={
            <span
              aria-hidden="true"
              className={`block h-4 w-48 rounded-full ${AQI_BAR[airQuality.category]}`}
            />
          }
        />
      )}

      <p className="pt-12 text-[11px] text-ash-gray">
        {data.provider} · actualizat {clockTime(data.observedAt)}
      </p>
    </div>
  );
}
