import type { ReactNode } from "react";

/** Step label, large page title and lead paragraph at the top of a step page. */
export function PageIntro({
  step,
  title,
  lead,
  aside,
}: {
  step: string;
  title: string;
  lead: string;
  aside?: ReactNode;
}) {
  return (
    <section className="flex flex-wrap items-end justify-between gap-x-12 gap-y-6 px-6 pt-14 pb-8 lg:px-30">
      <div className="flex flex-col gap-3">
        <p className="text-ink-muted text-[13px] font-semibold tracking-[0.14em]">
          {step}
        </p>
        <h1 className="font-display text-7xl leading-[0.9] font-extrabold tracking-[0.01em] lg:text-8xl">
          {title}
        </h1>
        <p className="text-ink-soft mt-2 max-w-[620px] text-[17px] leading-[1.55]">
          {lead}
        </p>
      </div>
      {aside}
    </section>
  );
}
