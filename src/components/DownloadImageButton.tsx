"use client";

import { useState } from "react";
import { SEASON } from "@config/season";
import {
  downloadBlob,
  renderSummaryImage,
  type ImageVariant,
} from "@/components/summaryImage";
import { useDraft, useViewMode } from "@/components/useDraft";
import { WIN_LINES } from "@/data/lines";
import { tr } from "@/i18n/tr";
import { buildSummary } from "@/lib/summary";

type State = "idle" | "working" | "failed";

/** Downloads the current prediction (or one part of it) as a PNG. */
export function DownloadImageButton({
  variant,
  primary = false,
}: {
  variant: ImageVariant;
  primary?: boolean;
}) {
  const [draft] = useDraft();
  const [mode] = useViewMode();
  const [state, setState] = useState<State>("idle");

  async function handleClick() {
    setState("working");
    try {
      const summary = buildSummary(draft, WIN_LINES);
      const blob = await renderSummaryImage(summary, variant, mode);
      downloadBlob(blob, tr.summary.fileName[variant](SEASON.id));
      setState("idle");
    } catch {
      setState("failed");
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={state === "working"}
      title={state === "failed" ? tr.summary.downloadError : undefined}
      className={`font-display flex h-13 items-center gap-2 rounded-xl text-xl tracking-[0.08em] disabled:opacity-60 ${
        primary
          ? "bg-ink text-bg px-7 font-extrabold hover:bg-white"
          : "border-border-strong hover:bg-surface-active border px-5 font-bold"
      }`}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 4v11M7 11l5 5 5-5M5 20h14" />
      </svg>
      {state === "working"
        ? tr.summary.downloading
        : tr.summary.download[variant]}
      {state === "failed" && (
        <span role="alert" className="sr-only">
          {tr.summary.downloadError}
        </span>
      )}
    </button>
  );
}
