import { InstrumentBlock, Leader } from "@/components/ui/Instrument";
import { RainSpark } from "./RainSpark";
import { ScaleStrip, AQI_BANDS_EPA } from "./ScaleStrip";
import { SegmentBar } from "./SegmentBar";
import { WindCompass } from "./WindCompass";
import { clockTime } from "@/lib/format";
import type { AqiCategory, EnvironmentSnapshot } from "@/lib/types";

const AQI_LABELS: Record<AqiCategory, string> = {
  good: "bun",
  moderate: "moderat",
  unhealthy_sensitive: "sensibil",
  unhealthy: "nesănătos",
  very_unhealthy: "f. nesănătos",
  hazardous: "periculos",
};

const TREND_GLYPH = { rising: "▲", steady: "■", falling: "▼" } as const;

/**
 * Environmental instrument stack.
 *
 * Four modules, each with its own reading, its own drawing and its own raw
 * payload behind the [raw] toggle. Every number is monospaced and tabular so a
 * refresh never shifts a digit sideways — these are meant to be watched, not
 * glanced at.
 */
export function EnvironmentPanel({ data }: { data: EnvironmentSnapshot }) {
  const { wind, temperature, precipitation, airQuality } = data;

  return (
    <div className="flex flex-col gap-10">
      <InstrumentBlock label="Vânt" stamp={clockTime(data.observedAt)} payload={wind}>
        <div className="flex items-start gap-10">
          <WindCompass
            directionDeg={wind.directionDeg}
            cardinal={wind.directionCardinal}
            speedMs={wind.speedMs}
            gustMs={wind.gustMs}
          />

          <div className="min-w-0 flex-1">
            <div className="flex items-baseline gap-4">
              <span className="font-mono text-[26px] font-medium leading-none tabular">
                {wind.speedMs.toFixed(1)}
              </span>
              <span className="font-mono text-[11px] text-slate">m/s</span>
              {wind.trend && (
                <span
                  className="ml-auto font-mono text-[10px] text-ash-gray"
                  title={`tendință: ${wind.trend}`}
                >
                  {TREND_GLYPH[wind.trend]}
                </span>
              )}
            </div>

            <div className="mt-6 border-t border-rule pt-4">
              <Leader
                label="dir"
                value={`${String(wind.directionDeg).padStart(3, "0")}°`}
                unit={wind.directionCardinal}
                title="Direcția DIN care bate vântul"
              />
              <Leader
                label="rafale"
                value={wind.gustMs !== null ? wind.gustMs.toFixed(1) : "—"}
                unit="m/s"
              />
              <Leader
                label="flux"
                value={`${String((wind.directionDeg + 180) % 360).padStart(3, "0")}°`}
                title="Direcția ÎNCOTRO se deplasează aerul — pe acolo se extinde focul"
              />
            </div>
          </div>
        </div>
      </InstrumentBlock>

      <InstrumentBlock
        label="Umiditate · temp"
        stamp={`${temperature.airC.toFixed(1)}°C`}
        payload={temperature}
      >
        <div className="flex items-baseline gap-4">
          <span className="font-mono text-[26px] font-medium leading-none tabular">
            {temperature.humidityPct}
          </span>
          <span className="font-mono text-[11px] text-slate">% RH</span>
          <span className="ml-auto font-mono text-[9px] uppercase tracking-[0.08em] text-ash-gray">
            {temperature.humidityPct < 30 ? "sub prag critic 30%" : "peste prag"}
          </span>
        </div>

        <div className="mt-8">
          <SegmentBar
            value={temperature.humidityPct}
            fillClass={temperature.humidityPct < 30 ? "bg-recency-0" : "bg-midnight-ink"}
            label="Umiditate relativă"
          />
          <div className="mt-3 flex justify-between font-mono text-[9px] text-ash-gray">
            <span>0</span>
            <span>30</span>
            <span>60</span>
            <span>100</span>
          </div>
        </div>

        <div className="mt-6 border-t border-rule pt-4">
          <Leader label="aer" value={temperature.airC.toFixed(1)} unit="°C" />
          <Leader
            label="punct rouă"
            value={temperature.dewPointC !== null ? temperature.dewPointC.toFixed(1) : "—"}
            unit="°C"
          />
        </div>
      </InstrumentBlock>

      <InstrumentBlock
        label="Precipitații"
        stamp={`${precipitation.dailyMm?.length ?? 0}z`}
        payload={precipitation}
      >
        {precipitation.dailyMm ? (
          <RainSpark
            dailyMm={precipitation.dailyMm}
            daysSinceRain={precipitation.daysSinceRain}
          />
        ) : (
          <p className="py-8 font-mono text-[10px] text-ash-gray">
            serie zilnică indisponibilă
          </p>
        )}

        <div className="mt-6 border-t border-rule pt-4">
          <Leader label="24h" value={precipitation.last24hMm.toFixed(1)} unit="mm" />
          <Leader label="7z" value={precipitation.last7dMm.toFixed(1)} unit="mm" />
        </div>
      </InstrumentBlock>

      {airQuality && (
        <InstrumentBlock
          label="Calitatea aerului"
          stamp={clockTime(airQuality.observedAt)}
          payload={airQuality}
        >
          <div className="flex items-baseline gap-6">
            <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-slate">
              {airQuality.scale === "us-epa" ? "AQI US-EPA" : "EAQI"}
            </span>
            <span className="ml-auto font-mono text-[10px] text-ember-brown">
              {AQI_LABELS[airQuality.category]}
            </span>
          </div>

          <ScaleStrip value={airQuality.aqi} bands={AQI_BANDS_EPA} unit="idx" />

          <div className="mt-4 border-t border-rule pt-4">
            <Leader
              label="pm2.5"
              value={airQuality.pm25 !== null ? airQuality.pm25.toFixed(1) : "—"}
              unit="µg/m³"
            />
            <Leader
              label="pm10"
              value={airQuality.pm10 !== null ? airQuality.pm10.toFixed(1) : "—"}
              unit="µg/m³"
            />
            <Leader label="dominant" value={airQuality.dominant.toUpperCase()} />
          </div>
        </InstrumentBlock>
      )}
    </div>
  );
}
