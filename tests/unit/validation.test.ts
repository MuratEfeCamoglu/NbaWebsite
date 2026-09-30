import { describe, expect, it } from "vitest";
import {
  lineFileSchema,
  lineSourceSchema,
  lineTotalStatus,
  sourceSpread,
  sumLines,
  teamIdSchema,
  winLineSchema,
} from "@/lib/validation";
import sampleFile from "@/data/lines/2026-27.sample.json";

function source(line: number, overrides: Record<string, unknown> = {}) {
  return {
    name: "SAMPLE source",
    url: "https://example.com/sample",
    line,
    retrievedAt: "2026-01-01",
    ...overrides,
  };
}

function winLine(overrides: Record<string, unknown> = {}) {
  return {
    teamId: "BOS",
    season: "2026-27",
    line: 47.5,
    sources: [source(47.5), source(47.5)],
    ...overrides,
  };
}

/** Deep copy of the sample file so tests can break it freely. */
function sample() {
  return structuredClone(sampleFile);
}

describe("teamIdSchema", () => {
  it("accepts known abbreviations only", () => {
    expect(teamIdSchema.safeParse("OKC").success).toBe(true);
    expect(teamIdSchema.safeParse("SEA").success).toBe(false);
    expect(teamIdSchema.safeParse("Boston").success).toBe(false);
    expect(teamIdSchema.safeParse(7).success).toBe(false);
  });
});

describe("lineSourceSchema", () => {
  it("accepts a complete source", () => {
    const parsed = lineSourceSchema.safeParse(
      source(47.5, { book: "SAMPLE book", publishedAt: "2026-01-01" }),
    );
    expect(parsed.success).toBe(true);
  });

  it.each([
    ["missing url", { url: undefined }],
    ["non-http url", { url: "ftp://example.com/x" }],
    ["malformed url", { url: "not a url" }],
    ["missing retrievedAt", { retrievedAt: undefined }],
    ["non-ISO retrievedAt", { retrievedAt: "30.09.2026" }],
    ["empty name", { name: "" }],
    ["odds field", { odds: -110 }],
  ])("rejects a source with %s", (_label, overrides) => {
    expect(lineSourceSchema.safeParse(source(47.5, overrides)).success).toBe(
      false,
    );
  });
});

describe("winLineSchema", () => {
  it("accepts half and whole number lines", () => {
    expect(winLineSchema.safeParse(winLine()).success).toBe(true);
    expect(
      winLineSchema.safeParse(
        winLine({ line: 47, sources: [source(47), source(47)] }),
      ).success,
    ).toBe(true);
  });

  it("accepts the 0 and 82 boundaries", () => {
    for (const line of [0, 82]) {
      const parsed = winLineSchema.safeParse(
        winLine({ line, sources: [source(line), source(line)] }),
      );
      expect(parsed.success).toBe(true);
    }
  });

  it.each([-0.5, 82.5, 47.25, Number.NaN])("rejects line %s", (line) => {
    expect(winLineSchema.safeParse(winLine({ line })).success).toBe(false);
  });

  it("requires at least two sources", () => {
    expect(
      winLineSchema.safeParse(winLine({ sources: [source(47.5)] })).success,
    ).toBe(false);
    expect(winLineSchema.safeParse(winLine({ sources: [] })).success).toBe(
      false,
    );
  });

  it("rejects an unknown team and a malformed season", () => {
    expect(winLineSchema.safeParse(winLine({ teamId: "XXX" })).success).toBe(
      false,
    );
    expect(winLineSchema.safeParse(winLine({ season: "2026" })).success).toBe(
      false,
    );
  });

  it("allows a 1 win spread without review", () => {
    const parsed = winLineSchema.safeParse(
      winLine({ sources: [source(47.5), source(48.5)] }),
    );
    expect(parsed.success).toBe(true);
  });

  it("requires needsReview when sources differ by more than 1 win", () => {
    const sources = [source(47.5), source(49.5)];
    expect(winLineSchema.safeParse(winLine({ sources })).success).toBe(false);
    expect(
      winLineSchema.safeParse(winLine({ sources, needsReview: false })).success,
    ).toBe(false);
    expect(
      winLineSchema.safeParse(winLine({ sources, needsReview: true })).success,
    ).toBe(true);
  });
});

describe("lineFileSchema", () => {
  it("accepts the sample file", () => {
    expect(lineFileSchema.safeParse(sample()).success).toBe(true);
  });

  it("rejects a missing team", () => {
    const file = sample();
    file.lines.pop();
    expect(lineFileSchema.safeParse(file).success).toBe(false);
  });

  it("accepts a missing line when the team is listed as todo", () => {
    const file = sample();
    const removed = file.lines.pop()!;
    const parsed = lineFileSchema.safeParse({
      ...file,
      todo: [removed.teamId],
    });
    expect(parsed.success).toBe(true);
  });

  it("rejects a duplicated team", () => {
    const file = sample();
    file.lines[1] = { ...file.lines[1], teamId: file.lines[0].teamId };
    expect(lineFileSchema.safeParse(file).success).toBe(false);
  });

  it("rejects a team that has a line and is also todo", () => {
    const file = sample();
    const parsed = lineFileSchema.safeParse({
      ...file,
      todo: [file.lines[0].teamId],
    });
    expect(parsed.success).toBe(false);
  });

  it("rejects a line from another season", () => {
    const file = sample();
    file.lines[0].season = "2025-26";
    expect(lineFileSchema.safeParse(file).success).toBe(false);
  });

  it("rejects an empty file", () => {
    expect(lineFileSchema.safeParse({}).success).toBe(false);
  });
});

describe("sourceSpread", () => {
  it("returns the gap between the highest and lowest source", () => {
    expect(sourceSpread([{ line: 35.5 }, { line: 36.5 }, { line: 38.5 }])).toBe(
      3,
    );
    expect(sourceSpread([{ line: 47.5 }, { line: 47.5 }])).toBe(0);
  });

  it("is 0 without sources", () => {
    expect(sourceSpread([])).toBe(0);
  });
});

describe("sumLines / lineTotalStatus", () => {
  it("sums lines", () => {
    expect(sumLines([])).toBe(0);
    expect(sumLines([{ line: 47.5 }, { line: 22.5 }, { line: 41 }])).toBe(111);
  });

  it("accepts totals within 1210–1250", () => {
    expect(lineTotalStatus(1230)).toBe("ok");
    expect(lineTotalStatus(1210)).toBe("ok");
    expect(lineTotalStatus(1250)).toBe("ok");
  });

  it("flags totals outside 1210–1250", () => {
    expect(lineTotalStatus(1209.5)).toBe("out-of-range");
    expect(lineTotalStatus(1250.5)).toBe("out-of-range");
    expect(lineTotalStatus(0)).toBe("out-of-range");
  });
});
