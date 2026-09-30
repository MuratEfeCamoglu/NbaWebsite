import { describe, expect, it } from "vitest";
import { pickConflict } from "@/lib/consistency";
import { isLocked } from "@/lib/lock";
import {
  effectiveWins,
  formatDeviation,
  formatLine,
  sumWins,
  totalStatus,
} from "@/lib/totals";

describe("effectiveWins", () => {
  it("uses the projection when there is one", () => {
    expect(effectiveWins(47.5, { side: "over", projectedWins: 30 })).toBe(30);
    expect(effectiveWins(47.5, { projectedWins: 0 })).toBe(0);
    expect(effectiveWins(47.5, { projectedWins: 82 })).toBe(82);
  });

  it("rounds the line towards the picked side", () => {
    expect(effectiveWins(47.5, { side: "over", confidence: 1 })).toBe(48);
    expect(effectiveWins(47.5, { side: "under", confidence: 1 })).toBe(47);
  });

  it("rounds down when nothing is picked", () => {
    expect(effectiveWins(47.5)).toBe(47);
    expect(effectiveWins(47.5, {})).toBe(47);
  });

  it("keeps whole number lines as they are", () => {
    expect(effectiveWins(47, { side: "over", confidence: 1 })).toBe(47);
    expect(effectiveWins(47)).toBe(47);
  });
});

describe("sumWins", () => {
  const lines = [
    { teamId: "BOS", line: 51.5 },
    { teamId: "LAL", line: 45.5 },
    { teamId: "SAC", line: 21.5 },
  ] as const;

  it("sums lines rounded down for an empty prediction", () => {
    expect(sumWins(lines, {})).toBe(51 + 45 + 21);
  });

  it("mixes projections, picks and untouched teams", () => {
    expect(
      sumWins(lines, {
        BOS: { side: "over", confidence: 2 },
        LAL: { side: "under", confidence: 1, projectedWins: 40 },
      }),
    ).toBe(52 + 40 + 21);
  });

  it("is 0 without lines", () => {
    expect(sumWins([], {})).toBe(0);
  });
});

describe("totalStatus", () => {
  it("is balanced at exactly 1230", () => {
    expect(totalStatus(1230)).toEqual({
      deviation: 0,
      level: "balanced",
      markerPercent: 50,
    });
  });

  it("stays balanced up to ±30 and warns beyond", () => {
    expect(totalStatus(1260).level).toBe("balanced");
    expect(totalStatus(1200).level).toBe("balanced");
    expect(totalStatus(1261).level).toBe("off");
    expect(totalStatus(1199).level).toBe("off");
  });

  it("places and clamps the marker", () => {
    expect(totalStatus(1260).markerPercent).toBe(75);
    expect(totalStatus(1200).markerPercent).toBe(25);
    expect(totalStatus(1290).markerPercent).toBe(100);
    expect(totalStatus(5000).markerPercent).toBe(100);
    expect(totalStatus(0).markerPercent).toBe(0);
    expect(totalStatus(0).deviation).toBe(-1230);
  });
});

describe("formatDeviation / formatLine", () => {
  it("formats deviations with a sign", () => {
    expect(formatDeviation(0)).toBe("±0");
    expect(formatDeviation(12)).toBe("+12");
    expect(formatDeviation(-7)).toBe("−7");
  });

  it("formats lines as the source writes them", () => {
    expect(formatLine(47.5)).toBe("47.5");
    expect(formatLine(47)).toBe("47");
    expect(formatLine(0)).toBe("0");
  });
});

describe("pickConflict", () => {
  it("flags Üst with a projection below the line", () => {
    expect(
      pickConflict(47.5, { side: "over", confidence: 1, projectedWins: 47 }),
    ).toBe("over-but-below");
  });

  it("flags Alt with a projection above the line", () => {
    expect(
      pickConflict(47.5, { side: "under", confidence: 1, projectedWins: 48 }),
    ).toBe("under-but-above");
  });

  it("accepts projections on the picked side", () => {
    expect(
      pickConflict(47.5, { side: "over", confidence: 1, projectedWins: 48 }),
    ).toBeNull();
    expect(
      pickConflict(47.5, { side: "under", confidence: 1, projectedWins: 0 }),
    ).toBeNull();
  });

  it("treats a projection equal to a whole line as no conflict", () => {
    expect(
      pickConflict(47, { side: "over", confidence: 1, projectedWins: 47 }),
    ).toBeNull();
    expect(
      pickConflict(47, { side: "under", confidence: 1, projectedWins: 47 }),
    ).toBeNull();
  });

  it("needs both a side and a projection", () => {
    expect(pickConflict(47.5, undefined)).toBeNull();
    expect(pickConflict(47.5, {})).toBeNull();
    expect(pickConflict(47.5, { projectedWins: 10 })).toBeNull();
    expect(pickConflict(47.5, { side: "over", confidence: 3 })).toBeNull();
  });
});

describe("isLocked", () => {
  const lockAt = "2026-10-20T19:00:00Z";

  it("is open before the lock time", () => {
    expect(isLocked(new Date("2026-10-20T18:59:59Z"), lockAt)).toBe(false);
  });

  it("locks at the lock time and after", () => {
    expect(isLocked(new Date("2026-10-20T19:00:00Z"), lockAt)).toBe(true);
    expect(isLocked(new Date("2027-01-01T00:00:00Z"), lockAt)).toBe(true);
  });
});
