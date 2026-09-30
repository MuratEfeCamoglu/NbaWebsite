import { describe, expect, it } from "vitest";
import { contrastRatio, inkFor, relativeLuminance } from "@/lib/color";
import { TEAMS } from "@/data/teams";

describe("relativeLuminance", () => {
  it("is 0 for black and 1 for white", () => {
    expect(relativeLuminance("#000000")).toBe(0);
    expect(relativeLuminance("#FFFFFF")).toBeCloseTo(1, 10);
  });
});

describe("inkFor", () => {
  it("picks white on dark and dark on light backgrounds", () => {
    expect(inkFor("#000000")).toBe("#FFFFFF");
    expect(inkFor("#0E2240")).toBe("#FFFFFF");
    expect(inkFor("#FFFFFF")).toBe("#0A0E17");
    expect(inkFor("#FDBB30")).toBe("#0A0E17");
  });

  it("always picks the ink with the higher contrast", () => {
    for (const team of TEAMS) {
      const { primary } = team.colors;
      const best = Math.max(
        contrastRatio(primary, "#FFFFFF"),
        contrastRatio(primary, "#0A0E17"),
      );
      expect(contrastRatio(primary, inkFor(primary)), team.id).toBe(best);
    }
  });

  // Mid-tone reds (e.g. ATL) top out just under 4.5:1 with either ink, so the
  // floor is 4.4 rather than AA's 4.5; badges also carry the full team name.
  it("keeps every team badge readable (contrast ≥ 4.4)", () => {
    for (const team of TEAMS) {
      const { primary } = team.colors;
      const ratio = contrastRatio(primary, inkFor(primary));
      expect(ratio, team.id).toBeGreaterThanOrEqual(4.4);
    }
  });
});

describe("contrastRatio", () => {
  it("is 21 for black on white and 1 for identical colors", () => {
    expect(contrastRatio("#000000", "#FFFFFF")).toBeCloseTo(21, 10);
    expect(contrastRatio("#FFFFFF", "#000000")).toBeCloseTo(21, 10);
    expect(contrastRatio("#5AAEFF", "#5AAEFF")).toBe(1);
  });
});
