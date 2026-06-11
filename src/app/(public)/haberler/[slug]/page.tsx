import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getNewsBySlug } from "@/lib/news";
import { ShareNewsButton, CopyNewsLink } from "@/components/news/share-news-button";
import { formatDate } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getNewsBySlug(slug);
  return {
    title: article?.title || "Haber",
    description: article?.summary || undefined,
  };
}

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getNewsBySlug(slug);
  if (!article) notFound();

  const sharePath = `/haberler/${article.slug}`;

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <Link
        href="/haberler"
        className="mb-8 inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Tüm Haberler
      </Link>

      {article.cover_image && (
        <div className="relative mb-8 h-64 overflow-hidden rounded-2xl sm:h-80">
          <Image
            src={article.cover_image}
            alt={article.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      <header>
        <p className="text-sm font-medium text-slate-400">
          {article.published_at && formatDate(article.published_at)}
          {article.author_name && ` · ${article.author_name}`}
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          {article.title}
        </h1>
        {article.summary && (
          <p className="mt-4 text-lg leading-relaxed text-slate-600">{article.summary}</p>
        )}
      </header>

      <div className="mt-6 flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <ShareNewsButton url={sharePath} title={article.title} />
        <div className="min-w-0 flex-1">
          <CopyNewsLink url={sharePath} />
        </div>
      </div>

      <div className="prose prose-slate mt-10 max-w-none">
        {article.content.split("\n\n").map((paragraph, i) => (
          <p key={i} className="mb-4 leading-relaxed text-slate-700">
            {paragraph}
          </p>
        ))}
      </div>
    </article>
  );
}
