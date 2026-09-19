/**
 * 14-day rainfall column chart, drawn as flex columns rather than pulled from a
 * chart library — at this size a library costs more than it renders.
 *
 * Dry days keep a 1px baseline stub so the run of zeros is visible as a run,
 * which is the thing that actually predicts fire danger. The dry streak is
 * marked with a bracket under the axis.
 */
export function RainSpark({
  dailyMm,
  daysSinceRain,
}: {
  dailyMm: number[];
  daysSinceRain: number;
}) {
  const peak = Math.max(...dailyMm, 1);
  const streak = Math.min(daysSinceRain, dailyMm.length);

  return (
    <div>
      <div className="flex h-24 items-end gap-[2px]" role="img" aria-label={`Precipitații, ultimele ${dailyMm.length} zile`}>
        {dailyMm.map((mm, i) => {
          const dry = mm === 0;
          const inStreak = i >= dailyMm.length - streak;
          return (
            <span
              key={i}
              className={`flex-1 ${dry ? "bg-rule" : "bg-midnight-ink"}`}
              style={{ height: dry ? 1 : `${Math.max((mm / peak) * 100, 8)}%` }}
              title={`${dry ? "0" : mm.toFixed(1)} mm${inStreak ? " · secetă" : ""}`}
              aria-hidden="true"
            />
          );
        })}
      </div>

      {/* Dry-streak bracket, right-aligned because the streak ends today. */}
      <div className="mt-2 flex h-8 items-start">
        <span className="flex-1" />
        <span
          className="flex items-start"
          style={{ width: `${(streak / dailyMm.length) * 100}%` }}
        >
          <span className="h-3 w-full border-x border-b border-rule-strong" aria-hidden="true" />
        </span>
      </div>

      <p className="mt-2 text-right font-mono text-[9px] uppercase tracking-[0.08em] text-ash-gray">
        {daysSinceRain} zile fără precipitații
      </p>
    </div>
  );
}
