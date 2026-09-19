import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  /** "paper" floats over the canvas, "overlay" floats over map tiles. */
  elevation?: "paper" | "overlay" | "flat";
  padding?: "compact" | "feature" | "none";
  className?: string;
}

const ELEVATION = {
  paper: "shadow-sm",
  overlay: "shadow-overlay",
  flat: "",
} as const;

const PADDING = {
  compact: "p-16",
  feature: "p-24",
  none: "",
} as const;

export function Card({
  children,
  elevation = "paper",
  padding = "compact",
  className = "",
}: CardProps) {
  return (
    <div
      className={`rounded-xl bg-paper-white ${ELEVATION[elevation]} ${PADDING[padding]} ${className}`}
    >
      {children}
    </div>
  );
}
