import {
  CONFERENCES,
  DIVISIONS,
  getTeam,
  type Conference,
  type Division,
  type TeamId,
} from "@/data/teams";
import { pickConflict, type PickConflict } from "@/lib/consistency";
import { defaultRanking } from "@/lib/ranking";
import { sumWins, totalStatus, type TotalStatus } from "@/lib/totals";
import type { Draft, DraftPick } from "@/lib/validation";

export interface SummaryRow {
  teamId: TeamId;
  /** Rank within the conference, or null when the user has not ranked. */
  rank: number | null;
  line: number;
  side: DraftPick["side"];
  confidence: DraftPick["confidence"];
  projectedWins: number | undefined;
  conflict: PickConflict | null;
}

export interface Summary {
  ranked: boolean;
  conferences: Record<Conference, SummaryRow[]>;
  teamCount: number;
  pickedCount: number;
  overCount: number;
  underCount: number;
  projectionCount: number;
  /** Sum of the stars on all picks — the most points the prediction can earn. */
  maxPoints: number;
  total: number;
  totalStatus: TotalStatus;
  conflicts: SummaryRow[];
}

/** Everything the summary page and the downloadable image show, in display order. */
export function buildSummary(
  draft: Draft,
  lines: readonly { teamId: TeamId; line: number }[],
): Summary {
  const ranking = draft.ranking ?? defaultRanking();
  const lineByTeam = new Map(lines.map((entry) => [entry.teamId, entry.line]));

  const conferences = {} as Record<Conference, SummaryRow[]>;
  for (const conference of CONFERENCES) {
    conferences[conference] = ranking[conference].flatMap((teamId, index) => {
      const line = lineByTeam.get(teamId);
      if (line === undefined) return [];
      const pick = draft.picks[teamId];
      return [
        {
          teamId,
          rank: draft.ranking ? index + 1 : null,
          line,
          side: pick?.side,
          confidence: pick?.confidence,
          projectedWins: pick?.projectedWins,
          conflict: pickConflict(line, pick),
        },
      ];
    });
  }

  const rows = CONFERENCES.flatMap((conference) => conferences[conference]);
  const total = sumWins(lines, draft.picks);

  return {
    ranked: draft.ranking !== null,
    conferences,
    teamCount: rows.length,
    pickedCount: rows.filter((row) => row.side !== undefined).length,
    overCount: rows.filter((row) => row.side === "over").length,
    underCount: rows.filter((row) => row.side === "under").length,
    projectionCount: rows.filter((row) => row.projectedWins !== undefined)
      .length,
    maxPoints: rows.reduce((sum, row) => sum + (row.confidence ?? 0), 0),
    total,
    totalStatus: totalStatus(total),
    conflicts: rows.filter((row) => row.conflict !== null),
  };
}

/** How teams are grouped on screen: 2 conferences of 15, or 6 divisions of 5. */
export type ViewMode = "conference" | "division";

export function parseViewMode(raw: string | null): ViewMode {
  return raw === "division" ? "division" : "conference";
}

export interface SummarySection {
  id: string;
  conference: Conference;
  /** null when the section is a whole conference. */
  division: Division | null;
  rows: SummaryRow[];
}

/**
 * Splits the summary into the tables to show. Rows keep the user's conference
 * order (and conference rank) in both modes.
 */
export function summarySections(
  summary: Summary,
  mode: ViewMode,
  conferences: readonly Conference[] = CONFERENCES,
): SummarySection[] {
  return conferences.flatMap((conference): SummarySection[] => {
    const rows = summary.conferences[conference];
    if (mode === "conference") {
      return [{ id: conference, conference, division: null, rows }];
    }
    return DIVISIONS[conference].map((division) => ({
      id: division,
      conference,
      division,
      rows: rows.filter((row) => getTeam(row.teamId).division === division),
    }));
  });
}
