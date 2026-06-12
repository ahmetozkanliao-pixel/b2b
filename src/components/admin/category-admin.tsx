"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getMainCategories, getSubCategories } from "@/lib/categories";
import { slugify } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import type { Category } from "@/types";

interface CategoryAdminProps {
  categories: Category[];
  isDemo?: boolean;
}

const emptyForm = {
  name: "",
  slug: "",
  parent_id: "",
};

export function CategoryAdmin({ categories: initialCategories, isDemo = false }: CategoryAdminProps) {
  const router = useRouter();
  const [categories, setCategories] = useState(initialCategories);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const mainCategories = getMainCategories(categories);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return;

    setLoading(true);
    setError("");

    const payload = {
      name: form.name.trim(),
      slug: form.slug.trim() || slugify(form.name),
      parent_id: form.parent_id || null,
    };

    if (isDemo) {
      const res = await fetch("/api/demo/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Kategori eklenemedi.");
        setLoading(false);
        return;
      }
      setCategories((prev) => [...prev, data.category]);
    } else {
      const supabase = createClient();
      const { data, error: insertError } = await supabase
        .from("categories")
        .insert({
          name: payload.name,
          slug: payload.slug,
          parent_id: payload.parent_id,
          sort_order: categories.length,
          is_active: true,
        })
        .select()
        .single();

      if (insertError) {
        setError(insertError.message);
        setLoading(false);
        return;
      }
      setCategories((prev) => [...prev, data]);
    }

    setForm(emptyForm);
    setLoading(false);
    router.refresh();
  }

  function startEdit(category: Category) {
    setEditingId(category.id);
    setEditForm({
      name: category.name,
      slug: category.slug,
      parent_id: category.parent_id || "",
    });
    setError("");
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!editingId || !editForm.name.trim()) return;

    setLoading(true);
    setError("");

    const payload = {
      id: editingId,
      name: editForm.name.trim(),
      slug: editForm.slug.trim() || slugify(editForm.name),
      parent_id: editForm.parent_id || null,
    };

    if (isDemo) {
      const res = await fetch("/api/demo/admin/categories", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Kategori güncellenemedi.");
        setLoading(false);
        return;
      }
      setCategories((prev) =>
        prev.map((c) => (c.id === editingId ? data.category : c))
      );
    } else {
      const supabase = createClient();
      const { data, error: updateError } = await supabase
        .from("categories")
        .update({
          name: payload.name,
          slug: payload.slug,
          parent_id: payload.parent_id,
        })
        .eq("id", editingId)
        .select()
        .single();

      if (updateError) {
        setError(updateError.message);
        setLoading(false);
        return;
      }
      setCategories((prev) =>
        prev.map((c) => (c.id === editingId ? data : c))
      );
    }

    setEditingId(null);
    setEditForm(emptyForm);
    setLoading(false);
    router.refresh();
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`"${name}" kategorisini silmek istediğinize emin misiniz?`)) return;

    setLoading(true);
    setError("");

    if (isDemo) {
      const res = await fetch(`/api/demo/admin/categories?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Kategori silinemedi.");
        setLoading(false);
        return;
      }
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } else {
      const supabase = createClient();
      const { error: deleteError } = await supabase.from("categories").delete().eq("id", id);
      if (deleteError) {
        setError(deleteError.message);
        setLoading(false);
        return;
      }
      setCategories((prev) => prev.filter((c) => c.id !== id));
    }

    setLoading(false);
    router.refresh();
  }

  function renderCategoryRow(category: Category, isSub = false) {
    const isEditing = editingId === category.id;

    if (isEditing) {
      return (
        <form
          key={category.id}
          onSubmit={handleUpdate}
          className={`flex flex-wrap items-end gap-3 rounded-lg border border-brand-200 bg-brand-50/50 p-3 ${isSub ? "ml-6" : ""}`}
        >
          <div className="min-w-[160px] flex-1">
            <Input
              id={`edit-name-${category.id}`}
              label="Ad"
              value={editForm.name}
              onChange={(e) => setEditForm((p) => ({ ...p, name: e.target.value }))}
              required
            />
          </div>
          <div className="min-w-[140px] flex-1">
            <Input
              id={`edit-slug-${category.id}`}
              label="Slug"
              value={editForm.slug}
              onChange={(e) => setEditForm((p) => ({ ...p, slug: e.target.value }))}
            />
          </div>
          {isSub && (
            <div className="min-w-[160px] flex-1">
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Ana Kategori</label>
              <select
                value={editForm.parent_id}
                onChange={(e) => setEditForm((p) => ({ ...p, parent_id: e.target.value }))}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              >
                <option value="">Seçin</option>
                {mainCategories.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div className="flex gap-2">
            <Button type="submit" size="sm" disabled={loading}>
              Kaydet
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => setEditingId(null)}
              disabled={loading}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </form>
      );
    }

    return (
      <div
        key={category.id}
        className={`flex items-center justify-between gap-3 rounded-lg border border-slate-200/80 px-4 py-3 ${isSub ? "ml-6 bg-slate-50/50" : "bg-white"}`}
      >
        <div>
          <p className="font-medium text-slate-900">{category.name}</p>
          <p className="text-xs text-slate-500">{category.slug}</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => startEdit(category)} disabled={loading}>
            <Pencil className="h-4 w-4" />
            Düzenle
          </Button>
          <Button
            size="sm"
            variant="danger"
            onClick={() => handleDelete(category.id, category.name)}
            disabled={loading}
          >
            <Trash2 className="h-4 w-4" />
            Sil
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardContent>
          <h2 className="text-lg font-semibold text-slate-900">Yeni Kategori Ekle</h2>
          <p className="mt-1 text-sm text-slate-500">
            Ana kategori veya mevcut bir ana kategorinin altına alt kategori ekleyin
          </p>

          <form onSubmit={handleAdd} className="mt-6 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                id="cat-name"
                label="Kategori Adı *"
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                placeholder="Örn: Metal & Çelik"
                required
              />
              <Input
                id="cat-slug"
                label="Slug"
                value={form.slug}
                onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))}
                placeholder="URL dostu kısa ad (otomatik oluşturulur)"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Tür</label>
              <select
                value={form.parent_id}
                onChange={(e) => setForm((p) => ({ ...p, parent_id: e.target.value }))}
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm sm:max-w-md"
              >
                <option value="">Ana Kategori</option>
                {mainCategories.map((m) => (
                  <option key={m.id} value={m.id}>
                    Alt kategori: {m.name}
                  </option>
                ))}
              </select>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <Button type="submit" disabled={loading}>
              <Plus className="h-4 w-4" />
              {loading ? "Ekleniyor..." : "Kategori Ekle"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-lg font-semibold text-slate-900">Mevcut Kategoriler</h2>
        <p className="mt-1 text-sm text-slate-500">
          {mainCategories.length} ana, {categories.length - mainCategories.length} alt kategori
        </p>

        <div className="mt-4 space-y-4">
          {mainCategories.length > 0 ? (
            mainCategories.map((main) => {
              const subs = getSubCategories(categories, main.id);
              return (
                <div key={main.id} className="space-y-2">
                  {renderCategoryRow(main)}
                  {subs.map((sub) => renderCategoryRow(sub, true))}
                </div>
              );
            })
          ) : (
            <Card>
              <CardContent className="py-8 text-center text-slate-500">
                Henüz kategori eklenmemiş.
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
