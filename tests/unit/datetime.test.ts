import { describe, expect, it } from "vitest";
import { formatDateTime } from "@/lib/datetime";

describe("formatDateTime", () => {
  it("shows a UTC timestamp in Istanbul time, in Turkish", () => {
    const text = formatDateTime("2026-10-20T19:00:00Z", "Europe/Istanbul");
    expect(text).toContain("20 Ekim 2026");
    expect(text).toContain("Salı");
    expect(text).toContain("22:00");
  });

  it("rolls over to the next day when needed", () => {
    const text = formatDateTime("2026-10-20T21:30:00Z", "Europe/Istanbul");
    expect(text).toContain("21 Ekim 2026");
    expect(text).toContain("00:30");
  });
});
