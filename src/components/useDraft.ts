"use client";

import { useCallback, useSyncExternalStore } from "react";
import { SEASON } from "@config/season";
import { emptyDraft, parseDraft } from "@/lib/draft";
import { isLocked } from "@/lib/lock";
import { parseViewMode, type ViewMode } from "@/lib/summary";
import type { Draft } from "@/lib/validation";

const STORAGE_KEY = `nba-tahmin:draft:${SEASON.id}`;
const EMPTY_DRAFT = emptyDraft(SEASON.id);
const LOCK_CHECK_INTERVAL_MS = 30_000;

// The parsed draft is cached against the raw string so that
// useSyncExternalStore gets a stable snapshot between changes.
let cachedRaw: string | null = null;
let cachedDraft: Draft = EMPTY_DRAFT;
/** false once localStorage turned out to be unusable; the draft then lives in memory. */
let storageUsable = true;
const listeners = new Set<() => void>();

function readDraft(): Draft {
  if (!storageUsable) return cachedDraft;
  let raw: string | null;
  try {
    raw = window.localStorage.getItem(STORAGE_KEY);
  } catch {
    storageUsable = false;
    return cachedDraft;
  }
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cachedDraft = parseDraft(raw, SEASON.id);
  }
  return cachedDraft;
}

function writeDraft(draft: Draft): void {
  cachedRaw = JSON.stringify(draft);
  cachedDraft = draft;
  if (storageUsable) {
    try {
      window.localStorage.setItem(STORAGE_KEY, cachedRaw);
    } catch {
      storageUsable = false;
    }
  }
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

/** The prediction being edited, kept in localStorage and shared across pages and tabs. */
export function useDraft(): [Draft, (change: (draft: Draft) => Draft) => void] {
  const draft = useSyncExternalStore(subscribe, readDraft, () => EMPTY_DRAFT);
  const update = useCallback((change: (draft: Draft) => Draft) => {
    if (isLocked(new Date(), SEASON.lockAt)) return;
    writeDraft(change(readDraft()));
  }, []);
  return [draft, update];
}

function subscribeToClock(listener: () => void): () => void {
  const timer = window.setInterval(listener, LOCK_CHECK_INTERVAL_MS);
  return () => window.clearInterval(timer);
}

/** true once the season's first game has tipped off. */
export function useIsLocked(): boolean {
  return useSyncExternalStore(
    subscribeToClock,
    () => isLocked(new Date(), SEASON.lockAt),
    () => false,
  );
}

const VIEW_KEY = "nba-tahmin:view";
let memoryView: ViewMode = "conference";

function readViewMode(): ViewMode {
  if (!storageUsable) return memoryView;
  try {
    return parseViewMode(window.localStorage.getItem(VIEW_KEY));
  } catch {
    return memoryView;
  }
}

/** Whether teams are listed by conference or by division; remembered per browser. */
export function useViewMode(): [ViewMode, (mode: ViewMode) => void] {
  const mode = useSyncExternalStore(
    subscribe,
    readViewMode,
    (): ViewMode => "conference",
  );
  const setMode = useCallback((next: ViewMode) => {
    memoryView = next;
    try {
      window.localStorage.setItem(VIEW_KEY, next);
    } catch {
      storageUsable = false;
    }
    listeners.forEach((listener) => listener());
  }, []);
  return [mode, setMode];
}
