"use client";

import Link from "next/link";
import { ACTION_BUTTON, ActionBar } from "@/components/ActionBar";
import { DownloadImageButton } from "@/components/DownloadImageButton";
import { SectionTitle } from "@/components/SectionTitle";
import { TeamBadge } from "@/components/TeamBadge";
import { ViewToggle } from "@/components/ViewToggle";
import { WinTotalMeter } from "@/components/WinTotalMeter";
import { useDraft, useViewMode } from "@/components/useDraft";
import { WIN_LINES } from "@/data/lines";
import { CONFERENCES, getTeam, type TeamId } from "@/data/teams";
import { tr } from "@/i18n/tr";
import {
  buildSummary,
  summarySections,
  type Summary,
  type SummaryRow,
} from "@/lib/summary";
import { describeAbove, rankingConflicts } from "@/lib/consistency";
import { formatLine } from "@/lib/totals";
import type { Draft } from "@/lib/validation";

const STAR_PATH =
  "M12 2.8l2.83 5.73 6.33.92-4.58 4.46 1.08 6.3L12 17.24l-5.66 2.97 1.08-6.3-4.58-4.46 6.33-.92z";
// Phones drop the separate stars column; the stars sit under the Alt/Üst chip.
const ROW_GRID =
  "grid grid-cols-[22px_40px_minmax(0,1fr)_40px_56px_38px] items-center gap-x-2 px-3 sm:grid-cols-[36px_48px_minmax(0,1fr)_56px_76px_60px_56px] sm:gap-x-3 sm:px-4";

export function SummaryBoard() {
  const [draft] = useDraft();
  const [mode] = useViewMode();
  const summary = buildSummary(draft, WIN_LINES);

  return (
    <>
      <div className="flex flex-col gap-8 px-4 sm:px-6 lg:px-30">
        <WinTotalMeter total={summary.total} />

        <dl className="grid grid-cols-2 gap-4 lg:grid-cols-5">
          <Stat
            label={tr.summary.stats.picked}
            value={`${summary.pickedCount} / ${summary.teamCount}`}
          />
          <Stat
            label={tr.picks.over}
            value={String(summary.overCount)}
            tone="text-over"
          />
          <Stat
            label={tr.picks.under}
            value={String(summary.underCount)}
            tone="text-under"
          />
          <Stat
            label={tr.summary.stats.projections}
            value={String(summary.projectionCount)}
          />
          <Stat
            label={tr.summary.stats.maxPoints}
            value={String(summary.maxPoints)}
          />
        </dl>

        <Warnings summary={summary} draft={draft} />

        <div className="flex">
          <ViewToggle />
        </div>

        <div className="grid gap-8 xl:grid-cols-2 xl:gap-10">
          {CONFERENCES.map((conference) => (
            <div key={conference} className="flex min-w-0 flex-col gap-8">
              {summarySections(summary, mode, [conference]).map((section) => (
                <section
                  key={section.id}
                  aria-labelledby={`summary-title-${section.id}`}
                  className="flex min-w-0 flex-col gap-3.5"
                >
                  <SectionTitle
                    id={`summary-title-${section.id}`}
                    section={section}
                  />
                  <div className="border-border bg-surface overflow-hidden rounded-2xl border">
                    <div
                      aria-hidden="true"
                      className={`${ROW_GRID} border-border bg-surface-raised text-ink-muted h-10 border-b text-[10px] font-semibold tracking-[0.04em] sm:text-[11px] sm:tracking-[0.12em]`}
                    >
                      <div className="text-right">
                        <span className="sm:hidden">#</span>
                        <span className="max-sm:hidden">
                          {tr.picks.columns.rank}
                        </span>
                      </div>
                      <div className="col-span-2">{tr.picks.columns.team}</div>
                      <div className="text-right">{tr.picks.columns.line}</div>
                      <div className="max-sm:text-center">
                        {tr.summary.columns.side}
                      </div>
                      <div className="max-sm:hidden">
                        {tr.picks.columns.confidence}
                      </div>
                      <div className="text-right">
                        {tr.summary.columns.projection}
                      </div>
                    </div>
                    <ol>
                      {section.rows.map((row) => (
                        <SummaryLine key={row.teamId} row={row} />
                      ))}
                    </ol>
                  </div>
                </section>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1" />

      <ActionBar status={tr.summary.downloadHint}>
        <Link href="/alt-ust" className={`${ACTION_BUTTON} max-sm:hidden`}>
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
          {tr.summary.back}
        </Link>
        <DownloadImageButton
          variant="ranking"
          shortLabel={tr.summary.downloadVariantShort.ranking}
        />
        <DownloadImageButton
          variant="picks"
          shortLabel={tr.summary.downloadVariantShort.picks}
        />
        <DownloadImageButton
          variant="all"
          shortLabel={tr.summary.downloadVariantShort.all}
          primary
        />
      </ActionBar>
    </>
  );
}

function Stat({
  label,
  value,
  tone = "text-ink",
}: {
  label: string;
  value: string;
  tone?: string;
}) {
  return (
    <div className="border-border bg-surface-raised flex flex-col gap-1 rounded-2xl border px-5 py-4">
      <dt className="text-ink-muted text-xs font-semibold tracking-[0.14em]">
        {label}
      </dt>
      <dd
        className={`font-display text-4xl leading-none font-extrabold tabular-nums ${tone}`}
      >
        {value}
      </dd>
    </div>
  );
}

function Warnings({ summary, draft }: { summary: Summary; draft: Draft }) {
  const items: string[] = [];
  if (!summary.ranked) items.push(tr.summary.warn.unranked);
  if (summary.pickedCount < summary.teamCount) {
    items.push(
      tr.summary.warn.incomplete(summary.teamCount - summary.pickedCount),
    );
  }
  if (summary.totalStatus.level === "off") {
    items.push(tr.summary.warn.total(summary.totalStatus.deviation));
  }
  if (draft.ranking) {
    const nameOf = (teamId: TeamId) => getTeam(teamId).name;
    for (const conference of CONFERENCES) {
      for (const conflict of rankingConflicts(
        draft.ranking[conference],
        draft.picks,
      )) {
        const team = getTeam(conflict.teamId);
        items.push(
          tr.summary.warn.ranking(
            `${team.city} ${team.name}`,
            conflict.projectedWins,
            describeAbove(conflict, nameOf),
            conflict.above.length,
          ),
        );
      }
    }
  }
  for (const row of summary.conflicts) {
    if (row.conflict && row.projectedWins !== undefined) {
      const team = getTeam(row.teamId);
      items.push(
        `${team.city} ${team.name}: ${tr.picks.conflict[row.conflict](row.projectedWins, formatLine(row.line))}`,
      );
    }
  }

  if (items.length === 0) {
    return <p className="text-ink-soft text-sm">{tr.summary.warn.none}</p>;
  }
  return (
    <section
      aria-labelledby="summary-warnings"
      className="border-warn/40 bg-warn/8 flex flex-col gap-2 rounded-2xl border px-5 py-4"
    >
      <h2
        id="summary-warnings"
        className="font-display text-warn text-xl font-bold tracking-[0.06em]"
      >
        {tr.summary.warn.title}
      </h2>
      <ul className="flex list-disc flex-col gap-1 pl-5 text-sm leading-[1.45] text-[#F3E7B8]">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}

function SummaryLine({ row }: { row: SummaryRow }) {
  const team = getTeam(row.teamId);
  const tone =
    row.side === "over"
      ? "text-over"
      : row.side === "under"
        ? "text-under"
        : "";

  return (
    <li
      data-team={row.teamId}
      className={`${ROW_GRID} border-border h-16 border-b last:border-b-0 ${
        row.side === "over"
          ? "bg-over/5"
          : row.side === "under"
            ? "bg-under/5"
            : ""
      }`}
    >
      <div className="font-display text-ink-muted text-right text-xl font-bold tabular-nums sm:text-2xl">
        {row.rank ?? "–"}
      </div>
      <TeamBadge teamId={row.teamId} />
      <div className="flex min-w-0 flex-col gap-0.5">
        <div
          lang="en"
          className="text-ink-muted truncate text-[11px] font-medium tracking-[0.06em] uppercase"
        >
          {team.city}
        </div>
        <div
          lang="en"
          className="font-display truncate text-lg leading-none font-bold tracking-[0.03em] uppercase sm:text-xl"
        >
          {team.name}
        </div>
      </div>
      <div className="font-display text-right text-xl font-extrabold tabular-nums sm:text-2xl">
        {formatLine(row.line)}
      </div>
      <div className="flex flex-col gap-1">
        {row.side ? (
          <span
            className={`font-display flex h-7 items-center justify-center rounded-lg text-sm font-bold tracking-[0.06em] sm:h-8 sm:text-base sm:tracking-[0.08em] ${
              row.side === "over"
                ? "bg-over text-over-ink"
                : "bg-under text-under-ink"
            }`}
          >
            {row.side === "over" ? tr.picks.over : tr.picks.under}
          </span>
        ) : (
          <span className="text-ink-faint block text-center">
            <span aria-hidden="true">—</span>
            <span className="sr-only">{tr.summary.noPick}</span>
          </span>
        )}
        {row.side && (
          <Stars
            confidence={row.confidence}
            size={12}
            className={`justify-center sm:hidden ${tone}`}
          />
        )}
      </div>
      <Stars
        confidence={row.confidence}
        size={20}
        className={`max-sm:hidden ${tone}`}
      />
      <div
        className={`font-display text-right text-xl font-bold tabular-nums sm:text-2xl ${
          row.conflict ? "text-warn" : ""
        }`}
      >
        {row.projectedWins ?? <span className="text-ink-faint">—</span>}
      </div>
    </li>
  );
}

function Stars({
  confidence,
  size,
  className,
}: {
  confidence: SummaryRow["confidence"];
  size: number;
  className: string;
}) {
  return (
    <div
      className={`flex ${className}`}
      role="img"
      aria-label={tr.picks.confidenceStar(confidence ?? 0)}
    >
      {[1, 2, 3].map((level) => {
        const on = (confidence ?? 0) >= level;
        return (
          <svg
            key={level}
            width={size}
            height={size}
            viewBox="0 0 24 24"
            aria-hidden="true"
            className={on ? "" : "text-border-strong"}
          >
            <path
              d={STAR_PATH}
              fill={on ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
          </svg>
        );
      })}
    </div>
  );
}
