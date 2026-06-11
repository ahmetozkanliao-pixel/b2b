import { isDemoMode } from "@/lib/demo/config";
import { getDemoNews, getDemoNewsBySlug } from "@/lib/demo/store";
import { createClient } from "@/lib/supabase/server";
import type { NewsArticle } from "@/types";

export async function getPublishedNews(limit?: number): Promise<NewsArticle[]> {
  if (isDemoMode()) {
    const articles = getDemoNews();
    return limit ? articles.slice(0, limit) : articles;
  }

  const supabase = await createClient();
  let query = supabase
    .from("news")
    .select("*")
    .eq("is_published", true)
    .order("published_at", { ascending: false });

  if (limit) query = query.limit(limit);

  const { data } = await query;
  return (data as NewsArticle[]) || [];
}

export async function getNewsBySlug(slug: string): Promise<NewsArticle | null> {
  if (isDemoMode()) {
    return getDemoNewsBySlug(slug);
  }

  const supabase = await createClient();
  const { data } = await supabase
    .from("news")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  return (data as NewsArticle) || null;
}
