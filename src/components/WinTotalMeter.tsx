import { SEASON, TOTAL_WINS } from "@config/season";
import { tr } from "@/i18n/tr";
import { formatDeviation, totalStatus } from "@/lib/totals";

const TOLERANCE = SEASON.projectionTotalTolerance;

/** League-wide sanity check: the user's total wins against 1230. */
export function WinTotalMeter({ total }: { total: number }) {
  const { deviation, level, markerPercent } = totalStatus(total);
  const off = level === "off";

  return (
    <div
      role="status"
      aria-live="polite"
      className={`grid items-center gap-x-10 gap-y-4 rounded-2xl border px-4 py-4 sm:px-7 sm:py-5 lg:grid-cols-[300px_minmax(0,1fr)_360px] ${
        off ? "border-warn/55 bg-[#15130C]" : "border-border bg-surface-raised"
      }`}
    >
      <div className="flex flex-col gap-1">
        <div className="text-ink-muted text-xs font-semibold tracking-[0.14em]">
          {tr.meter.label}
        </div>
        <div className="font-display flex items-baseline gap-2.5 font-extrabold tabular-nums">
          <span
            data-testid="win-total"
            className={`text-5xl leading-none sm:text-6xl ${off ? "text-warn" : "text-ink"}`}
          >
            {total}
          </span>
          <span className="text-ink-faint text-3xl">/</span>
          <span className="text-ink-soft text-3xl">{TOTAL_WINS}</span>
          <span
            className={`ml-1.5 rounded-md px-2 py-0.5 text-xl ${
              off ? "bg-warn text-warn-ink" : "bg-border text-ink-soft"
            }`}
          >
            {formatDeviation(deviation)}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-2.5" aria-hidden="true">
        <div className="border-border bg-surface-active relative h-2.5 rounded-full border">
          <div className="bg-border absolute inset-y-0 left-1/4 w-1/2" />
          <div className="bg-ink-faint absolute -inset-y-1.5 left-1/2 -ml-px w-0.5" />
          <div
            className={`absolute -top-[9px] -ml-[3px] h-7 w-1.5 rounded-[3px] shadow-[0_0_0_3px_var(--color-bg)] ${
              off ? "bg-warn" : "bg-ink"
            }`}
            style={{ left: `${markerPercent}%` }}
          />
        </div>
        <div className="font-display text-ink-muted flex justify-between text-sm font-semibold tabular-nums">
          <span>{formatDeviation(-TOLERANCE * 2)}</span>
          <span>{tr.meter.scaleCenter(TOLERANCE)}</span>
          <span>{formatDeviation(TOLERANCE * 2)}</span>
        </div>
      </div>

      <div className="flex items-start gap-3">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className={`mt-0.5 shrink-0 ${off ? "text-warn" : "text-ink-soft"}`}
        >
          {off ? (
            <>
              <path d="M12 3.5L2.5 20h19L12 3.5z" />
              <path d="M12 10v4.5" />
              <path d="M12 17.4v.1" />
            </>
          ) : (
            <>
              <circle cx="12" cy="12" r="9" />
              <path d="M8 12.3l2.7 2.7L16 9.5" />
            </>
          )}
        </svg>
        <div className="flex flex-col gap-1">
          <div
            className={`font-display text-xl font-bold tracking-[0.06em] ${
              off ? "text-warn" : "text-ink"
            }`}
          >
            {off ? tr.meter.offTitle : tr.meter.balancedTitle}
          </div>
          <div className="text-ink-soft text-sm leading-[1.45]">
            {off
              ? tr.meter.offText(deviation, TOTAL_WINS)
              : tr.meter.balancedText(TOTAL_WINS)}
          </div>
        </div>
      </div>
    </div>
  );
}
