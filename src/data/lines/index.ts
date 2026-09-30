import { lineFileSchema, type LineFile } from "@/lib/validation";
import rawLines from "./2026-27.json";

/** Real, sourced win lines for the current season, validated on load. */
export const LINE_FILE: LineFile = lineFileSchema.parse(rawLines);

export const WIN_LINES = LINE_FILE.lines;
