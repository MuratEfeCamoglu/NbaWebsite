import type { TeamId } from "@/data/teams";
import type { Draft, DraftPick } from "@/lib/validation";

export type PickConflict = "over-but-below" | "under-but-above";

/** A pick contradicts itself when the projection lands on the other side of the line. */
export function pickConflict(
  line: number,
  pick: DraftPick | undefined,
): PickConflict | null {
  if (pick?.side === undefined || pick.projectedWins === undefined) return null;
  if (pick.side === "over" && pick.projectedWins < line) {
    return "over-but-below";
  }
  if (pick.side === "under" && pick.projectedWins > line) {
    return "under-but-above";
  }
  return null;
}

type Picks = Draft["picks"];

export interface RankedProjection {
  teamId: TeamId;
  /** 1-based position within the conference ranking. */
  rank: number;
  projectedWins: number;
}

/** A team ranked below teams the user projected fewer wins for. */
export interface RankingConflict extends RankedProjection {
  /** The teams ranked above it with fewer projected wins, best rank first. */
  above: RankedProjection[];
}

function projectionsInOrder(
  order: readonly TeamId[],
  picks: Picks,
): RankedProjection[] {
  return order.flatMap((teamId, index) => {
    const projectedWins = picks[teamId]?.projectedWins;
    return projectedWins === undefined
      ? []
      : [{ teamId, rank: index + 1, projectedWins }];
  });
}

/** Teams of a ranking conflict as "Hornets (30), Hawks (35)". */
export function describeAbove(
  conflict: RankingConflict,
  nameOf: (teamId: TeamId) => string,
): string {
  return conflict.above
    .map((team) => `${nameOf(team.teamId)} (${team.projectedWins})`)
    .join(", ");
}

/**
 * Ranking ↔ projection check within one conference: lists every team that
 * sits below a team with fewer projected wins. Teams without a projection
 * and equal projections never conflict.
 */
export function rankingConflicts(
  order: readonly TeamId[],
  picks: Picks,
): RankingConflict[] {
  const projected = projectionsInOrder(order, picks);
  return projected.flatMap((entry, index) => {
    const above = projected
      .slice(0, index)
      .filter((other) => other.projectedWins < entry.projectedWins);
    return above.length > 0 ? [{ ...entry, above }] : [];
  });
}

/**
 * Reorders a conference by projected wins (most first). Only teams with a
 * projection move, and only among their own positions; teams without one stay
 * where they are. Equal projections keep their current order.
 */
export function sortByProjection(
  order: readonly TeamId[],
  picks: Picks,
): TeamId[] {
  const sorted = projectionsInOrder(order, picks)
    .sort((a, b) => b.projectedWins - a.projectedWins || a.rank - b.rank)
    .map((entry) => entry.teamId);
  let next = 0;
  return order.map((teamId) =>
    picks[teamId]?.projectedWins === undefined ? teamId : sorted[next++],
  );
}
