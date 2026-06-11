import type { Metadata } from "next";
import { getPublishedNews } from "@/lib/news";
import { NewsGrid } from "@/components/news/news-grid";

export const metadata: Metadata = {
  title: "Haberler",
  description: "B2B Üretim Platformu haberleri ve sektör gelişmeleri",
};

export default async function NewsPage() {
  const articles = await getPublishedNews();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center sm:text-left">
        <p className="section-label">Güncel</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Haberler
        </h1>
        <p className="mt-4 text-lg text-slate-500">
          Platformdan ve üretim sektöründen son gelişmeler
        </p>
      </div>
      <div className="mt-12">
        <NewsGrid articles={articles} />
      </div>
    </div>
  );
}
