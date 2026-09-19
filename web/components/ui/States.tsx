import type { ReactNode } from "react";

/**
 * Every list in the app ships four states. These are the other three — an empty
 * region is a designed surface here, never a blank div.
 */

export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-linen motion-reduce:animate-none ${className}`}
      aria-hidden="true"
    />
  );
}

export function EmptyState({
  title,
  body,
  action,
}: {
  title: string;
  body?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-8 px-24 py-48 text-center">
      <p className="text-[14px] font-medium text-midnight-ink">{title}</p>
      {body ? <p className="max-w-[38ch] text-caption text-slate">{body}</p> : null}
      {action}
    </div>
  );
}

export function ErrorState({
  title = "Nu am putut încărca datele",
  body,
  onRetry,
}: {
  title?: string;
  body?: string;
  onRetry?: () => void;
}) {
  return (
    <div role="alert" className="flex flex-col items-center gap-8 px-24 py-48 text-center">
      <p className="text-[14px] font-medium text-midnight-ink">{title}</p>
      {body ? <p className="max-w-[38ch] text-caption text-slate">{body}</p> : null}
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="rounded-full border border-linen px-16 py-8 text-[13px] font-medium text-slate hover:bg-fog-gray"
        >
          Încearcă din nou
        </button>
      ) : null}
    </div>
  );
}
