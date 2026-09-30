import { describe, expect, it } from "vitest";
import { WIN_LINES } from "@/data/lines";
import {
  emptyDraft,
  setConfidence,
  setProjectedWins,
  setRanking,
  toggleSide,
} from "@/lib/draft";
import { defaultRanking, moveTeam } from "@/lib/ranking";
import { buildSummary, parseViewMode, summarySections } from "@/lib/summary";
import { sumWins } from "@/lib/totals";

const empty = emptyDraft("2026-27");

describe("buildSummary", () => {
  it("summarises an empty prediction", () => {
    const summary = buildSummary(empty, WIN_LINES);

    expect(summary.ranked).toBe(false);
    expect(summary.teamCount).toBe(30);
    expect(summary.conferences.West).toHaveLength(15);
    expect(summary.conferences.East).toHaveLength(15);
    expect(summary.pickedCount).toBe(0);
    expect(summary.overCount).toBe(0);
    expect(summary.underCount).toBe(0);
    expect(summary.projectionCount).toBe(0);
    expect(summary.maxPoints).toBe(0);
    expect(summary.conflicts).toEqual([]);
    expect(summary.total).toBe(sumWins(WIN_LINES, {}));
  });

  it("lists teams alphabetically without ranks until the user ranks", () => {
    const summary = buildSummary(empty, WIN_LINES);
    const east = summary.conferences.East;

    expect(east.slice(0, 3).map((row) => row.teamId)).toEqual([
      "ATL",
      "BOS",
      "BKN",
    ]);
    expect(east.every((row) => row.rank === null)).toBe(true);
  });

  it("follows the saved ranking, numbered 1–15 per conference", () => {
    const base = defaultRanking();
    const ranking = { ...base, East: moveTeam(base.East, 1, 0) };
    const summary = buildSummary(setRanking(empty, ranking), WIN_LINES);

    expect(summary.ranked).toBe(true);
    expect(summary.conferences.East[0]).toMatchObject({
      teamId: "BOS",
      rank: 1,
    });
    expect(summary.conferences.East.at(-1)?.rank).toBe(15);
    expect(summary.conferences.West[0].rank).toBe(1);
    expect(summary.conferences.West.at(-1)?.rank).toBe(15);
  });

  it("counts picks, sides, projections and stars", () => {
    let draft = toggleSide(empty, "BOS", "over");
    draft = setConfidence(draft, "BOS", 3);
    draft = toggleSide(draft, "LAL", "under");
    draft = toggleSide(draft, "NYK", "over");
    draft = setConfidence(draft, "NYK", 2);
    draft = setProjectedWins(draft, "MIA", 40);
    const summary = buildSummary(draft, WIN_LINES);

    expect(summary.pickedCount).toBe(3);
    expect(summary.overCount).toBe(2);
    expect(summary.underCount).toBe(1);
    expect(summary.projectionCount).toBe(1);
    expect(summary.maxPoints).toBe(3 + 1 + 2);
    expect(summary.total).toBe(sumWins(WIN_LINES, draft.picks));
  });

  it("carries each team's line and pick into its row", () => {
    let draft = toggleSide(empty, "BOS", "over");
    draft = setProjectedWins(draft, "BOS", 60);
    const row = buildSummary(draft, WIN_LINES).conferences.East.find(
      (entry) => entry.teamId === "BOS",
    );
    const line = WIN_LINES.find((entry) => entry.teamId === "BOS")?.line;

    expect(row).toEqual({
      teamId: "BOS",
      rank: null,
      line,
      side: "over",
      confidence: 1,
      projectedWins: 60,
      conflict: null,
    });
  });

  it("collects contradicting picks", () => {
    let draft = toggleSide(empty, "BOS", "over");
    draft = setProjectedWins(draft, "BOS", 5);
    draft = toggleSide(draft, "LAL", "under");
    draft = setProjectedWins(draft, "LAL", 80);
    draft = toggleSide(draft, "NYK", "over");
    const summary = buildSummary(draft, WIN_LINES);

    expect(summary.conflicts.map((row) => [row.teamId, row.conflict])).toEqual([
      ["LAL", "under-but-above"],
      ["BOS", "over-but-below"],
    ]);
  });

  it("flags a total far from the league total", () => {
    const summary = buildSummary(setProjectedWins(empty, "BOS", 0), WIN_LINES);

    expect(summary.totalStatus.level).toBe("off");
    expect(summary.totalStatus.deviation).toBeLessThan(-30);
  });

  it("reports a balanced total for an untouched prediction", () => {
    expect(buildSummary(empty, WIN_LINES).totalStatus.level).toBe("balanced");
  });

  it("skips teams that have no line yet", () => {
    const lines = WIN_LINES.filter((entry) => entry.teamId !== "BOS");
    const summary = buildSummary(empty, lines);

    expect(summary.teamCount).toBe(29);
    expect(summary.conferences.East).toHaveLength(14);
    expect(summary.conferences.East.some((row) => row.teamId === "BOS")).toBe(
      false,
    );
  });
});

describe("summarySections", () => {
  const base = defaultRanking();
  const ranked = setRanking(empty, {
    ...base,
    East: moveTeam(base.East, 14, 0),
  });
  const summary = buildSummary(ranked, WIN_LINES);

  it("returns one section of 15 per conference", () => {
    const sections = summarySections(summary, "conference");

    expect(sections.map((section) => section.id)).toEqual(["West", "East"]);
    expect(sections.every((section) => section.division === null)).toBe(true);
    expect(sections.every((section) => section.rows.length === 15)).toBe(true);
  });

  it("returns six divisions of 5, West first", () => {
    const sections = summarySections(summary, "division");

    expect(sections.map((section) => section.id)).toEqual([
      "Northwest",
      "Pacific",
      "Southwest",
      "Atlantic",
      "Central",
      "Southeast",
    ]);
    expect(sections.every((section) => section.rows.length === 5)).toBe(true);
    expect(sections.slice(0, 3).every((s) => s.conference === "West")).toBe(
      true,
    );
    expect(sections.slice(3).every((s) => s.conference === "East")).toBe(true);
  });

  it("keeps the conference order and conference rank inside a division", () => {
    const southeast = summarySections(summary, "division").find(
      (section) => section.id === "Southeast",
    );

    // WAS was moved to the top of the East.
    expect(southeast?.rows.map((row) => [row.teamId, row.rank])).toEqual([
      ["WAS", 1],
      ["ATL", 2],
      ["CHA", 5],
      ["MIA", 10],
      ["ORL", 13],
    ]);
  });

  it("limits the sections to the requested conferences", () => {
    expect(
      summarySections(summary, "division", ["East"]).map((s) => s.id),
    ).toEqual(["Atlantic", "Central", "Southeast"]);
    expect(summarySections(summary, "conference", ["West"])).toHaveLength(1);
    expect(summarySections(summary, "division", [])).toEqual([]);
  });
});

describe("parseViewMode", () => {
  it("accepts division and falls back to conference", () => {
    expect(parseViewMode("division")).toBe("division");
    expect(parseViewMode("conference")).toBe("conference");
    expect(parseViewMode(null)).toBe("conference");
    expect(parseViewMode("grid")).toBe("conference");
  });
});
