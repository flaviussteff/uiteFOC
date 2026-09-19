/**
 * Wind compass — hand-drawn SVG, 16-point rose.
 *
 * `directionDeg` is meteorological: the direction the wind comes FROM. The
 * needle is drawn pointing where the air is GOING (deg + 180), because that is
 * the direction a fire spreads, which is the only reason this dial is on screen.
 * The shaded wedge is the gust-to-mean ratio: a wide wedge means gusty and
 * unpredictable, a narrow one means steady.
 */

const R = 33;
const CX = 40;
const CY = 40;

/** Compass bearing (0 = north, clockwise) → SVG coordinates. */
function pt(deg: number, radius: number) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: CX + radius * Math.cos(rad), y: CY + radius * Math.sin(rad) };
}

export function WindCompass({
  directionDeg,
  cardinal,
  speedMs,
  gustMs,
}: {
  directionDeg: number;
  cardinal: string;
  speedMs: number;
  gustMs: number | null;
}) {
  const flow = (directionDeg + 180) % 360;

  // Gust ratio drives the wedge half-angle: steady air ~6°, very gusty ~32°.
  const ratio = gustMs && speedMs > 0 ? Math.min(gustMs / speedMs, 3) : 1;
  const spread = 6 + (ratio - 1) * 13;

  const tip = pt(flow, R - 5);
  const tail = pt(flow + 180, R - 12);
  const left = pt(flow - spread, R - 7);
  const right = pt(flow + spread, R - 7);

  return (
    <svg
      viewBox="0 0 80 80"
      width={80}
      height={80}
      className="shrink-0 text-midnight-ink"
      role="img"
      aria-label={`Vânt din ${cardinal}, ${directionDeg} grade, ${speedMs.toFixed(1)} metri pe secundă`}
    >
      {/* Frame: a square box with the dial inside — instrument, not a badge. */}
      <rect x="0.5" y="0.5" width="79" height="79" fill="none" stroke="var(--color-rule)" />

      {/* 16-point tick ring. Cardinals run long, the rest are stubs. */}
      {Array.from({ length: 16 }, (_, i) => {
        const deg = i * 22.5;
        const major = deg % 90 === 0;
        const a = pt(deg, R);
        const b = pt(deg, major ? R - 7 : R - 3.5);
        return (
          <line
            key={deg}
            x1={a.x}
            y1={a.y}
            x2={b.x}
            y2={b.y}
            stroke={major ? "var(--color-graphite)" : "var(--color-rule-strong)"}
            strokeWidth={major ? 1.2 : 0.8}
          />
        );
      })}

      {/* Gust spread wedge */}
      <path
        d={`M ${CX} ${CY} L ${left.x} ${left.y} L ${right.x} ${right.y} Z`}
        fill="currentColor"
        opacity="0.12"
      />

      {/* Flow needle */}
      <line
        x1={tail.x}
        y1={tail.y}
        x2={tip.x}
        y2={tip.y}
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d={`M ${tip.x} ${tip.y} L ${pt(flow - 9, R - 12).x} ${pt(flow - 9, R - 12).y} L ${pt(flow + 9, R - 12).x} ${pt(flow + 9, R - 12).y} Z`}
        fill="currentColor"
      />

      <circle cx={CX} cy={CY} r="1.6" fill="currentColor" />

      <text
        x={CX}
        y="11"
        textAnchor="middle"
        className="font-mono"
        fontSize="7"
        fill="var(--color-ash-gray)"
      >
        N
      </text>
    </svg>
  );
}
