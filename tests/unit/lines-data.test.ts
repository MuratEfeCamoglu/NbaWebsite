import { describe, expect, it } from "vitest";
import { SEASON } from "@config/season";
import { LINE_FILE, WIN_LINES } from "@/data/lines";
import sampleFile from "@/data/lines/2026-27.sample.json";
import { TEAM_IDS } from "@/data/teams";
import {
  lineFileSchema,
  lineTotalStatus,
  sourceSpread,
  sumLines,
} from "@/lib/validation";

describe("2026-27 win lines (real data)", () => {
  it("is for the configured season and is not sample data", () => {
    expect(LINE_FILE.season).toBe(SEASON.id);
    expect(LINE_FILE.isSample).toBe(false);
  });

  it("covers every team exactly once, as a line or a todo", () => {
    const covered = [
      ...WIN_LINES.map((line) => line.teamId),
      ...LINE_FILE.todo,
    ];
    expect([...covered].sort()).toEqual([...TEAM_IDS].sort());
  });

  it("has at least two independent sources per line", () => {
    for (const winLine of WIN_LINES) {
      const books = new Set(winLine.sources.map((s) => s.book ?? s.name));
      const urls = new Set(winLine.sources.map((s) => s.url));
      expect(books.size, winLine.teamId).toBeGreaterThanOrEqual(2);
      expect(urls.size, winLine.teamId).toBe(winLine.sources.length);
    }
  });

  it("uses a consensus line that one of its sources actually reports", () => {
    for (const winLine of WIN_LINES) {
      const reported = winLine.sources.map((s) => s.line);
      expect(reported, winLine.teamId).toContain(winLine.line);
    }
  });

  it("flags exactly the teams whose sources differ by more than 1 win", () => {
    for (const winLine of WIN_LINES) {
      expect(winLine.needsReview === true, winLine.teamId).toBe(
        sourceSpread(winLine.sources) > 1,
      );
    }
  });

  it("adds up to a plausible league total", () => {
    // Only meaningful once every team has a line.
    if (LINE_FILE.todo.length === 0) {
      expect(lineTotalStatus(sumLines(WIN_LINES))).toBe("ok");
    }
  });
});

describe("2026-27 sample lines", () => {
  it("is valid and explicitly marked as sample", () => {
    const parsed = lineFileSchema.parse(sampleFile);
    expect(parsed.isSample).toBe(true);
    for (const winLine of parsed.lines) {
      for (const lineSource of winLine.sources) {
        expect(lineSource.name).toMatch(/^SAMPLE/);
        expect(lineSource.url).toMatch(/^https:\/\/example\.com\//);
      }
    }
  });
});
