import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "filled" | "ghost";

interface PillButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  children: ReactNode;
}

const VARIANTS: Record<Variant, string> = {
  filled: "bg-midnight-ink text-paper-white shadow-subtle",
  ghost: "border border-linen text-slate hover:bg-fog-gray",
};

export function PillButton({
  variant = "ghost",
  children,
  className = "",
  ...rest
}: PillButtonProps) {
  return (
    <button
      type="button"
      className={`rounded-full px-16 py-8 text-[14px] font-medium transition-colors ${VARIANTS[variant]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

type TagTone = "default" | "success" | "danger";

const TAG_TONES: Record<TagTone, string> = {
  default: "bg-sunlit-cream text-ember-brown",
  success: "bg-forest-pulse text-paper-white",
  danger: "bg-ember-alert text-paper-white",
};

export function Tag({
  children,
  tone = "default",
}: {
  children: ReactNode;
  tone?: TagTone;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-10 py-4 text-caption font-medium ${TAG_TONES[tone]}`}
    >
      {children}
    </span>
  );
}
