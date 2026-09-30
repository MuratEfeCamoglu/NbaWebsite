import type { Metadata } from "next";
import { PageIntro } from "@/components/PageIntro";
import { SiteHeader } from "@/components/SiteHeader";
import { SummaryBoard } from "@/components/SummaryBoard";
import { tr } from "@/i18n/tr";

export const metadata: Metadata = {
  title: `${tr.summary.title} · ${tr.meta.title}`,
};

export default function SummaryPage() {
  return (
    <div className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col">
      <SiteHeader current="summary" />
      <main className="flex flex-1 flex-col">
        <PageIntro
          step={tr.summary.step}
          title={tr.summary.title}
          lead={tr.summary.lead}
        />
        <SummaryBoard />
      </main>
    </div>
  );
}
