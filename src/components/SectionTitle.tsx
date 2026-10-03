import { tr } from "@/i18n/tr";
import type { SummarySection } from "@/lib/summary";

/** Heading of a team table: a conference, or a division with its conference. */
export function SectionTitle({
  id,
  section,
}: {
  id: string;
  section: Pick<SummarySection, "conference" | "division">;
}) {
  return (
    <h2
      id={id}
      className="font-display flex flex-wrap items-baseline gap-x-3.5 gap-y-1 text-3xl leading-none font-extrabold tracking-[0.04em] sm:text-4xl"
    >
      {section.division
        ? tr.division[section.division]
        : tr.conference[section.conference]}
      <span className="text-ink-muted text-base font-semibold tracking-[0.1em] sm:text-lg">
        {section.division
          ? `${tr.division.suffix} · ${tr.conference[section.conference]}`
          : tr.conference.suffix}
      </span>
    </h2>
  );
}
