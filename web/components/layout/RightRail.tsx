import type { ReactNode } from "react";

/**
 * 340px panel on desktop; below lg it is a right-edge sheet, below sm a bottom
 * sheet. The responsive behaviour is deliberately left to one place so nothing
 * inside the rail has to know where it is rendered.
 */
export function RightRail({
  children,
  open = true,
}: {
  children: ReactNode;
  open?: boolean;
}) {
  return (
    <aside
      aria-label="Alerte, mediu și incidente active"
      data-open={open}
      className={`
        flex min-h-0 flex-col gap-16 overflow-y-auto border-l border-linen bg-fog-gray p-16
        max-lg:fixed max-lg:inset-y-0 max-lg:right-0 max-lg:z-40 max-lg:w-[340px] max-lg:shadow-overlay
        max-lg:transition-transform max-lg:data-[open=false]:translate-x-full
        max-sm:inset-x-0 max-sm:top-auto max-sm:h-[60dvh] max-sm:w-auto max-sm:rounded-t-2xl
        max-sm:data-[open=false]:translate-x-0 max-sm:data-[open=false]:translate-y-[calc(100%-72px)]
      `}
    >
      {children}
    </aside>
  );
}

export function RailSection({
  title,
  count,
  children,
}: {
  title: string;
  count?: number;
  children: ReactNode;
}) {
  return (
    <section className="flex flex-col gap-8">
      <h2 className="flex items-baseline justify-between px-4 text-[11px] font-medium uppercase tracking-[0.25px] text-ash-gray">
        <span>{title}</span>
        {count !== undefined && <span className="tabular">{count}</span>}
      </h2>
      {children}
    </section>
  );
}
