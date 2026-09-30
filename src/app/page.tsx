import { SEASON } from "@config/season";
import { TeamBadge } from "@/components/TeamBadge";
import { TEAMS, type Conference } from "@/data/teams";
import { tr } from "@/i18n/tr";
import { formatDateTime } from "@/lib/datetime";

const CONFERENCES: Conference[] = ["West", "East"];

/** "2026-27" → "26–27" */
function shortSeason(season: string): string {
  return season.slice(2).replace("-", "–");
}

export default function HomePage() {
  const lockText = formatDateTime(SEASON.lockAt, SEASON.displayTimeZone);

  return (
    <div className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col">
      <header className="border-border flex h-18 shrink-0 items-center justify-between gap-6 border-b px-6 lg:px-30">
        <div className="flex items-center gap-3">
          <span className="bg-ink text-bg font-display flex h-8 items-center rounded-lg px-2.5 text-lg font-extrabold tracking-[0.04em]">
            {shortSeason(SEASON.id)}
          </span>
          <span className="font-display text-[22px] font-bold tracking-[0.08em]">
            {tr.brand.name}
          </span>
        </div>
        <div className="flex items-baseline gap-3 text-right">
          <span className="text-ink-muted text-xs font-semibold tracking-[0.1em]">
            {tr.home.lockLabel}
          </span>
          <time
            dateTime={SEASON.lockAt}
            className="font-display text-xl font-bold tabular-nums"
          >
            {lockText}
          </time>
          <span className="text-ink-muted text-xs">{tr.home.lockZone}</span>
        </div>
      </header>

      <main className="flex flex-1 flex-col gap-16 px-6 py-14 lg:px-30">
        <section className="flex flex-col gap-4">
          <p className="text-ink-muted text-[13px] font-semibold tracking-[0.14em]">
            {tr.home.eyebrow(SEASON.id)}
          </p>
          <h1 className="font-display max-w-[900px] text-7xl leading-[0.9] font-extrabold tracking-[0.01em] lg:text-8xl">
            {tr.home.title}
          </h1>
          <p className="text-ink-soft mt-2 max-w-[620px] text-[17px] leading-[1.55]">
            {tr.home.lead}
          </p>
          <p className="border-border-strong text-ink-soft mt-2 flex w-fit items-center gap-2 rounded-full border border-dashed px-3 py-1.5 text-xs">
            <span className="font-semibold tracking-[0.08em]">
              {tr.home.comingSoon}
            </span>
            <span aria-hidden="true" className="text-ink-faint">
              ·
            </span>
            <span>{tr.home.comingSoonText}</span>
          </p>
        </section>

        <section aria-labelledby="steps-title" className="flex flex-col gap-5">
          <h2
            id="steps-title"
            className="text-ink-muted text-xs font-semibold tracking-[0.14em]"
          >
            {tr.home.stepsTitle}
          </h2>
          <ol className="grid gap-4 md:grid-cols-3">
            {tr.home.steps.map((step) => (
              <li
                key={step.number}
                className="border-border bg-surface-raised flex flex-col gap-2 rounded-2xl border p-6"
              >
                <span className="font-display text-ink-faint text-3xl font-bold tabular-nums">
                  {step.number}
                </span>
                <span className="font-display text-2xl font-bold tracking-[0.06em]">
                  {step.title}
                </span>
                <span className="text-ink-soft text-sm leading-[1.5]">
                  {step.text}
                </span>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="teams-title" className="flex flex-col gap-5">
          <div className="flex items-baseline justify-between">
            <h2
              id="teams-title"
              className="text-ink-muted text-xs font-semibold tracking-[0.14em]"
            >
              {tr.home.teamsTitle}
            </h2>
            <span className="text-ink-soft text-sm">
              {tr.home.teamCount(TEAMS.length)}
            </span>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {CONFERENCES.map((conference) => (
              <div
                key={conference}
                className="border-border bg-surface flex flex-col gap-5 rounded-2xl border p-6"
              >
                <h3 className="font-display flex items-baseline gap-3 text-4xl leading-none font-extrabold tracking-[0.04em]">
                  {tr.conference[conference]}
                  <span className="text-ink-muted text-lg font-semibold tracking-[0.1em]">
                    {tr.conference.suffix}
                  </span>
                </h3>
                <ul className="flex flex-wrap gap-3">
                  {TEAMS.filter((team) => team.conference === conference).map(
                    (team) => (
                      <li key={team.id}>
                        <TeamBadge teamId={team.id} />
                      </li>
                    ),
                  )}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-border text-ink-muted flex flex-col gap-1 border-t px-6 py-6 text-[13px] leading-[1.5] lg:px-30">
        <p>{tr.footer.disclaimer}</p>
        <p>{tr.footer.unofficial}</p>
      </footer>
    </div>
  );
}
