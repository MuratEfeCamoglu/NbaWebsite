import { z } from "zod";
import { SEASON, TOTAL_WINS } from "@config/season";
import {
  TEAM_IDS,
  isTeamId,
  teamsInConference,
  type Conference,
  type TeamId,
} from "@/data/teams";

const MIN_SOURCES = 2;
/** Sources further apart than this many wins require `needsReview`. */
const MAX_SOURCE_SPREAD = 1;

const isoDate = z.iso.date();

/** A win line: 0–82, either a whole number or `.5`. */
const lineValue = z.number().min(0).max(SEASON.gamesPerTeam).multipleOf(0.5);

export const teamIdSchema = z.custom<TeamId>(
  (value) => typeof value === "string" && isTeamId(value),
  { error: "Unknown team id" },
);

export const lineSourceSchema = z.strictObject({
  name: z.string().min(1),
  book: z.string().min(1).optional(),
  url: z.url({ protocol: /^https?$/ }),
  line: lineValue,
  /** When the source article was published (used to pick the newest line). */
  publishedAt: isoDate.optional(),
  retrievedAt: isoDate,
});

export type LineSource = z.infer<typeof lineSourceSchema>;

/** Largest difference between the lines reported by the given sources. */
export function sourceSpread(sources: readonly { line: number }[]): number {
  if (sources.length === 0) return 0;
  const values = sources.map((source) => source.line);
  return Math.max(...values) - Math.min(...values);
}

export const winLineSchema = z
  .strictObject({
    teamId: teamIdSchema,
    season: z.string().regex(/^\d{4}-\d{2}$/),
    line: lineValue,
    sources: z.array(lineSourceSchema).min(MIN_SOURCES),
    needsReview: z.boolean().optional(),
  })
  .refine(
    (winLine) =>
      sourceSpread(winLine.sources) <= MAX_SOURCE_SPREAD ||
      winLine.needsReview === true,
    {
      error: `Sources differ by more than ${MAX_SOURCE_SPREAD} win; needsReview must be true`,
      path: ["needsReview"],
    },
  );

export type WinLine = z.infer<typeof winLineSchema>;

export const lineFileSchema = z
  .strictObject({
    season: z.string().regex(/^\d{4}-\d{2}$/),
    /** true only for clearly fake development data. */
    isSample: z.boolean(),
    retrievedAt: isoDate,
    lines: z.array(winLineSchema),
    /** Teams for which no line could be found. */
    todo: z.array(teamIdSchema),
  })
  .superRefine((file, ctx) => {
    const seen = new Set<TeamId>();
    const all = [...file.lines.map((winLine) => winLine.teamId), ...file.todo];
    for (const teamId of all) {
      if (seen.has(teamId)) {
        ctx.addIssue({ code: "custom", message: `Duplicate team: ${teamId}` });
      }
      seen.add(teamId);
    }
    for (const teamId of TEAM_IDS) {
      if (!seen.has(teamId)) {
        ctx.addIssue({ code: "custom", message: `Missing team: ${teamId}` });
      }
    }
    for (const winLine of file.lines) {
      if (winLine.season !== file.season) {
        ctx.addIssue({
          code: "custom",
          message: `Season mismatch for ${winLine.teamId}: ${winLine.season}`,
        });
      }
    }
  });

export type LineFile = z.infer<typeof lineFileSchema>;

export function sumLines(lines: readonly { line: number }[]): number {
  return lines.reduce((total, winLine) => total + winLine.line, 0);
}

export type LineTotalStatus = "ok" | "out-of-range";

/**
 * All 30 lines normally add up to roughly the league's total wins.
 * A sum outside the tolerance usually means one of the lines is wrong.
 */
export function lineTotalStatus(total: number): LineTotalStatus {
  return Math.abs(total - TOTAL_WINS) <= SEASON.lineTotalTolerance
    ? "ok"
    : "out-of-range";
}

function conferenceListSchema(conference: Conference) {
  const expected = teamsInConference(conference)
    .map((team) => team.id as TeamId)
    .sort();
  return z
    .array(teamIdSchema)
    .refine(
      (list) =>
        list.length === expected.length &&
        [...list].sort().every((teamId, index) => teamId === expected[index]),
      { error: `Must list every ${conference} team exactly once` },
    );
}

/** Power Ranking: each conference ordered separately, best team first. */
export const rankingSchema = z.strictObject({
  West: conferenceListSchema("West"),
  East: conferenceListSchema("East"),
});

export type Ranking = z.infer<typeof rankingSchema>;

export const sideSchema = z.enum(["over", "under"]);
export const confidenceSchema = z.union([
  z.literal(1),
  z.literal(2),
  z.literal(3),
]);
export const projectedWinsSchema = z
  .number()
  .int()
  .min(0)
  .max(SEASON.gamesPerTeam);

/** A pick that is still being edited; every field is optional. */
export const draftPickSchema = z
  .strictObject({
    side: sideSchema.optional(),
    confidence: confidenceSchema.optional(),
    projectedWins: projectedWinsSchema.optional(),
  })
  .refine((pick) => pick.confidence === undefined || pick.side !== undefined, {
    error: "Confidence needs a side",
  });

export type DraftPick = z.infer<typeof draftPickSchema>;

/** The prediction as stored in the browser while the user is working on it. */
export const draftSchema = z.strictObject({
  season: z.string(),
  /** null until the user has ordered the teams. */
  ranking: rankingSchema.nullable(),
  picks: z.partialRecord(
    z.enum(TEAM_IDS as [TeamId, ...TeamId[]]),
    draftPickSchema,
  ),
});

export type Draft = z.infer<typeof draftSchema>;
