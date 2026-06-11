"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { NewsArticle } from "@/types";

interface NewsFormProps {
  articles: NewsArticle[];
  isDemo?: boolean;
}

const emptyForm = {
  title: "",
  summary: "",
  content: "",
  cover_image: "",
};

export function NewsForm({ articles: initialArticles, isDemo = false }: NewsFormProps) {
  const router = useRouter();
  const [articles, setArticles] = useState(initialArticles);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) return;

    setLoading(true);
    setSuccess(false);

    if (isDemo) {
      const res = await fetch("/api/demo/news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        const data = await res.json();
        setArticles((prev) => [data.article, ...prev]);
        setForm(emptyForm);
        setSuccess(true);
        router.refresh();
      }
    }

    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Bu haberi silmek istediğinize emin misiniz?")) return;

    if (isDemo) {
      const res = await fetch(`/api/demo/news?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setArticles((prev) => prev.filter((a) => a.id !== id));
        router.refresh();
      }
    }
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardContent>
          <h2 className="text-lg font-semibold text-slate-900">Yeni Haber Yayınla</h2>
          <p className="mt-1 text-sm text-slate-500">
            Haber yayınlandığında ana sayfa ve haberler bölümünde görünür
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <Input
              id="news-title"
              label="Başlık *"
              value={form.title}
              onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
              required
            />
            <Input
              id="news-summary"
              label="Özet"
              value={form.summary}
              onChange={(e) => setForm((p) => ({ ...p, summary: e.target.value }))}
              placeholder="Kısa açıklama (liste görünümünde)"
            />
            <Textarea
              id="news-content"
              label="İçerik *"
              value={form.content}
              onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))}
              rows={6}
              placeholder="Paragraflar arasında boş satır bırakın"
              required
            />
            <Input
              id="news-cover"
              label="Kapak Görseli URL"
              value={form.cover_image}
              onChange={(e) => setForm((p) => ({ ...p, cover_image: e.target.value }))}
              placeholder="https://..."
            />

            {success && (
              <p className="rounded-xl bg-green-50 p-3 text-sm text-green-600">
                Haber yayınlandı!
              </p>
            )}

            <Button type="submit" disabled={loading}>
              {loading ? "Yayınlanıyor..." : "Haberi Yayınla"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <h2 className="text-lg font-semibold text-slate-900">Yayınlanan Haberler</h2>
          {articles.length === 0 ? (
            <p className="mt-4 text-sm text-slate-400">Henüz haber yok.</p>
          ) : (
            <ul className="mt-4 divide-y divide-slate-100">
              {articles.map((article) => (
                <li key={article.id} className="flex items-center justify-between gap-4 py-4">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-slate-900">{article.title}</p>
                    <p className="text-xs text-slate-400">
                      {article.published_at && formatDate(article.published_at)}
                      {article.is_published === false && " · Taslak"}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDelete(article.id)}
                    className="shrink-0 rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
