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
      className="font-display flex items-baseline gap-3.5 text-4xl leading-none font-extrabold tracking-[0.04em]"
    >
      {section.division
        ? tr.division[section.division]
        : tr.conference[section.conference]}
      <span className="text-ink-muted text-lg font-semibold tracking-[0.1em]">
        {section.division
          ? `${tr.division.suffix} · ${tr.conference[section.conference]}`
          : tr.conference.suffix}
      </span>
    </h2>
  );
}
