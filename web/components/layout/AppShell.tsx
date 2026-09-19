"use client";

import { useState, type ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { RightRail } from "./RightRail";

/**
 * The three-column app shell: sidebar | content | rail.
 * Full bleed and exactly one viewport tall — only the rail's interior scrolls,
 * because the map must never be pushed off screen by a long incident list.
 */
export function AppShell({
  children,
  rail,
  alertCount = 0,
}: {
  children: ReactNode;
  rail?: ReactNode;
  alertCount?: number;
}) {
  const [railOpen, setRailOpen] = useState(true);

  return (
    <div className="grid h-dvh grid-rows-[auto_1fr] overflow-hidden bg-parchment">
      <a href="#continut" className="skip-link">
        Sari la conținut
      </a>

      <TopBar alertCount={alertCount} onToggleRail={() => setRailOpen((v) => !v)} />

      <div
        className="grid min-h-0 grid-cols-[var(--shell-sidebar-width)_1fr_var(--shell-rail-width)] max-lg:grid-cols-[var(--shell-sidebar-width)_1fr] max-md:grid-cols-[var(--shell-sidebar-collapsed)_1fr]"
      >
        <Sidebar />

        <main id="continut" className="relative min-h-0 overflow-hidden">
          {children}
        </main>

        {rail ? <RightRail open={railOpen}>{rail}</RightRail> : null}
      </div>
    </div>
  );
}
