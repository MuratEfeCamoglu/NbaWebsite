import { SEASON } from "@config/season";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { TeamBadge } from "@/components/TeamBadge";
import { CONFERENCES, TEAMS } from "@/data/teams";
import { tr } from "@/i18n/tr";

export default function HomePage() {
  return (
    <div className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col">
      <SiteHeader />

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
          <Link
            href="/siralama"
            className="bg-ink text-bg font-display mt-4 flex h-13 w-fit items-center gap-2 rounded-xl px-7 text-xl font-extrabold tracking-[0.08em] hover:bg-white"
          >
            {tr.home.start}
          </Link>
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
