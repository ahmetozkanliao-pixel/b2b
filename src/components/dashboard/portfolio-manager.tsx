"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Plus, Pencil, Trash2, X, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { PortfolioItem } from "@/types";

interface PortfolioManagerProps {
  items: PortfolioItem[];
  isDemo?: boolean;
}

const emptyForm = {
  title: "",
  description: "",
  image_url: "",
  year: "",
  client_name: "",
};

export function PortfolioManager({ items: initialItems, isDemo = false }: PortfolioManagerProps) {
  const router = useRouter();
  const [items, setItems] = useState(initialItems);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);

  function openAdd() {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  }

  function openEdit(item: PortfolioItem) {
    setEditingId(item.id);
    setForm({
      title: item.title,
      description: item.description || "",
      image_url: item.image_url || "",
      year: item.year?.toString() || "",
      client_name: item.client_name || "",
    });
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) return;

    setLoading(true);

    if (isDemo) {
      const method = editingId ? "PATCH" : "POST";
      const body = editingId ? { id: editingId, ...form, year: form.year || null } : { ...form, year: form.year || null };

      const res = await fetch("/api/demo/portfolio", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        const data = await res.json();
        if (editingId) {
          setItems((prev) => prev.map((i) => (i.id === editingId ? data.item : i)));
        } else {
          setItems((prev) => [data.item, ...prev]);
        }
        closeForm();
        router.refresh();
      }
    }

    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Bu projeyi silmek istediğinize emin misiniz?")) return;

    if (isDemo) {
      const res = await fetch(`/api/demo/portfolio?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setItems((prev) => prev.filter((i) => i.id !== id));
        router.refresh();
      }
    }
  }

  return (
    <Card>
      <CardContent>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Önceki İşler</h2>
            <p className="text-sm text-slate-500">
              Tamamladığınız projeleri profilinizde paylaşın
            </p>
          </div>
          {!showForm && (
            <Button size="sm" onClick={openAdd}>
              <Plus className="h-4 w-4" />
              Proje Ekle
            </Button>
          )}
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="mb-6 space-y-4 rounded-xl border border-brand-200 bg-brand-50/30 p-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-slate-900">
                {editingId ? "Projeyi Düzenle" : "Yeni Proje"}
              </h3>
              <button type="button" onClick={closeForm} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <Input
              id="port-title"
              label="Proje Adı *"
              value={form.title}
              onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
              required
            />
            <Textarea
              id="port-desc"
              label="Açıklama"
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              rows={2}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                id="port-year"
                label="Yıl"
                type="number"
                value={form.year}
                onChange={(e) => setForm((p) => ({ ...p, year: e.target.value }))}
                placeholder="2025"
              />
              <Input
                id="port-client"
                label="Müşteri / Proje"
                value={form.client_name}
                onChange={(e) => setForm((p) => ({ ...p, client_name: e.target.value }))}
                placeholder="Firma adı veya İç Proje"
              />
            </div>
            <Input
              id="port-image"
              label="Görsel URL"
              value={form.image_url}
              onChange={(e) => setForm((p) => ({ ...p, image_url: e.target.value }))}
              placeholder="https://..."
            />
            <div className="flex gap-2">
              <Button type="submit" size="sm" disabled={loading}>
                <Check className="h-4 w-4" />
                {loading ? "Kaydediliyor..." : "Kaydet"}
              </Button>
              <Button type="button" size="sm" variant="ghost" onClick={closeForm}>
                İptal
              </Button>
            </div>
          </form>
        )}

        {items.length === 0 ? (
          <p className="py-8 text-center text-sm text-slate-400">
            Henüz proje eklenmemiş. Profilinizi zenginleştirmek için tamamladığınız işleri paylaşın.
          </p>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 rounded-xl border border-slate-200/80 p-3"
              >
                <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                  {item.image_url ? (
                    <Image src={item.image_url} alt="" fill className="object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-slate-300">—</div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-slate-900">{item.title}</p>
                  <p className="text-xs text-slate-400">
                    {[item.year, item.client_name].filter(Boolean).join(" · ")}
                  </p>
                </div>
                <div className="flex shrink-0 gap-1">
                  <button
                    type="button"
                    onClick={() => openEdit(item)}
                    className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
