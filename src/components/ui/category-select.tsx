"use client";

import { cn } from "@/lib/utils";
import { getMainCategories, getSubCategories } from "@/lib/categories";
import type { Category } from "@/types";

interface CategorySelectProps {
  categories: Category[];
  selected: string[];
  onChange: (ids: string[]) => void;
  label?: string;
  hint?: string;
  required?: boolean;
}

export function CategorySelect({
  categories,
  selected,
  onChange,
  label = "Üretim Kategorileri",
  hint,
  required,
}: CategorySelectProps) {
  const hasHierarchy = categories.some((c) => c.parent_id);
  const mainCategories = hasHierarchy ? getMainCategories(categories) : categories;

  function toggle(id: string) {
    if (selected.includes(id)) {
      onChange(selected.filter((s) => s !== id));
    } else {
      onChange([...selected, id]);
    }
  }

  if (!hasHierarchy) {
    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-700">
          {label}
          {required && " *"}
        </label>
        {hint && <p className="text-xs text-slate-500">{hint}</p>}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => {
            const isSelected = selected.includes(cat.id);
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => toggle(cat.id)}
                className={cn(
                  "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
                  isSelected
                    ? "border-brand-500 bg-brand-50 text-brand-700"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                )}
              >
                {cat.name}
              </button>
            );
          })}
        </div>
        {required && selected.length === 0 && (
          <p className="text-xs text-amber-600">En az bir kategori seçmelisiniz.</p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700">
          {label}
          {required && " *"}
        </label>
        {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
      </div>
      {mainCategories.map((main) => {
        const subs = getSubCategories(categories, main.id);
        if (!subs.length) return null;
        return (
          <div key={main.id} className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
            <p className="mb-2 text-sm font-semibold text-slate-800">{main.name}</p>
            <div className="flex flex-wrap gap-2">
              {subs.map((cat) => {
                const isSelected = selected.includes(cat.id);
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => toggle(cat.id)}
                    className={cn(
                      "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
                      isSelected
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
        );
      })}
      {required && selected.length === 0 && (
        <p className="text-xs text-amber-600">En az bir alt kategori seçmelisiniz.</p>
      )}
    </div>
  );
}
