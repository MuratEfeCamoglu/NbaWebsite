/**
 * Season configuration. Nothing season-specific is hard-coded elsewhere;
 * league-wide constants (total wins, average wins) are derived from here.
 */
export const SEASON = {
  id: "2026-27",
  teamCount: 30,
  gamesPerTeam: 82,
  /**
   * Lock: tip-off of the first regular season game, stored in UTC.
   * 2026-10-20 15:00 ET (BOS @ DET) = 19:00 UTC = 22:00 Europe/Istanbul.
   */
  lockAt: "2026-10-20T19:00:00Z",
  displayTimeZone: "Europe/Istanbul",
  /** Sum of all win lines is expected within TOTAL_WINS ± this value. */
  lineTotalTolerance: 20,
  /** Projection sum further than this from TOTAL_WINS triggers a warning. */
  projectionTotalTolerance: 30,
} as const;

/** Every game has exactly one winner: 30 × 82 / 2 = 1230. */
export const TOTAL_WINS = (SEASON.teamCount * SEASON.gamesPerTeam) / 2;

/** Wins of an average team: 41. */
export const AVERAGE_WINS = SEASON.gamesPerTeam / 2;
