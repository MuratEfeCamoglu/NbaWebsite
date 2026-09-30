/** Predictions cannot change from the moment the first game tips off. */
export function isLocked(now: Date, lockAt: string): boolean {
  return now.getTime() >= new Date(lockAt).getTime();
}
