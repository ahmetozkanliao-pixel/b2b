import Link from "next/link";
import { Button } from "@/components/ui/button";
import { NewsGrid } from "@/components/news/news-grid";
import type { NewsArticle } from "@/types";

interface NewsSectionProps {
  articles: NewsArticle[];
}

export function NewsSection({ articles }: NewsSectionProps) {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row sm:items-end">
          <div className="text-center sm:text-left">
            <p className="section-label">Güncel</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Haberler
            </h2>
            <p className="mt-4 max-w-xl text-lg text-slate-500">
              Platformdan ve sektörden son gelişmeler
            </p>
          </div>
          <Link href="/haberler" className="hidden sm:block">
            <Button variant="outline">Tüm Haberler</Button>
          </Link>
        </div>

        <div className="mt-12">
          <NewsGrid articles={articles} />
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link href="/haberler">
            <Button variant="outline">Tüm Haberler</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
