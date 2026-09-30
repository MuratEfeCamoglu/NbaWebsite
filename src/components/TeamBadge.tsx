import { getTeam, type TeamId } from "@/data/teams";
import { inkFor } from "@/lib/color";

/** Abbreviation + color badge. Stands in for team logos, which are never used. */
export function TeamBadge({ teamId }: { teamId: TeamId }) {
  const team = getTeam(teamId);
  return (
    <span
      role="img"
      aria-label={`${team.city} ${team.name}`}
      title={`${team.city} ${team.name}`}
      className="font-display flex size-12 shrink-0 items-center justify-center rounded-xl border-2 text-[17px] font-extrabold tracking-[0.03em]"
      style={{
        background: team.colors.primary,
        borderColor: team.colors.secondary,
        color: inkFor(team.colors.primary),
      }}
    >
      {team.id}
    </span>
  );
}
