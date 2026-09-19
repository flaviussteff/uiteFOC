"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  href: string;
  label: string;
  /** Placeholder glyph — swap for the icon set when one is chosen. */
  glyph: string;
}

const NAV: NavItem[] = [
  { href: "/harta", label: "Harta", glyph: "◉" },
  { href: "/risc", label: "Risc", glyph: "◷" },
  { href: "/incarca", label: "Încarcă", glyph: "↑" },
  { href: "/istoric", label: "Istoric", glyph: "⧗" },
  { href: "/ghid", label: "Ghid", glyph: "ⓘ" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Navigare principală"
      className="flex h-full flex-col gap-4 border-r border-linen bg-paper-white p-12"
    >
      {NAV.map((item) => {
        const active = pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            title={item.label}
            className={`flex items-center gap-12 rounded-full px-12 py-8 text-[14px] font-medium transition-colors ${
              active
                ? "bg-fog-gray text-midnight-ink"
                : "text-midnight-ink hover:bg-fog-gray"
            }`}
          >
            <span
              aria-hidden="true"
              className={`w-16 text-center text-[16px] ${active ? "text-midnight-ink" : "text-slate"}`}
            >
              {item.glyph}
            </span>
            <span className="max-md:hidden">{item.label}</span>
          </Link>
        );
      })}

      <div className="mt-auto px-12 py-8 text-caption text-ash-gray max-md:hidden">
        Date: NASA FIRMS · Open-Meteo
      </div>
    </nav>
  );
}
