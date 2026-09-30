import { SEASON } from "@config/season";
import type { TeamId } from "@/data/teams";
import {
  draftSchema,
  type Draft,
  type DraftPick,
  type Ranking,
} from "@/lib/validation";

type Side = NonNullable<DraftPick["side"]>;
type Confidence = NonNullable<DraftPick["confidence"]>;

const DEFAULT_CONFIDENCE: Confidence = 1;

export function emptyDraft(season: string): Draft {
  return { season, ranking: null, picks: {} };
}

/**
 * Reads a stored draft. Anything unreadable, invalid or from another season
 * yields an empty draft rather than an error.
 */
export function parseDraft(raw: string | null, season: string): Draft {
  if (raw === null) return emptyDraft(season);
  let json: unknown;
  try {
    json = JSON.parse(raw);
  } catch {
    return emptyDraft(season);
  }
  const parsed = draftSchema.safeParse(json);
  if (!parsed.success || parsed.data.season !== season) {
    return emptyDraft(season);
  }
  return parsed.data;
}

export function setRanking(draft: Draft, ranking: Ranking): Draft {
  return { ...draft, ranking };
}

function withPick(draft: Draft, teamId: TeamId, pick: DraftPick): Draft {
  const picks = { ...draft.picks };
  if (Object.values(pick).every((value) => value === undefined)) {
    delete picks[teamId];
  } else {
    picks[teamId] = pick;
  }
  return { ...draft, picks };
}

/** Picks a side; picking the current side again clears it (and its confidence). */
export function toggleSide(draft: Draft, teamId: TeamId, side: Side): Draft {
  const current = draft.picks[teamId] ?? {};
  if (current.side === side) {
    return withPick(draft, teamId, { projectedWins: current.projectedWins });
  }
  return withPick(draft, teamId, {
    ...current,
    side,
    confidence: current.confidence ?? DEFAULT_CONFIDENCE,
  });
}

/** Confidence only exists on a pick that has a side. */
export function setConfidence(
  draft: Draft,
  teamId: TeamId,
  confidence: Confidence,
): Draft {
  const current = draft.picks[teamId];
  if (current?.side === undefined) return draft;
  return withPick(draft, teamId, { ...current, confidence });
}

export function setProjectedWins(
  draft: Draft,
  teamId: TeamId,
  projectedWins: number | undefined,
): Draft {
  const current = draft.picks[teamId] ?? {};
  return withPick(draft, teamId, { ...current, projectedWins });
}

/** Text from the projection input → whole wins within 0–82, or nothing. */
export function parseProjectedWins(text: string): number | undefined {
  const trimmed = text.trim();
  if (!/^-?\d+$/.test(trimmed)) return undefined;
  return Math.max(0, Math.min(SEASON.gamesPerTeam, parseInt(trimmed, 10)));
}
