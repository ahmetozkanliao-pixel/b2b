"use client";

import { cn } from "@/lib/utils";
import { getMainCategories, getSubCategories } from "@/lib/categories";
import type { Category } from "@/types";

interface HierarchicalCategorySelectProps {
  categories: Category[];
  mainCategoryId: string;
  subCategoryId: string;
  onMainChange: (id: string) => void;
  onSubChange: (id: string) => void;
}

export function HierarchicalCategorySelect({
  categories,
  mainCategoryId,
  subCategoryId,
  onMainChange,
  onSubChange,
}: HierarchicalCategorySelectProps) {
  const mainCategories = getMainCategories(categories);
  const subCategories = mainCategoryId ? getSubCategories(categories, mainCategoryId) : [];

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-700">Ana Kategori *</label>
        <p className="text-xs text-slate-500">İhtiyacınızın bulunduğu ana üretim alanını seçin.</p>
        <div className="grid gap-2 sm:grid-cols-2">
          {mainCategories.map((cat) => {
            const selected = mainCategoryId === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  onMainChange(cat.id);
                  onSubChange("");
                }}
                className={cn(
                  "rounded-xl border px-4 py-3 text-left text-sm font-medium transition-colors",
                  selected
                    ? "border-brand-500 bg-brand-50 text-brand-800"
                    : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                )}
              >
                {cat.name}
              </button>
            );
          })}
        </div>
      </div>

      {mainCategoryId && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">Alt Kategori *</label>
          <p className="text-xs text-slate-500">
            Daha spesifik alt kategori seçin. Yalnızca bu alanda üretim yapan firmalar ilanı görecektir.
          </p>
          <div className="flex flex-wrap gap-2">
            {subCategories.map((cat) => {
              const selected = subCategoryId === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => onSubChange(cat.id)}
                  className={cn(
                    "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
                    selected
                      ? "border-brand-500 bg-brand-50 text-brand-700"
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                  )}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
