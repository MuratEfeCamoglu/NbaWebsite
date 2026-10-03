import Image from "next/image";
import { getTeam, type TeamId } from "@/data/teams";

/** Team logo on a light tile, framed in the team's primary color. */
export function TeamBadge({ teamId }: { teamId: TeamId }) {
  const team = getTeam(teamId);
  return (
    <span
      role="img"
      aria-label={`${team.city} ${team.name}`}
      title={`${team.city} ${team.name}`}
      data-team-badge={team.id}
      className="bg-ink flex size-10 shrink-0 items-center justify-center rounded-[10px] border-2 sm:size-12 sm:rounded-xl"
      style={{ borderColor: team.colors.primary }}
    >
      <Image
        src={`/logos/${team.id}.png`}
        alt=""
        width={38}
        height={38}
        className="size-[30px] object-contain sm:size-[38px]"
      />
      <span className="sr-only">{team.id}</span>
    </span>
  );
}
