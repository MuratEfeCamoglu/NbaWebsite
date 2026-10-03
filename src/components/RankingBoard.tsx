"use client";

import Link from "next/link";
import {
  ACTION_BUTTON,
  ACTION_PRIMARY,
  ActionBar,
} from "@/components/ActionBar";
import { DownloadImageButton } from "@/components/DownloadImageButton";
import { LockNotice } from "@/components/LockNotice";
import { RankingList } from "@/components/RankingList";
import { WarnIcon } from "@/components/WarnIcon";
import { useDraft, useIsLocked } from "@/components/useDraft";
import {
  CONFERENCES,
  getTeam,
  type Conference,
  type TeamId,
} from "@/data/teams";
import { tr } from "@/i18n/tr";
import {
  describeAbove,
  rankingConflicts,
  sortByProjection,
} from "@/lib/consistency";
import { setRanking } from "@/lib/draft";
import { defaultRanking } from "@/lib/ranking";
import type { Draft } from "@/lib/validation";

const DEFAULT_RANKING = defaultRanking();

export function RankingBoard() {
  const [draft, update] = useDraft();
  const locked = useIsLocked();
  const ranking = draft.ranking ?? DEFAULT_RANKING;

  function changeConference(conference: Conference, order: TeamId[]) {
    update((current) =>
      setRanking(current, {
        ...(current.ranking ?? DEFAULT_RANKING),
        [conference]: order,
      }),
    );
  }

  function sortConference(conference: Conference) {
    update((current) => {
      const base = current.ranking ?? DEFAULT_RANKING;
      return setRanking(current, {
        ...base,
        [conference]: sortByProjection(base[conference], current.picks),
      });
    });
  }

  return (
    <>
      <div className="flex flex-col gap-6 px-4 sm:px-6 lg:px-30">
        {locked && <LockNotice />}
        <div className="grid gap-8 md:grid-cols-2 lg:gap-12">
          {CONFERENCES.map((conference) => (
            <section
              key={conference}
              aria-labelledby={`ranking-title-${conference}`}
              className="flex min-w-0 flex-col gap-3.5"
            >
              <h2
                id={`ranking-title-${conference}`}
                className="font-display flex items-baseline gap-3.5 text-3xl leading-none font-extrabold tracking-[0.04em] sm:text-4xl"
              >
                {tr.conference[conference]}
                <span className="text-ink-muted text-base font-semibold tracking-[0.1em] sm:text-lg">
                  {tr.conference.suffix}
                </span>
              </h2>
              <ConflictNotice
                order={ranking[conference]}
                picks={draft.picks}
                disabled={locked}
                onSort={() => sortConference(conference)}
              />
              <RankingList
                conference={conference}
                order={ranking[conference]}
                picks={draft.picks}
                onChange={(order) => changeConference(conference, order)}
                disabled={locked}
              />
            </section>
          ))}
        </div>
        <p className="text-ink-muted text-[13px] leading-[1.5] max-sm:hidden">
          {tr.ranking.keyboardHint}
        </p>
      </div>

      <div className="flex-1" />

      <ActionBar status={draft.ranking ? tr.ranking.saved : tr.ranking.unsaved}>
        <button
          type="button"
          disabled={locked || draft.ranking === null}
          onClick={() =>
            update((current) => setRanking(current, DEFAULT_RANKING))
          }
          className={`${ACTION_BUTTON} disabled:opacity-40 disabled:hover:bg-transparent`}
        >
          <span className="sm:hidden" aria-hidden="true">
            {tr.ranking.resetShort}
          </span>
          <span className="max-sm:sr-only">{tr.ranking.reset}</span>
        </button>
        <DownloadImageButton
          variant="ranking"
          shortLabel={tr.summary.downloadShort}
        />
        <Link
          href="/alt-ust"
          onClick={() =>
            update((current) =>
              current.ranking ? current : setRanking(current, ranking),
            )
          }
          className={ACTION_PRIMARY}
        >
          {tr.ranking.next}
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
      </ActionBar>
    </>
  );
}

function ConflictNotice({
  order,
  picks,
  disabled,
  onSort,
}: {
  order: readonly TeamId[];
  picks: Draft["picks"];
  disabled: boolean;
  onSort: () => void;
}) {
  const conflicts = rankingConflicts(order, picks);
  if (conflicts.length === 0) return null;
  const nameOf = (teamId: TeamId) => getTeam(teamId).name;

  return (
    <div className="border-warn/40 bg-warn/8 flex flex-col gap-3 rounded-2xl border px-4 py-3.5 text-sm leading-[1.45] text-[#F3E7B8]">
      <p className="font-display text-warn flex items-center gap-2 text-lg font-bold tracking-[0.06em]">
        <WarnIcon />
        {tr.ranking.conflictTitle}
      </p>
      <ul className="flex list-disc flex-col gap-1 pl-5">
        {conflicts.map((conflict) => (
          <li key={conflict.teamId}>
            {tr.ranking.conflictItem(
              nameOf(conflict.teamId),
              conflict.projectedWins,
              describeAbove(conflict, nameOf),
              conflict.above.length,
            )}
          </li>
        ))}
      </ul>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <button
          type="button"
          onClick={onSort}
          disabled={disabled}
          className="bg-warn text-warn-ink font-display flex h-11 items-center rounded-xl px-4 text-base font-extrabold tracking-[0.06em] disabled:opacity-40"
        >
          {tr.ranking.sortByProjection}
        </button>
        <span className="text-ink-soft text-[13px]">{tr.ranking.sortHint}</span>
      </div>
    </div>
  );
}
