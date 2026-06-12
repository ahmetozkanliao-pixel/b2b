import { isDemoMode } from "@/lib/demo/config";
import { getDemoCategories } from "@/lib/demo/store";
import { createClient } from "@/lib/supabase/server";
import type { Category } from "@/types";

export async function getAppCategories(): Promise<Category[]> {
  if (isDemoMode()) {
    return getDemoCategories().filter((c) => c.is_active !== false);
  }

  const supabase = await createClient();
  const { data } = await supabase
    .from("categories")
    .select("id, name, slug, icon, parent_id, sort_order, is_active")
    .eq("is_active", true)
    .order("sort_order");

  return data || [];
}

export async function getAdminCategories(): Promise<Category[]> {
  if (isDemoMode()) {
    return getDemoCategories();
  }

  const supabase = await createClient();
  const { data } = await supabase
    .from("categories")
    .select("id, name, slug, icon, parent_id, sort_order, is_active")
    .order("sort_order");

  return data || [];
}
