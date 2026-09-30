/**
 * Formats a UTC ISO timestamp for display, e.g. "20 Ekim 2026 Salı 22:00".
 * Dates are stored in UTC and always shown in the given time zone.
 */
export function formatDateTime(isoUtc: string, timeZone: string): string {
  return new Intl.DateTimeFormat("tr-TR", {
    timeZone,
    day: "numeric",
    month: "long",
    year: "numeric",
    weekday: "long",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(new Date(isoUtc));
}
