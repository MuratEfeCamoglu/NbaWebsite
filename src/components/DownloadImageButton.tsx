"use client";

import { useEffect, useRef, useState } from "react";
import { SEASON } from "@config/season";
import { ACTION_BUTTON, ACTION_PRIMARY } from "@/components/ActionBar";
import {
  downloadBlob,
  prefersShareSheet,
  renderSummaryImage,
  shareImage,
  type ImageVariant,
} from "@/components/summaryImage";
import { useDraft, useViewMode } from "@/components/useDraft";
import { WIN_LINES } from "@/data/lines";
import { tr } from "@/i18n/tr";
import { buildSummary } from "@/lib/summary";

type State = "idle" | "working" | "failed";

interface Preview {
  blob: Blob;
  url: string;
  fileName: string;
}

const DOWNLOAD_ICON = (
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
    className="shrink-0"
  >
    <path d="M12 4v11M7 11l5 5 5-5M5 20h14" />
  </svg>
);

/**
 * Downloads the current prediction (or one part of it) as a PNG. On touch
 * devices the image opens in a preview first, from where it can be shared,
 * saved or long-pressed — a bare download link does not work in every mobile
 * browser (iOS in-app browsers, for example).
 */
export function DownloadImageButton({
  variant,
  shortLabel,
  primary = false,
  className = "",
}: {
  variant: ImageVariant;
  /** Label shown on narrow screens. */
  shortLabel?: string;
  primary?: boolean;
  className?: string;
}) {
  const [draft] = useDraft();
  const [mode] = useViewMode();
  const [state, setState] = useState<State>("idle");
  const [preview, setPreview] = useState<Preview | null>(null);

  async function handleClick() {
    setState("working");
    try {
      const summary = buildSummary(draft, WIN_LINES);
      const blob = await renderSummaryImage(summary, variant, mode);
      const fileName = tr.summary.fileName[variant](SEASON.id);
      if (prefersShareSheet()) {
        setPreview({ blob, url: URL.createObjectURL(blob), fileName });
      } else {
        downloadBlob(blob, fileName);
      }
      setState("idle");
    } catch {
      setState("failed");
    }
  }

  function closePreview() {
    if (preview) URL.revokeObjectURL(preview.url);
    setPreview(null);
  }

  const label = tr.summary.download[variant];

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        disabled={state === "working"}
        aria-label={state === "working" ? tr.summary.downloading : label}
        title={state === "failed" ? tr.summary.downloadError : undefined}
        className={`${primary ? ACTION_PRIMARY : ACTION_BUTTON} disabled:opacity-60 ${className}`}
      >
        {DOWNLOAD_ICON}
        {state === "working" ? (
          tr.summary.downloading
        ) : (
          <>
            <span className="sm:hidden">{shortLabel ?? label}</span>
            <span className="hidden sm:inline">{label}</span>
          </>
        )}
      </button>
      {state === "failed" && (
        <span role="alert" className="sr-only">
          {tr.summary.downloadError}
        </span>
      )}
      {preview && (
        <PreviewDialog
          preview={preview}
          title={tr.summary.imageTitle[variant]}
          onClose={closePreview}
        />
      )}
    </>
  );
}

function PreviewDialog({
  preview,
  title,
  onClose,
}: {
  preview: Preview;
  title: string;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [canShare] = useState(() => {
    const file = new File([preview.blob], preview.fileName, {
      type: "image/png",
    });
    return navigator.canShare?.({ files: [file] }) ?? false;
  });

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  async function handleShare() {
    if (!(await shareImage(preview.blob, preview.fileName))) {
      downloadBlob(preview.blob, preview.fileName);
    }
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="image-preview-title"
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) dialogRef.current?.close();
      }}
      className="bg-surface text-ink border-border m-auto max-h-[calc(100dvh-24px)] w-[calc(100vw-24px)] max-w-xl rounded-2xl border p-0 backdrop:bg-black/75"
    >
      <div className="flex max-h-[calc(100dvh-26px)] flex-col gap-4 p-4">
        <div className="flex items-center justify-between gap-3">
          <h2
            id="image-preview-title"
            className="font-display text-2xl leading-none font-extrabold tracking-[0.04em]"
          >
            {title}
          </h2>
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            aria-label={tr.summary.previewClose}
            className="text-ink-soft hover:bg-surface-active hover:text-ink flex size-11 shrink-0 items-center justify-center rounded-lg"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
        <div className="border-border min-h-0 flex-1 overflow-auto rounded-xl border">
          {/* A blob URL cannot go through next/image. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview.url} alt={title} className="block h-auto w-full" />
        </div>
        <p className="text-ink-soft text-sm leading-[1.45]">
          {tr.summary.previewHint}
        </p>
        <div className="flex gap-2">
          {canShare && (
            <button
              type="button"
              onClick={handleShare}
              className="bg-ink text-bg font-display flex h-12 flex-1 items-center justify-center gap-2 rounded-xl px-4 text-lg font-extrabold tracking-[0.06em] hover:bg-white"
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
                <path d="M12 15V3M7 8l5-5 5 5M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6" />
              </svg>
              {tr.summary.share}
            </button>
          )}
          <a
            href={preview.url}
            download={preview.fileName}
            className={`font-display flex h-12 flex-1 items-center justify-center gap-2 rounded-xl px-4 text-lg tracking-[0.06em] ${
              canShare
                ? "border-border-strong hover:bg-surface-active border font-bold"
                : "bg-ink text-bg font-extrabold hover:bg-white"
            }`}
          >
            {DOWNLOAD_ICON}
            {tr.summary.save}
          </a>
        </div>
      </div>
    </dialog>
  );
}
