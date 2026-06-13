"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { NewsGrid } from "@/components/news/news-grid";
import { ChapterSection } from "@/components/home/chapter-section";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { useI18n } from "@/components/i18n/i18n-provider";
import type { NewsArticle } from "@/types";

interface NewsSectionProps {
  articles: NewsArticle[];
}

export function NewsSection({ articles }: NewsSectionProps) {
  const { t } = useI18n();

  return (
    <ChapterSection id="haberler" variant="dark" className="!min-h-0">
      <div className="resend-grid pointer-events-none absolute inset-0 opacity-40" aria-hidden />
      <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
        <ScrollReveal className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="editorial-label">{t("home.news.label")}</p>
            <h2 className="editorial-heading-light mt-4 text-4xl text-white sm:text-5xl lg:text-6xl">
              {t("home.news.title")}
            </h2>
            <p className="mt-4 max-w-md text-base leading-relaxed text-neutral-400 sm:text-lg">
              {t("home.news.subtitle2")}
            </p>
          </div>
          <Link href="/haberler" className="hidden sm:block">
            <Button
              variant="outline"
              className="rounded-lg border-white/20 bg-white/5 px-6 text-white hover:border-white/30 hover:bg-white/10"
            >
              {t("common.allNews")}
            </Button>
          </Link>
        </ScrollReveal>

        <ScrollReveal delay={120} className="mt-14">
          <NewsGrid articles={articles} />
        </ScrollReveal>

        <div className="mt-10 text-center sm:hidden">
          <Link href="/haberler">
            <Button
              variant="outline"
              className="rounded-lg border-white/20 bg-white/5 px-6 text-white hover:border-white/30 hover:bg-white/10"
            >
              {t("common.allNews")}
            </Button>
          </Link>
        </div>
      </div>
    </ChapterSection>
  );
}
