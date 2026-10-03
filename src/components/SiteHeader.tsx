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
    <header className="border-border flex min-h-18 shrink-0 flex-wrap items-center justify-between gap-x-6 gap-y-3 border-b px-4 py-3 sm:px-6 lg:px-30">
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

      <nav
        aria-label={tr.nav.label}
        className="order-last w-full lg:order-none lg:w-auto"
      >
        <ol className="font-display grid grid-cols-3 gap-1 text-[15px] font-semibold tracking-[0.06em] sm:text-[17px] sm:tracking-[0.08em] lg:flex lg:gap-2">
          {STEPS.map((step) => (
            <li key={step.id}>
              <Link
                href={step.href}
                aria-current={current === step.id ? "step" : undefined}
                className={
                  current === step.id
                    ? "border-border-strong bg-surface-active text-ink block rounded-full border px-2 py-2 text-center whitespace-nowrap sm:px-3.5"
                    : "text-ink-muted hover:text-ink block border border-transparent px-2 py-2 text-center whitespace-nowrap sm:px-3.5"
                }
              >
                {step.label}
              </Link>
            </li>
          ))}
        </ol>
      </nav>

      <div className="flex items-baseline gap-2 sm:gap-3">
        <span className="text-ink-muted text-[11px] font-semibold tracking-[0.1em] sm:text-xs">
          <span className="sm:hidden" aria-hidden="true">
            {tr.lock.shortLabel}
          </span>
          <span className="max-sm:sr-only">{tr.lock.label}</span>
        </span>
        <time
          dateTime={SEASON.lockAt}
          className="font-display text-base font-bold whitespace-nowrap tabular-nums sm:text-xl"
        >
          {lockText}
        </time>
        <span className="text-ink-muted text-[11px] whitespace-nowrap sm:text-xs">
          {tr.lock.zone}
        </span>
      </div>
    </header>
  );
}
