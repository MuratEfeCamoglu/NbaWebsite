import { describe, expect, it } from "vitest";
import type { TeamId } from "@/data/teams";
import {
  describeAbove,
  rankingConflicts,
  sortByProjection,
} from "@/lib/consistency";
import type { Draft } from "@/lib/validation";

function picksOf(wins: Record<string, number>): Draft["picks"] {
  return Object.fromEntries(
    Object.entries(wins).map(([teamId, projectedWins]) => [
      teamId,
      { projectedWins },
    ]),
  );
}

// The East as a user ranked it: Toronto (38) under three teams at 35–36.
const EAST: TeamId[] = [
  "NYK",
  "BOS",
  "PHI",
  "IND",
  "CLE",
  "DET",
  "ORL",
  "CHA",
  "ATL",
  "WAS",
  "MIA",
  "TOR",
  "CHI",
  "MIL",
  "BKN",
];
const EAST_WINS = picksOf({
  NYK: 58,
  BOS: 55,
  PHI: 54,
  IND: 48,
  CLE: 45,
  DET: 53,
  ORL: 45,
  CHA: 30,
  ATL: 35,
  WAS: 36,
  MIA: 35,
  TOR: 38,
  CHI: 31,
  MIL: 26,
  BKN: 22,
});

describe("rankingConflicts", () => {
  it("flags a team ranked below teams with fewer projected wins", () => {
    const conflicts = rankingConflicts(EAST, EAST_WINS);
    expect(conflicts.map((conflict) => conflict.teamId)).toEqual([
      "DET",
      "ATL",
      "WAS",
      "MIA",
      "TOR",
      "CHI",
    ]);

    const toronto = conflicts.find((conflict) => conflict.teamId === "TOR");
    expect(toronto).toMatchObject({ rank: 12, projectedWins: 38 });
    expect(toronto?.above.map((team) => team.teamId)).toEqual([
      "CHA",
      "ATL",
      "WAS",
      "MIA",
    ]);
  });

  it("is empty for an order that follows the projections", () => {
    const sorted = sortByProjection(EAST, EAST_WINS);
    expect(rankingConflicts(sorted, EAST_WINS)).toEqual([]);
  });

  it("ignores equal projections and teams without one", () => {
    const order: TeamId[] = ["BOS", "NYK", "TOR"];
    expect(rankingConflicts(order, picksOf({ BOS: 40, NYK: 40 }))).toEqual([]);
    expect(
      rankingConflicts(order, { BOS: { side: "over" }, NYK: {}, TOR: {} }),
    ).toEqual([]);
  });
});

describe("describeAbove", () => {
  it("lists the teams above with their projections", () => {
    const toronto = rankingConflicts(EAST, EAST_WINS).find(
      (conflict) => conflict.teamId === "TOR",
    )!;
    expect(describeAbove(toronto, (teamId) => teamId)).toBe(
      "CHA (30), ATL (35), WAS (36), MIA (35)",
    );
  });
});

describe("sortByProjection", () => {
  it("orders projected teams by wins, most first", () => {
    const sorted = sortByProjection(EAST, EAST_WINS);
    expect(sorted.slice(0, 6)).toEqual([
      "NYK",
      "BOS",
      "PHI",
      "DET",
      "IND",
      "CLE",
    ]);
    expect(sorted.indexOf("TOR")).toBe(7);
    expect(sorted.slice(-3)).toEqual(["CHA", "MIL", "BKN"]);
  });

  it("keeps equal projections in their current order", () => {
    const sorted = sortByProjection(EAST, EAST_WINS);
    // CLE and ORL (45), ATL and MIA (35) keep the user's relative order.
    expect(sorted.indexOf("CLE")).toBeLessThan(sorted.indexOf("ORL"));
    expect(sorted.indexOf("ATL")).toBeLessThan(sorted.indexOf("MIA"));
  });

  it("leaves teams without a projection in place", () => {
    const order: TeamId[] = ["BOS", "NYK", "TOR", "PHI"];
    const sorted = sortByProjection(order, picksOf({ BOS: 30, TOR: 50 }));
    expect(sorted).toEqual(["TOR", "NYK", "BOS", "PHI"]);
  });

  it("returns a new array of the same teams", () => {
    const sorted = sortByProjection(EAST, EAST_WINS);
    expect(sorted).not.toBe(EAST);
    expect([...sorted].sort()).toEqual([...EAST].sort());
  });
});
