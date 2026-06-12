import Link from "next/link";
import { Button } from "@/components/ui/button";
import { NewsGrid } from "@/components/news/news-grid";
import { ChapterSection } from "@/components/home/chapter-section";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import type { NewsArticle } from "@/types";

interface NewsSectionProps {
  articles: NewsArticle[];
}

export function NewsSection({ articles }: NewsSectionProps) {
  return (
    <ChapterSection id="haberler" variant="muted" className="!min-h-0">
      <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
        <ScrollReveal className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="editorial-label">07 — Haberler</p>
            <h2 className="editorial-heading mt-4 text-4xl sm:text-5xl lg:text-6xl">Haberler</h2>
            <p className="mt-4 max-w-md text-base leading-relaxed text-slate-500 sm:text-lg">
              Platformdan ve sektörden son gelişmeler
            </p>
          </div>
          <Link href="/haberler" className="hidden sm:block">
            <Button variant="outline" className="rounded-full px-6 uppercase tracking-wider">
              Tüm Haberler
            </Button>
          </Link>
        </ScrollReveal>

        <ScrollReveal delay={120} className="mt-14">
          <NewsGrid articles={articles} />
        </ScrollReveal>

        <div className="mt-10 text-center sm:hidden">
          <Link href="/haberler">
            <Button variant="outline" className="rounded-full px-6">
              Tüm Haberler
            </Button>
          </Link>
        </div>
      </div>
    </ChapterSection>
  );
}
