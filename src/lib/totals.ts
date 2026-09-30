import { SEASON, TOTAL_WINS } from "@config/season";
import type { TeamId } from "@/data/teams";
import type { DraftPick } from "@/lib/validation";

/**
 * Wins counted for a team in the league total: the projection if given,
 * otherwise the line rounded towards the picked side (down when nothing is picked).
 */
export function effectiveWins(line: number, pick?: DraftPick): number {
  if (pick?.projectedWins !== undefined) return pick.projectedWins;
  return pick?.side === "over" ? Math.ceil(line) : Math.floor(line);
}

export function sumWins(
  lines: readonly { teamId: TeamId; line: number }[],
  picks: Partial<Record<TeamId, DraftPick>>,
): number {
  return lines.reduce(
    (total, winLine) =>
      total + effectiveWins(winLine.line, picks[winLine.teamId]),
    0,
  );
}

export type TotalLevel = "balanced" | "off";

export interface TotalStatus {
  /** total − 1230 */
  deviation: number;
  level: TotalLevel;
  /** Marker position on the meter, 0–100, clamped at twice the tolerance. */
  markerPercent: number;
}

export function totalStatus(total: number): TotalStatus {
  const tolerance = SEASON.projectionTotalTolerance;
  const deviation = total - TOTAL_WINS;
  const scale = tolerance * 2;
  const clamped = Math.max(-scale, Math.min(scale, deviation));
  return {
    deviation,
    level: Math.abs(deviation) > tolerance ? "off" : "balanced",
    markerPercent: ((clamped + scale) / (scale * 2)) * 100,
  };
}

/** "+12", "−7" or "±0" */
export function formatDeviation(deviation: number): string {
  if (deviation === 0) return "±0";
  return `${deviation > 0 ? "+" : "−"}${Math.abs(deviation)}`;
}

/** Lines are shown as written by the source: "47.5" or "47". */
export function formatLine(line: number): string {
  return Number.isInteger(line) ? String(line) : line.toFixed(1);
}
