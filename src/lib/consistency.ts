import type { DraftPick } from "@/lib/validation";

export type PickConflict = "over-but-below" | "under-but-above";

/** A pick contradicts itself when the projection lands on the other side of the line. */
export function pickConflict(
  line: number,
  pick: DraftPick | undefined,
): PickConflict | null {
  if (pick?.side === undefined || pick.projectedWins === undefined) return null;
  if (pick.side === "over" && pick.projectedWins < line) {
    return "over-but-below";
  }
  if (pick.side === "under" && pick.projectedWins > line) {
    return "under-but-above";
  }
  return null;
}
