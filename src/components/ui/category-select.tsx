"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { getCategoriesByIds, getMainCategories, getSubCategories } from "@/lib/categories";
import type { Category } from "@/types";

interface CategorySelectProps {
  categories: Category[];
  selected: string[];
  onChange: (ids: string[]) => void;
  label?: string;
  hint?: string;
  required?: boolean;
  placeholder?: string;
}

function CategoryListItem({
  category,
  isSelected,
  onToggle,
  indented,
}: {
  category: Category;
  isSelected: boolean;
  onToggle: () => void;
  indented?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        "flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm transition-colors hover:bg-slate-50",
        indented && "pl-6",
        isSelected && "bg-brand-50/60"
      )}
    >
      <span
        className={cn(
          "flex h-4 w-4 shrink-0 items-center justify-center rounded border",
          isSelected ? "border-brand-500 bg-brand-500 text-white" : "border-slate-300 bg-white"
        )}
      >
        {isSelected && <Check className="h-3 w-3" strokeWidth={3} />}
      </span>
      <span className={cn("text-slate-700", isSelected && "font-medium text-brand-700")}>
        {category.name}
      </span>
    </button>
  );
}

export function CategorySelect({
  categories,
  selected,
  onChange,
  label = "Üretim Kategorileri",
  hint,
  required,
  placeholder = "Kategori seçin",
}: CategorySelectProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const hasHierarchy = categories.some((c) => c.parent_id);
  const mainCategories = hasHierarchy ? getMainCategories(categories) : categories;
  const selectedCategories = getCategoriesByIds(selected, categories);

  function toggle(id: string) {
    if (selected.includes(id)) {
      onChange(selected.filter((s) => s !== id));
    } else {
      onChange([...selected, id]);
    }
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const buttonLabel =
    selectedCategories.length === 0
      ? placeholder
      : selectedCategories.length === 1
        ? selectedCategories[0].name
        : `${selectedCategories.length} kategori seçildi`;

  const selectableCategories = hasHierarchy
    ? mainCategories.flatMap((main) => getSubCategories(categories, main.id))
    : categories;

  return (
    <div className="space-y-1.5" ref={containerRef}>
      <label className="block text-sm font-medium text-slate-700">
        {label}
        {required && " *"}
      </label>
      {hint && <p className="text-xs text-slate-500">{hint}</p>}

      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          aria-expanded={open}
          aria-haspopup="listbox"
          className={cn(
            "flex w-full items-center justify-between gap-3 rounded-lg border bg-white px-4 py-2.5 text-sm shadow-sm transition-colors",
            open ? "border-brand-400 ring-2 ring-brand-500/20" : "border-slate-200 hover:border-slate-300"
          )}
        >
          <span className={cn("truncate text-left", selected.length === 0 ? "text-slate-400" : "text-slate-900")}>
            {buttonLabel}
          </span>
          <ChevronDown
            className={cn("h-4 w-4 shrink-0 text-slate-400 transition-transform", open && "rotate-180")}
          />
        </button>

        {open && (
          <div
            role="listbox"
            aria-multiselectable="true"
            className="absolute z-30 mt-1 max-h-64 w-full overflow-y-auto rounded-lg border border-slate-200 bg-white py-1 shadow-lg"
          >
            {selectableCategories.length === 0 ? (
              <p className="px-3 py-4 text-center text-sm text-slate-500">Kategori bulunamadı.</p>
            ) : hasHierarchy ? (
              mainCategories.map((main) => {
                const subs = getSubCategories(categories, main.id);
                if (!subs.length) return null;
                return (
                  <div key={main.id} className="border-b border-slate-100 last:border-b-0">
                    <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      {main.name}
                    </p>
                    {subs.map((cat) => (
                      <CategoryListItem
                        key={cat.id}
                        category={cat}
                        isSelected={selected.includes(cat.id)}
                        onToggle={() => toggle(cat.id)}
                        indented
                      />
                    ))}
                  </div>
                );
              })
            ) : (
              categories.map((cat) => (
                <CategoryListItem
                  key={cat.id}
                  category={cat}
                  isSelected={selected.includes(cat.id)}
                  onToggle={() => toggle(cat.id)}
                />
              ))
            )}
          </div>
        )}
      </div>

      {selectedCategories.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {selectedCategories.map((cat) => (
            <span
              key={cat.id}
              className="rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-medium text-brand-700"
            >
              {cat.name}
            </span>
          ))}
        </div>
      )}

      {required && selected.length === 0 && (
        <p className="text-xs text-amber-600">En az bir kategori seçmelisiniz.</p>
      )}
    </div>
  );
}
