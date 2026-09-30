import { describe, expect, it } from "vitest";
import type { TeamId } from "@/data/teams";
import { defaultRanking, moveTeam } from "@/lib/ranking";
import { rankingSchema } from "@/lib/validation";

describe("defaultRanking", () => {
  it("lists 15 teams per conference and is a valid ranking", () => {
    const ranking = defaultRanking();
    expect(ranking.West).toHaveLength(15);
    expect(ranking.East).toHaveLength(15);
    expect(rankingSchema.safeParse(ranking).success).toBe(true);
  });

  it("is alphabetical by city and name", () => {
    const ranking = defaultRanking();
    expect(ranking.East.slice(0, 3)).toEqual(["ATL", "BOS", "BKN"]);
    // "LA Clippers" sorts before "Los Angeles Lakers"
    expect(ranking.West.indexOf("LAC")).toBeLessThan(
      ranking.West.indexOf("LAL"),
    );
    expect(ranking.West[0]).toBe("DAL");
  });

  it("is deterministic", () => {
    expect(defaultRanking()).toEqual(defaultRanking());
  });
});

describe("moveTeam", () => {
  const list: TeamId[] = ["BOS", "NYK", "PHI", "TOR"];

  it("moves a team down", () => {
    expect(moveTeam(list, 0, 2)).toEqual(["NYK", "PHI", "BOS", "TOR"]);
  });

  it("moves a team up", () => {
    expect(moveTeam(list, 3, 0)).toEqual(["TOR", "BOS", "NYK", "PHI"]);
  });

  it("does not mutate the input", () => {
    moveTeam(list, 0, 3);
    expect(list).toEqual(["BOS", "NYK", "PHI", "TOR"]);
  });

  it.each([
    [0, 0],
    [-1, 2],
    [0, 4],
    [9, 0],
    [0.5, 1],
  ])("keeps the order for an invalid move (%s → %s)", (from, to) => {
    const moved = moveTeam(list, from, to);
    expect(moved).toEqual(list);
    expect(moved).not.toBe(list);
  });

  it("handles an empty list", () => {
    expect(moveTeam([], 0, 0)).toEqual([]);
  });
});

describe("rankingSchema", () => {
  it("rejects a team in the wrong conference", () => {
    const ranking = defaultRanking();
    const swapped = {
      West: [ranking.East[0], ...ranking.West.slice(1)],
      East: [ranking.West[0], ...ranking.East.slice(1)],
    };
    expect(rankingSchema.safeParse(swapped).success).toBe(false);
  });

  it("rejects missing and repeated teams", () => {
    const ranking = defaultRanking();
    expect(
      rankingSchema.safeParse({ ...ranking, West: ranking.West.slice(1) })
        .success,
    ).toBe(false);
    expect(
      rankingSchema.safeParse({
        ...ranking,
        East: [ranking.East[0], ...ranking.East.slice(0, 14)],
      }).success,
    ).toBe(false);
  });

  it("rejects an empty ranking", () => {
    expect(rankingSchema.safeParse({ West: [], East: [] }).success).toBe(false);
  });
});
