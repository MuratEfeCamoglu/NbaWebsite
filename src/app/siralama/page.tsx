import type { Metadata } from "next";
import { PageIntro } from "@/components/PageIntro";
import { RankingBoard } from "@/components/RankingBoard";
import { SiteHeader } from "@/components/SiteHeader";
import { tr } from "@/i18n/tr";

export const metadata: Metadata = {
  title: `${tr.ranking.title} · ${tr.meta.title}`,
};

export default function RankingPage() {
  return (
    <div className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col">
      <SiteHeader current="ranking" />
      <main className="flex flex-1 flex-col">
        <PageIntro
          step={tr.ranking.step}
          title={tr.ranking.title}
          lead={tr.ranking.lead}
        />
        <RankingBoard />
      </main>
    </div>
  );
}
