import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import type { NewsArticle } from "@/types";

interface NewsGridProps {
  articles: NewsArticle[];
}

export function NewsGrid({ articles }: NewsGridProps) {
  if (articles.length === 0) {
    return (
      <p className="py-12 text-center text-sm text-slate-400">
        Henüz yayınlanmış haber bulunmuyor.
      </p>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {articles.map((article) => (
        <Card key={article.id} hover className="group overflow-hidden">
          {article.cover_image && (
            <div className="relative h-48 w-full overflow-hidden">
              <Image
                src={article.cover_image}
                alt={article.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary-950/40 to-transparent" />
            </div>
          )}
          <CardContent>
            <p className="text-xs font-medium text-slate-400">
              {article.published_at && formatDate(article.published_at)}
            </p>
            <h3 className="mt-2 text-lg font-semibold text-slate-900 line-clamp-2 group-hover:text-primary-800 transition-colors">
              {article.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-500 line-clamp-2">
              {article.summary}
            </p>
            <Link
              href={`/haberler/${article.slug}`}
              className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-600 transition-colors hover:text-brand-700"
            >
              Devamını Oku
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
