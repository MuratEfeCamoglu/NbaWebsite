import { describe, expect, it } from "vitest";
import {
  emptyDraft,
  parseDraft,
  parseProjectedWins,
  setConfidence,
  setProjectedWins,
  setRanking,
  toggleSide,
} from "@/lib/draft";
import { defaultRanking } from "@/lib/ranking";

const SEASON_ID = "2026-27";
const empty = emptyDraft(SEASON_ID);

describe("parseDraft", () => {
  it("returns an empty draft when nothing is stored", () => {
    expect(parseDraft(null, SEASON_ID)).toEqual(empty);
  });

  it("round-trips a stored draft", () => {
    let draft = setRanking(empty, defaultRanking());
    draft = toggleSide(draft, "BOS", "over");
    draft = setProjectedWins(draft, "LAL", 44);
    expect(parseDraft(JSON.stringify(draft), SEASON_ID)).toEqual(draft);
  });

  it.each([
    ["broken JSON", "{not json"],
    ["wrong shape", JSON.stringify({ hello: "world" })],
    ["another season", JSON.stringify(emptyDraft("2025-26"))],
    [
      "unknown team",
      JSON.stringify({ ...empty, picks: { SEA: { side: "over" } } }),
    ],
    [
      "invalid side",
      JSON.stringify({ ...empty, picks: { BOS: { side: "push" } } }),
    ],
    [
      "confidence out of range",
      JSON.stringify({
        ...empty,
        picks: { BOS: { side: "over", confidence: 4 } },
      }),
    ],
    [
      "confidence without a side",
      JSON.stringify({ ...empty, picks: { BOS: { confidence: 2 } } }),
    ],
    [
      "projection out of range",
      JSON.stringify({ ...empty, picks: { BOS: { projectedWins: 83 } } }),
    ],
    [
      "fractional projection",
      JSON.stringify({ ...empty, picks: { BOS: { projectedWins: 41.5 } } }),
    ],
    [
      "incomplete ranking",
      JSON.stringify({ ...empty, ranking: { West: ["LAL"], East: ["BOS"] } }),
    ],
  ])("falls back to an empty draft for %s", (_label, raw) => {
    expect(parseDraft(raw, SEASON_ID)).toEqual(empty);
  });
});

describe("toggleSide", () => {
  it("picks a side with 1 star by default", () => {
    const draft = toggleSide(empty, "BOS", "over");
    expect(draft.picks.BOS).toEqual({ side: "over", confidence: 1 });
  });

  it("switches side and keeps confidence and projection", () => {
    let draft = toggleSide(empty, "BOS", "over");
    draft = setConfidence(draft, "BOS", 3);
    draft = setProjectedWins(draft, "BOS", 50);
    draft = toggleSide(draft, "BOS", "under");
    expect(draft.picks.BOS).toEqual({
      side: "under",
      confidence: 3,
      projectedWins: 50,
    });
  });

  it("clears the pick when the same side is chosen again", () => {
    const draft = toggleSide(toggleSide(empty, "BOS", "over"), "BOS", "over");
    expect(draft.picks.BOS).toBeUndefined();
    expect("BOS" in draft.picks).toBe(false);
  });

  it("keeps the projection when the side is cleared", () => {
    let draft = setProjectedWins(empty, "BOS", 50);
    draft = toggleSide(draft, "BOS", "under");
    draft = toggleSide(draft, "BOS", "under");
    expect(draft.picks.BOS).toEqual({ projectedWins: 50 });
  });

  it("does not mutate the previous draft", () => {
    toggleSide(empty, "BOS", "over");
    expect(empty.picks).toEqual({});
  });
});

describe("setConfidence", () => {
  it("changes confidence on a picked team", () => {
    const draft = setConfidence(toggleSide(empty, "BOS", "over"), "BOS", 2);
    expect(draft.picks.BOS?.confidence).toBe(2);
  });

  it("is ignored without a side", () => {
    expect(setConfidence(empty, "BOS", 3)).toBe(empty);
    const projected = setProjectedWins(empty, "BOS", 40);
    expect(setConfidence(projected, "BOS", 3)).toBe(projected);
  });
});

describe("setProjectedWins", () => {
  it("stores the 0 and 82 boundaries", () => {
    expect(setProjectedWins(empty, "BOS", 0).picks.BOS?.projectedWins).toBe(0);
    expect(setProjectedWins(empty, "BOS", 82).picks.BOS?.projectedWins).toBe(
      82,
    );
  });

  it("removes the projection, and the pick when nothing is left", () => {
    const projected = setProjectedWins(empty, "BOS", 40);
    expect(setProjectedWins(projected, "BOS", undefined).picks).toEqual({});

    const picked = setProjectedWins(
      toggleSide(empty, "BOS", "over"),
      "BOS",
      40,
    );
    expect(setProjectedWins(picked, "BOS", undefined).picks.BOS).toEqual({
      side: "over",
      confidence: 1,
    });
  });
});

describe("parseProjectedWins", () => {
  it.each([
    ["41", 41],
    [" 7 ", 7],
    ["0", 0],
    ["82", 82],
    ["83", 82],
    ["999", 82],
    ["-5", 0],
  ])("parses %j as %s", (text, expected) => {
    expect(parseProjectedWins(text)).toBe(expected);
  });

  it.each(["", "  ", "abc", "41.5", "4e1", "41,5"])(
    "returns nothing for %j",
    (text) => {
      expect(parseProjectedWins(text)).toBeUndefined();
    },
  );
});

describe("setRanking", () => {
  it("stores the ranking without touching picks", () => {
    const picked = toggleSide(empty, "BOS", "over");
    const ranking = defaultRanking();
    expect(setRanking(picked, ranking)).toEqual({ ...picked, ranking });
  });
});
