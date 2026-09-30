import { describe, expect, it } from "vitest";
import { AVERAGE_WINS, SEASON, TOTAL_WINS } from "@config/season";
import { TEAMS } from "@/data/teams";

describe("season config", () => {
  it("derives the league totals", () => {
    expect(TOTAL_WINS).toBe(1230);
    expect(AVERAGE_WINS).toBe(41);
  });

  it("matches the team list", () => {
    expect(SEASON.teamCount).toBe(TEAMS.length);
  });

  it("stores the lock time as a valid UTC timestamp", () => {
    expect(SEASON.lockAt).toMatch(/Z$/);
    expect(new Date(SEASON.lockAt).toISOString()).toBe(
      "2026-10-20T19:00:00.000Z",
    );
  });

  it("names the season as YYYY-YY", () => {
    expect(SEASON.id).toMatch(/^\d{4}-\d{2}$/);
  });
});
