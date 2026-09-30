"use client";

import Link from "next/link";
import { DownloadImageButton } from "@/components/DownloadImageButton";
import { LockNotice } from "@/components/LockNotice";
import { RankingList } from "@/components/RankingList";
import { useDraft, useIsLocked } from "@/components/useDraft";
import { CONFERENCES, type Conference, type TeamId } from "@/data/teams";
import { tr } from "@/i18n/tr";
import { setRanking } from "@/lib/draft";
import { defaultRanking } from "@/lib/ranking";

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

  return (
    <>
      <div className="flex flex-col gap-6 px-6 lg:px-30">
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
                className="font-display flex items-baseline gap-3.5 text-4xl leading-none font-extrabold tracking-[0.04em]"
              >
                {tr.conference[conference]}
                <span className="text-ink-muted text-lg font-semibold tracking-[0.1em]">
                  {tr.conference.suffix}
                </span>
              </h2>
              <RankingList
                conference={conference}
                order={ranking[conference]}
                onChange={(order) => changeConference(conference, order)}
                disabled={locked}
              />
            </section>
          ))}
        </div>
        <p className="text-ink-muted text-[13px] leading-[1.5]">
          {tr.ranking.keyboardHint}
        </p>
      </div>

      <div className="flex-1" />

      <div className="border-border bg-bg sticky bottom-0 z-20 mt-10 flex flex-wrap items-center justify-between gap-4 border-t px-6 py-5 lg:px-30">
        <p role="status" className="text-ink-soft text-sm">
          {draft.ranking ? tr.ranking.saved : tr.ranking.unsaved}
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            disabled={locked || draft.ranking === null}
            onClick={() =>
              update((current) => setRanking(current, DEFAULT_RANKING))
            }
            className="border-border-strong font-display hover:bg-surface-active flex h-13 items-center rounded-xl border px-6 text-xl font-bold tracking-[0.08em] disabled:opacity-40 disabled:hover:bg-transparent"
          >
            {tr.ranking.reset}
          </button>
          <DownloadImageButton variant="ranking" />
          <Link
            href="/alt-ust"
            onClick={() =>
              update((current) =>
                current.ranking ? current : setRanking(current, ranking),
              )
            }
            className="bg-ink text-bg font-display flex h-13 items-center gap-2 rounded-xl px-7 text-xl font-extrabold tracking-[0.08em] hover:bg-white"
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
        </div>
      </div>
    </>
  );
}
