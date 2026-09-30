import type { Metadata } from "next";
import { OverUnderBoard } from "@/components/OverUnderBoard";
import { PageIntro } from "@/components/PageIntro";
import { SiteHeader } from "@/components/SiteHeader";
import { tr } from "@/i18n/tr";

export const metadata: Metadata = {
  title: `${tr.picks.title} · ${tr.meta.title}`,
};

function Legend() {
  return (
    <div className="text-ink-soft flex flex-wrap gap-x-6 gap-y-2 text-sm">
      <div className="flex items-center gap-2.5">
        <span className="bg-over text-over-ink font-display rounded-md px-2.5 py-1 text-base font-bold tracking-[0.06em]">
          {tr.picks.over}
        </span>
        <span>{tr.picks.overHint}</span>
      </div>
      <div className="flex items-center gap-2.5">
        <span className="bg-under text-under-ink font-display rounded-md px-2.5 py-1 text-base font-bold tracking-[0.06em]">
          {tr.picks.under}
        </span>
        <span>{tr.picks.underHint}</span>
      </div>
    </div>
  );
}

export default function OverUnderPage() {
  return (
    <div className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col">
      <SiteHeader current="picks" />
      <main className="flex flex-1 flex-col">
        <PageIntro
          step={tr.picks.step}
          title={tr.picks.title}
          lead={tr.picks.lead}
          aside={<Legend />}
        />
        <OverUnderBoard />
      </main>
    </div>
  );
}
