import { RECENCY_BG, RECENCY_LABELS, type RecencyBucket } from "@/lib/recency";

/**
 * The recency indicator, used on rows, banners and legends. Color is never the
 * only channel — the dot always ships an accessible label, and callers are
 * expected to render a visible text label beside it.
 */
export function SeverityDot({
  bucket,
  size = 8,
  pulse = true,
}: {
  bucket: RecencyBucket;
  size?: number;
  pulse?: boolean;
}) {
  const isCritical = bucket === 0 && pulse;

  return (
    <span
      className={`relative inline-block shrink-0 rounded-full ring-2 ring-paper-white ${RECENCY_BG[bucket]} ${
        isCritical ? "pulse-critical text-recency-0" : ""
      }`}
      style={{ width: size, height: size }}
      role="img"
      aria-label={`Detectat ${RECENCY_LABELS[bucket]}`}
    />
  );
}
