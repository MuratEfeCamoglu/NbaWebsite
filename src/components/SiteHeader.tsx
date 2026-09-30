import Link from "next/link";
import { SEASON } from "@config/season";
import { tr } from "@/i18n/tr";
import { formatDateTime } from "@/lib/datetime";

export type Step = "ranking" | "picks" | "summary";

const STEPS: { id: Step; href: string; label: string }[] = [
  { id: "ranking", href: "/siralama", label: tr.nav.ranking },
  { id: "picks", href: "/alt-ust", label: tr.nav.picks },
  { id: "summary", href: "/ozet", label: tr.nav.summary },
];

/** "2026-27" → "26–27" */
function shortSeason(season: string): string {
  return season.slice(2).replace("-", "–");
}

export function SiteHeader({ current }: { current?: Step }) {
  const lockText = formatDateTime(SEASON.lockAt, SEASON.displayTimeZone);

  return (
    <header className="border-border flex min-h-18 shrink-0 flex-wrap items-center justify-between gap-x-6 gap-y-2 border-b px-6 py-3 lg:px-30">
      <Link
        href="/"
        aria-label={tr.brand.homeLabel}
        className="flex items-center gap-3"
      >
        <span className="bg-ink text-bg font-display flex h-8 items-center rounded-lg px-2.5 text-lg font-extrabold tracking-[0.04em]">
          {shortSeason(SEASON.id)}
        </span>
        <span className="font-display text-[22px] font-bold tracking-[0.08em]">
          {tr.brand.name}
        </span>
      </Link>

      <nav aria-label={tr.nav.label}>
        <ol className="font-display flex gap-2 text-[17px] font-semibold tracking-[0.08em]">
          {STEPS.map((step) => (
            <li key={step.id}>
              <Link
                href={step.href}
                aria-current={current === step.id ? "step" : undefined}
                className={
                  current === step.id
                    ? "border-border-strong bg-surface-active text-ink block rounded-full border px-3.5 py-2"
                    : "text-ink-muted hover:text-ink block border border-transparent px-3.5 py-2"
                }
              >
                {step.label}
              </Link>
            </li>
          ))}
        </ol>
      </nav>

      <div className="flex items-baseline gap-3">
        <span className="text-ink-muted text-xs font-semibold tracking-[0.1em]">
          {tr.lock.label}
        </span>
        <time
          dateTime={SEASON.lockAt}
          className="font-display text-xl font-bold tabular-nums"
        >
          {lockText}
        </time>
        <span className="text-ink-muted text-xs">{tr.lock.zone}</span>
      </div>
    </header>
  );
}
