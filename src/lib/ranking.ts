import { teamsInConference, type Conference, type TeamId } from "@/data/teams";
import type { Ranking } from "@/lib/validation";

/** Alphabetical order (Turkish collation), used until the user ranks teams. */
export function defaultRanking(): Ranking {
  const sorted = (conference: Conference) =>
    teamsInConference(conference)
      .map((team) => ({ id: team.id, label: `${team.city} ${team.name}` }))
      .sort((a, b) => a.label.localeCompare(b.label, "tr"))
      .map((entry) => entry.id);
  return { West: sorted("West"), East: sorted("East") };
}

/** Moves the item at `from` to `to`. Out-of-range indexes leave the order as is. */
export function moveTeam(
  list: readonly TeamId[],
  from: number,
  to: number,
): TeamId[] {
  const next = [...list];
  const inRange = (index: number) =>
    Number.isInteger(index) && index >= 0 && index < list.length;
  if (!inRange(from) || !inRange(to) || from === to) return next;
  const [moved] = next.splice(from, 1);
  next.splice(to, 0, moved);
  return next;
}
