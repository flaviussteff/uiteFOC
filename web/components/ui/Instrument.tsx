"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

/* -------------------------------------------------------------------------
 * Debug mode
 *
 * One switch in the rail footer force-opens every module's raw payload at
 * once; each module can also be opened on its own. Useful while the backend
 * is still moving — you can see the shape that produced a reading without
 * leaving the page or opening devtools.
 * ---------------------------------------------------------------------- */

const DebugContext = createContext(false);

export function DebugProvider({
  enabled,
  children,
}: {
  enabled: boolean;
  children: ReactNode;
}) {
  return <DebugContext.Provider value={enabled}>{children}</DebugContext.Provider>;
}

export const useDebug = () => useContext(DebugContext);

/* -------------------------------------------------------------------------
 * JSON rendering
 *
 * Hand-rolled rather than pulled from a highlighter package: the payloads are
 * small, and a 40-line tokenizer beats a 40KB dependency for three colours.
 * ---------------------------------------------------------------------- */

function highlight(json: string): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /("(?:\\.|[^"\\])*")\s*:|("(?:\\.|[^"\\])*")|(-?\d+\.?\d*(?:[eE][+-]?\d+)?)|(\btrue\b|\bfalse\b|\bnull\b)/g;

  let last = 0;
  let match: RegExpExecArray | null;
  let i = 0;

  while ((match = re.exec(json)) !== null) {
    if (match.index > last) out.push(json.slice(last, match.index));

    const [full, key, str, num, lit] = match;
    if (key) {
      out.push(
        <span key={i++} className="k">
          {key}
        </span>,
        ":",
      );
    } else if (str) {
      out.push(
        <span key={i++} className="s">
          {str}
        </span>,
      );
    } else if (num) {
      out.push(
        <span key={i++} className="n">
          {num}
        </span>,
      );
    } else if (lit) {
      out.push(
        <span key={i++} className="n">
          {lit}
        </span>,
      );
    } else {
      out.push(full);
    }
    last = re.lastIndex;
  }

  out.push(json.slice(last));
  return out;
}

export function RawPayload({ value }: { value: unknown }) {
  const text = useMemo(() => JSON.stringify(value, null, 2), [value]);
  const bytes = useMemo(() => new Blob([text]).size, [text]);

  return (
    <div>
      <pre className="payload">{highlight(text)}</pre>
      <p className="border-t border-rule bg-paper-white px-10 py-4 font-mono text-[9px] uppercase tracking-[0.08em] text-ash-gray">
        {text.split("\n").length} linii · {bytes} B · application/json
      </p>
    </div>
  );
}

/* -------------------------------------------------------------------------
 * Module frame
 *
 * Square corners, 1px rules, no shadow. The header carries the module name on
 * the left and a machine-readable stamp on the right — observation time, row
 * count, whatever the module is keyed on.
 * ---------------------------------------------------------------------- */

export function InstrumentBlock({
  label,
  stamp,
  payload,
  children,
  dense = false,
}: {
  label: string;
  /** Right-aligned monospace metadata: obs time, n=, resolution. */
  stamp?: string;
  /** When given, the header gets a [raw] toggle that dumps this object. */
  payload?: unknown;
  children: ReactNode;
  dense?: boolean;
}) {
  const globalDebug = useDebug();
  const [localOpen, setLocalOpen] = useState(false);
  const open = globalDebug || localOpen;

  return (
    <section className="border border-rule bg-paper-white">
      <header className="flex items-center gap-8 border-b border-midnight-ink bg-parchment px-10 py-6">
        <h2 className="font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-midnight-ink">
          {label}
        </h2>

        {stamp && (
          <span className="ml-auto font-mono text-[10px] tabular text-ash-gray">{stamp}</span>
        )}

        {payload !== undefined && (
          <button
            type="button"
            onClick={() => setLocalOpen((v) => !v)}
            aria-pressed={open}
            aria-label={`Afișează payload-ul brut pentru ${label}`}
            className={`${stamp ? "" : "ml-auto"} border px-4 font-mono text-[10px] leading-[14px] transition-colors ${
              open
                ? "border-midnight-ink bg-midnight-ink text-paper-white"
                : "border-rule text-ash-gray hover:border-midnight-ink hover:text-midnight-ink"
            }`}
          >
            raw
          </button>
        )}
      </header>

      <div className={dense ? "" : "px-10 py-8"}>{children}</div>

      {open && payload !== undefined && <RawPayload value={payload} />}
    </section>
  );
}

/* -------------------------------------------------------------------------
 * Spec-sheet row: label · dot leader · value · unit
 * ---------------------------------------------------------------------- */

export function Leader({
  label,
  value,
  unit,
  title,
}: {
  label: string;
  value: string;
  unit?: string;
  title?: string;
}) {
  return (
    <div className="flex items-baseline gap-6 py-3" title={title}>
      <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-slate">
        {label}
      </span>
      <span className="leader" aria-hidden="true" />
      <span className="font-mono text-[12px] font-medium tabular text-midnight-ink">
        {value}
      </span>
      {unit && <span className="font-mono text-[10px] text-ash-gray">{unit}</span>}
    </div>
  );
}
