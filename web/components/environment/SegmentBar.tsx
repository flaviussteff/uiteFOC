/**
 * Discrete segment bar — a bargraph, not a progress bar.
 *
 * Reading a value off 24 countable cells is more precise than reading it off a
 * continuous fill, and the stepping makes small changes visible. Unfilled cells
 * stay drawn so the scale is always present.
 */
export function SegmentBar({
  value,
  max = 100,
  segments = 24,
  fillClass = "bg-midnight-ink",
  label,
}: {
  value: number;
  max?: number;
  segments?: number;
  fillClass?: string;
  label: string;
}) {
  const ratio = Math.max(0, Math.min(value / max, 1));
  const lit = Math.round(ratio * segments);

  return (
    <div
      className="flex h-12 items-stretch gap-[2px]"
      role="img"
      aria-label={`${label}: ${value} din ${max}`}
    >
      {Array.from({ length: segments }, (_, i) => (
        <span
          key={i}
          className={`flex-1 ${i < lit ? fillClass : "bg-linen"}`}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}
