"use client";

import { useViewMode } from "@/components/useDraft";
import { tr } from "@/i18n/tr";
import type { ViewMode } from "@/lib/summary";

const MODES: ViewMode[] = ["conference", "division"];

/** Lets the user list teams by conference (15 + 15) or by division (6 groups of 5). */
export function ViewToggle() {
  const [mode, setMode] = useViewMode();

  return (
    <div
      role="group"
      aria-label={tr.view.label}
      className="border-border bg-surface-raised flex gap-1 rounded-xl border p-1"
    >
      {MODES.map((option) => {
        const selected = mode === option;
        return (
          <button
            key={option}
            type="button"
            aria-pressed={selected}
            onClick={() => setMode(option)}
            className={`font-display flex h-11 items-center rounded-[9px] px-3.5 text-lg font-bold sm:px-5 tracking-[0.08em] ${
              selected ? "bg-ink text-bg" : "text-ink-soft hover:text-ink"
            }`}
          >
            {tr.view[option]}
          </button>
        );
      })}
    </div>
  );
}
