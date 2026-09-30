"use client";

import Link from "next/link";
import { useState } from "react";
import { DownloadImageButton } from "@/components/DownloadImageButton";
import { LockNotice } from "@/components/LockNotice";
import { OverUnderRow, ROW_GRID } from "@/components/OverUnderRow";
import { SectionTitle } from "@/components/SectionTitle";
import { ViewToggle } from "@/components/ViewToggle";
import { WinTotalMeter } from "@/components/WinTotalMeter";
import { useDraft, useIsLocked, useViewMode } from "@/components/useDraft";
import { WIN_LINES } from "@/data/lines";
import { CONFERENCES, type Conference } from "@/data/teams";
import { tr } from "@/i18n/tr";
import { setConfidence, setProjectedWins, toggleSide } from "@/lib/draft";
import { buildSummary, summarySections } from "@/lib/summary";

type Filter = Conference | "all";

const NEEDS_REVIEW = new Set(
  WIN_LINES.filter((line) => line.needsReview === true).map(
    (line) => line.teamId,
  ),
);
const FILTERS: Filter[] = [...CONFERENCES, "all"];

export function OverUnderBoard() {
  const [draft, update] = useDraft();
  const [mode] = useViewMode();
  const locked = useIsLocked();
  const [filter, setFilter] = useState<Filter>("all");

  const summary = buildSummary(draft, WIN_LINES);
  const sections = summarySections(
    summary,
    mode,
    CONFERENCES.filter(
      (conference) => filter === "all" || filter === conference,
    ),
  );

  return (
    <>
      <div className="bg-bg top-0 z-20 px-6 pt-3 pb-5 lg:sticky lg:px-30">
        <WinTotalMeter total={summary.total} />
      </div>

      <div className="flex flex-col gap-4 px-6 lg:px-30">
        {locked && <LockNotice />}
        {!summary.ranked && (
          <p className="text-ink-soft text-sm">
            {tr.picks.unranked}{" "}
            <Link href="/siralama" className="text-ink underline">
              {tr.picks.unrankedLink}
            </Link>
          </p>
        )}

        <div className="flex flex-wrap items-center justify-between gap-4 py-1">
          <div className="flex flex-wrap items-center gap-3">
            <div
              role="group"
              aria-label={tr.conference.tabsLabel}
              className="border-border bg-surface-raised flex gap-1 rounded-xl border p-1"
            >
              {FILTERS.map((option) => {
                const selected = filter === option;
                return (
                  <button
                    key={option}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => setFilter(option)}
                    className={`font-display flex h-11 items-center gap-2 rounded-[9px] px-5 text-lg font-bold tracking-[0.08em] ${
                      selected
                        ? "bg-ink text-bg"
                        : "text-ink-soft hover:text-ink"
                    }`}
                  >
                    {tr.conference[option]}
                    <span
                      className={`text-[15px] ${selected ? "text-[#3A4868]" : "text-ink-muted"}`}
                    >
                      {option === "all"
                        ? summary.teamCount
                        : summary.conferences[option].length}
                    </span>
                  </button>
                );
              })}
            </div>
            <ViewToggle />
          </div>
          <div className="flex items-center gap-4">
            <span className="text-ink-soft text-sm">
              <strong className="font-display text-ink text-[22px] font-bold">
                {summary.pickedCount}
              </strong>{" "}
              {tr.picks.pickedOf(summary.teamCount)}
            </span>
            <div
              aria-hidden="true"
              className="bg-border h-1.5 w-50 overflow-hidden rounded-full"
            >
              <div
                className="bg-ink h-1.5 rounded-full"
                style={{
                  width: `${(summary.pickedCount / summary.teamCount) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-10">
          {sections.map((section) => (
            <section
              key={section.id}
              aria-labelledby={`picks-title-${section.id}`}
              className="flex flex-col gap-3.5"
            >
              <div className="flex items-baseline justify-between">
                <SectionTitle
                  id={`picks-title-${section.id}`}
                  section={section}
                />
                <div className="text-ink-soft text-sm">
                  <strong className="font-display text-ink text-xl font-bold">
                    {section.rows.filter((row) => row.side).length}
                  </strong>{" "}
                  {tr.picks.conferencePicked(section.rows.length)}
                </div>
              </div>

              <div className="border-border bg-surface overflow-hidden rounded-2xl border">
                <div
                  aria-hidden="true"
                  className={`${ROW_GRID} border-border bg-surface-raised text-ink-muted h-12 border-b text-xs font-semibold tracking-[0.14em]`}
                >
                  <div className="text-right">{tr.picks.columns.rank}</div>
                  <div>{tr.picks.columns.team}</div>
                  <div className="text-right">{tr.picks.columns.line}</div>
                  <div>{tr.picks.columns.side}</div>
                  <div>{tr.picks.columns.confidence}</div>
                  <div>{tr.picks.columns.projection}</div>
                </div>
                <ol>
                  {section.rows.map(({ teamId, rank, line }) => (
                    <OverUnderRow
                      key={teamId}
                      teamId={teamId}
                      rank={rank}
                      line={line}
                      needsReview={NEEDS_REVIEW.has(teamId)}
                      pick={draft.picks[teamId]}
                      disabled={locked}
                      onToggleSide={(side) =>
                        update((current) => toggleSide(current, teamId, side))
                      }
                      onConfidence={(confidence) =>
                        update((current) =>
                          setConfidence(current, teamId, confidence),
                        )
                      }
                      onProjection={(wins) =>
                        update((current) =>
                          setProjectedWins(current, teamId, wins),
                        )
                      }
                    />
                  ))}
                </ol>
              </div>
            </section>
          ))}
        </div>

        <p className="text-ink-muted text-[13px] leading-[1.5]">
          {tr.picks.footnote} {tr.picks.needsReviewMark} {tr.picks.needsReview}.
        </p>
      </div>

      <div className="flex-1" />

      <div className="border-border bg-bg sticky bottom-0 z-20 mt-10 flex flex-wrap items-center justify-between gap-4 border-t px-6 py-5 lg:px-30">
        <p role="status" className="text-ink-soft text-sm">
          {tr.picks.remaining(summary.teamCount - summary.pickedCount)}
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/siralama"
            className="border-border-strong font-display hover:bg-surface-active flex h-13 items-center gap-2 rounded-xl border px-6 text-xl font-bold tracking-[0.08em]"
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
              <path d="M19 12H5M11 6l-6 6 6 6" />
            </svg>
            {tr.picks.back}
          </Link>
          <DownloadImageButton variant="picks" />
          <Link
            href="/ozet"
            className="bg-ink text-bg font-display flex h-13 items-center gap-2 rounded-xl px-7 text-xl font-extrabold tracking-[0.08em] hover:bg-white"
          >
            {tr.picks.next}
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
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>
        </div>
      </div>
    </>
  );
}
