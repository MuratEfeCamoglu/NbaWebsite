import { TeamBadge } from "@/components/TeamBadge";
import { getTeam, type TeamId } from "@/data/teams";
import { tr } from "@/i18n/tr";
import { pickConflict } from "@/lib/consistency";
import { parseProjectedWins } from "@/lib/draft";
import { formatLine } from "@/lib/totals";
import type { DraftPick } from "@/lib/validation";

type Side = NonNullable<DraftPick["side"]>;
type Confidence = NonNullable<DraftPick["confidence"]>;

export const ROW_GRID =
  "grid grid-cols-[40px_minmax(0,1fr)_72px_168px_132px_72px] items-center gap-x-3 px-4 lg:grid-cols-[56px_minmax(0,1fr)_112px_212px_152px_104px] lg:gap-x-6 lg:px-6";

const CONFIDENCE_LEVELS: Confidence[] = [1, 2, 3];
const STAR_PATH =
  "M12 2.8l2.83 5.73 6.33.92-4.58 4.46 1.08 6.3L12 17.24l-5.66 2.97 1.08-6.3-4.58-4.46 6.33-.92z";

interface OverUnderRowProps {
  teamId: TeamId;
  /** Rank within the conference, or null when the user has not ranked yet. */
  rank: number | null;
  line: number;
  needsReview: boolean;
  pick: DraftPick | undefined;
  disabled: boolean;
  onToggleSide: (side: Side) => void;
  onConfidence: (confidence: Confidence) => void;
  onProjection: (projectedWins: number | undefined) => void;
}

export function OverUnderRow({
  teamId,
  rank,
  line,
  needsReview,
  pick,
  disabled,
  onToggleSide,
  onConfidence,
  onProjection,
}: OverUnderRowProps) {
  const team = getTeam(teamId);
  const label = `${team.city} ${team.name}`;
  const side = pick?.side;
  const conflict = pickConflict(line, pick);
  const lineText = formatLine(line);

  const rowTint =
    side === "over" ? "bg-over/5" : side === "under" ? "bg-under/5" : "";
  const starTone =
    side === "over" ? "text-over" : side === "under" ? "text-under" : "";

  return (
    <li
      data-team={teamId}
      className={`border-border flex flex-col border-b last:border-b-0 ${rowTint}`}
    >
      <div className={`${ROW_GRID} h-19`}>
        <div className="font-display text-ink-faint text-right text-3xl font-bold tabular-nums">
          {rank ?? "–"}
        </div>

        <div className="flex min-w-0 items-center gap-3 lg:gap-4">
          <TeamBadge teamId={teamId} />
          <div className="flex min-w-0 flex-col gap-0.5">
            <div
              lang="en"
              className="text-ink-muted truncate text-xs font-medium tracking-[0.06em] uppercase"
            >
              {team.city}
            </div>
            <div
              lang="en"
              className="font-display truncate text-2xl leading-none font-bold tracking-[0.03em] uppercase"
            >
              {team.name}
            </div>
          </div>
        </div>

        <div className="font-display text-right text-3xl leading-none font-extrabold tabular-nums lg:text-[38px]">
          {lineText}
          {needsReview && (
            <sup
              title={tr.picks.needsReview}
              className="text-ink-muted ml-0.5 text-base font-semibold"
            >
              {tr.picks.needsReviewMark}
              <span className="sr-only">{tr.picks.needsReview}</span>
            </sup>
          )}
        </div>

        <div
          role="group"
          aria-label={tr.picks.sideGroup(label)}
          className="flex gap-1.5"
        >
          <SideButton
            side="under"
            selected={side === "under"}
            dimmed={side === "over"}
            disabled={disabled}
            onClick={() => onToggleSide("under")}
          />
          <SideButton
            side="over"
            selected={side === "over"}
            dimmed={side === "under"}
            disabled={disabled}
            onClick={() => onToggleSide("over")}
          />
        </div>

        <div
          role="group"
          aria-label={tr.picks.confidenceGroup(label)}
          className="flex"
        >
          {CONFIDENCE_LEVELS.map((level) => {
            const on = (pick?.confidence ?? 0) >= level;
            return (
              <button
                key={level}
                type="button"
                aria-label={tr.picks.confidenceStar(level)}
                aria-pressed={pick?.confidence === level}
                disabled={disabled || side === undefined}
                onClick={() => onConfidence(level)}
                className={`flex size-11 items-center justify-center rounded-lg disabled:cursor-not-allowed ${
                  on ? starTone : "text-ink-faint"
                } ${side === undefined ? "opacity-40" : ""}`}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    d={STAR_PATH}
                    fill={on ? "currentColor" : "none"}
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            );
          })}
        </div>

        <div>
          <input
            type="number"
            inputMode="numeric"
            min={0}
            max={82}
            step={1}
            placeholder="—"
            aria-label={tr.picks.projectionLabel(label)}
            value={pick?.projectedWins ?? ""}
            disabled={disabled}
            onChange={(event) =>
              onProjection(parseProjectedWins(event.target.value))
            }
            className={`bg-bg font-display placeholder:text-ink-faint h-11 w-full max-w-22 rounded-[10px] border text-center text-2xl font-bold tabular-nums ${
              conflict ? "border-warn" : "border-border-strong"
            }`}
          />
        </div>
      </div>

      {conflict && pick?.projectedWins !== undefined && (
        <p className="border-warn/40 bg-warn/8 -mt-1 mr-4 mb-3.5 ml-16 flex items-center gap-2.5 rounded-[10px] border px-3.5 py-2.5 text-sm leading-[1.4] text-[#F3E7B8] lg:mr-6 lg:ml-26">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="text-warn shrink-0"
          >
            <path d="M12 3.5L2.5 20h19L12 3.5z" />
            <path d="M12 10v4.5" />
            <path d="M12 17.4v.1" />
          </svg>
          <span>
            <strong className="text-warn">{tr.picks.conflictTitle}</strong>{" "}
            {tr.picks.conflict[conflict](pick.projectedWins, lineText)}
          </span>
        </p>
      )}
    </li>
  );
}

function SideButton({
  side,
  selected,
  dimmed,
  disabled,
  onClick,
}: {
  side: Side;
  selected: boolean;
  dimmed: boolean;
  disabled: boolean;
  onClick: () => void;
}) {
  const selectedStyle =
    side === "over"
      ? "border-over bg-over text-over-ink"
      : "border-under bg-under text-under-ink";
  const idleStyle = `border-border-strong hover:border-ink-muted ${
    dimmed ? "text-ink-muted" : "text-ink-soft"
  }`;

  return (
    <button
      type="button"
      aria-pressed={selected}
      disabled={disabled}
      onClick={onClick}
      className={`font-display flex h-11 flex-1 items-center justify-center gap-1 rounded-[10px] border text-lg font-bold tracking-[0.08em] disabled:cursor-not-allowed ${
        selected ? selectedStyle : idleStyle
      }`}
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d={side === "over" ? "M6 15l6-6 6 6" : "M6 9l6 6 6-6"} />
      </svg>
      {side === "over" ? tr.picks.over : tr.picks.under}
    </button>
  );
}
