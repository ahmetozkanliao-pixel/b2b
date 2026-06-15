"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, Search, X } from "lucide-react";
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
  searchPlaceholder?: string;
}

function CategoryListItem({
  category,
  isSelected,
  onToggle,
  indented,
  parentName,
}: {
  category: Category;
  isSelected: boolean;
  onToggle: () => void;
  indented?: boolean;
  parentName?: string;
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
      <span className={cn("min-w-0 text-slate-700", isSelected && "font-medium text-brand-700")}>
        {parentName ? (
          <>
            <span className="text-slate-400">{parentName} › </span>
            {category.name}
          </>
        ) : (
          category.name
        )}
      </span>
    </button>
  );
}

function normalizeSearch(value: string) {
  return value.trim().toLocaleLowerCase("tr");
}

export function CategorySelect({
  categories,
  selected,
  onChange,
  label = "Üretim Kategorileri",
  hint,
  required,
  placeholder = "Kategori seçin",
  searchPlaceholder = "Kategori ara...",
}: CategorySelectProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const hasHierarchy = categories.some((c) => c.parent_id);
  const mainCategories = hasHierarchy ? getMainCategories(categories) : categories;
  const selectedCategories = getCategoriesByIds(selected, categories);
  const normalizedQuery = normalizeSearch(searchQuery);

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

  useEffect(() => {
    if (!open) {
      setSearchQuery("");
      return;
    }
    const timer = window.setTimeout(() => searchInputRef.current?.focus(), 0);
    return () => window.clearTimeout(timer);
  }, [open]);

  const buttonLabel =
    selectedCategories.length === 0
      ? placeholder
      : selectedCategories.length === 1
        ? selectedCategories[0].name
        : `${selectedCategories.length} kategori seçildi`;

  const filteredHierarchyGroups = useMemo(() => {
    if (!hasHierarchy) return [];

    return mainCategories
      .map((main) => {
        const subs = getSubCategories(categories, main.id);
        const mainMatches = !normalizedQuery || normalizeSearch(main.name).includes(normalizedQuery);
        const filteredSubs = subs.filter((sub) => {
          if (!normalizedQuery) return true;
          if (mainMatches) return true;
          return normalizeSearch(sub.name).includes(normalizedQuery);
        });
        if (!filteredSubs.length) return null;
        return { main, subs: filteredSubs };
      })
      .filter((group): group is { main: Category; subs: Category[] } => group !== null);
  }, [categories, hasHierarchy, mainCategories, normalizedQuery]);

  const filteredFlatCategories = useMemo(() => {
    if (hasHierarchy) return [];

    return categories.filter(
      (cat) => !normalizedQuery || normalizeSearch(cat.name).includes(normalizedQuery)
    );
  }, [categories, hasHierarchy, normalizedQuery]);

  const hasResults = hasHierarchy
    ? filteredHierarchyGroups.length > 0
    : filteredFlatCategories.length > 0;
  const showParentInResults = Boolean(normalizedQuery);

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
          <div className="absolute z-30 mt-1 w-full overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg">
            <div className="border-b border-slate-100 p-2">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  ref={searchInputRef}
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={searchPlaceholder}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  onKeyDown={(e) => {
                    if (e.key === "Escape") {
                      setOpen(false);
                    }
                  }}
                />
              </div>
            </div>

            <div
              role="listbox"
              aria-multiselectable="true"
              className="max-h-64 overflow-y-auto py-1"
            >
              {!hasResults ? (
                <p className="px-3 py-4 text-center text-sm text-slate-500">Kategori bulunamadı.</p>
              ) : hasHierarchy ? (
                filteredHierarchyGroups.map(({ main, subs }) => (
                  <div key={main.id} className="border-b border-slate-100 last:border-b-0">
                    {!normalizedQuery && (
                      <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        {main.name}
                      </p>
                    )}
                    {subs.map((cat) => (
                      <CategoryListItem
                        key={cat.id}
                        category={cat}
                        isSelected={selected.includes(cat.id)}
                        onToggle={() => toggle(cat.id)}
                        indented={!showParentInResults}
                        parentName={showParentInResults ? main.name : undefined}
                      />
                    ))}
                  </div>
                ))
              ) : (
                filteredFlatCategories.map((cat) => (
                  <CategoryListItem
                    key={cat.id}
                    category={cat}
                    isSelected={selected.includes(cat.id)}
                    onToggle={() => toggle(cat.id)}
                  />
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {selectedCategories.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {selectedCategories.map((cat) => (
            <span
              key={cat.id}
              className="inline-flex items-center gap-1 rounded-full bg-brand-50 py-0.5 pl-2.5 pr-1 text-xs font-medium text-brand-700"
            >
              {cat.name}
              <button
                type="button"
                onClick={() => toggle(cat.id)}
                className="inline-flex h-5 w-5 items-center justify-center rounded-full text-brand-600 transition-colors hover:bg-brand-100 hover:text-brand-800"
                aria-label={`${cat.name} kategorisini kaldır`}
              >
                <X className="h-3 w-3" />
              </button>
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
