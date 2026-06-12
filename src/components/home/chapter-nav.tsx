"use client";

import { cn } from "@/lib/utils";
import type { HomeChapter } from "@/lib/home-chapters";

interface ChapterNavProps {
  chapters: HomeChapter[];
  activeId: string;
  onNavigate: (id: string) => void;
}

export function ChapterNav({ chapters, activeId, onNavigate }: ChapterNavProps) {
  return (
    <>
      {/* Masaüstü — sağ şerit panel (içeriğin üstünde, her zeminde okunur) */}
      <aside
        className="fixed right-0 top-1/2 z-40 hidden -translate-y-1/2 lg:block"
        aria-label="Bölüm navigasyonu"
      >
        <nav className="chapter-nav-rail flex flex-col gap-0.5 rounded-l-2xl border border-r-0 border-slate-200/80 bg-white/95 py-3 pl-2 pr-3 shadow-xl shadow-slate-900/10 backdrop-blur-xl">
          <p className="mb-2 px-2 text-[9px] font-semibold uppercase tracking-[0.22em] text-slate-400">
            Bölümler
          </p>
          {chapters.map((chapter) => {
            const isActive = chapter.id === activeId;
            return (
              <button
                key={chapter.id}
                type="button"
                onClick={() => onNavigate(chapter.id)}
                title={chapter.label}
                className={cn(
                  "group flex w-full items-center gap-2.5 rounded-xl px-2 py-2 text-left transition-all duration-300",
                  isActive
                    ? "bg-brand-50 ring-1 ring-brand-200/70"
                    : "hover:bg-slate-50"
                )}
                aria-current={isActive ? "true" : undefined}
              >
                <span
                  className={cn(
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[10px] font-bold tabular-nums transition-colors",
                    isActive
                      ? "bg-brand-500 text-white"
                      : "bg-slate-100 text-slate-500 group-hover:bg-slate-200"
                  )}
                >
                  {chapter.number}
                </span>
                <span
                  className={cn(
                    "min-w-0 text-[10px] font-semibold uppercase leading-tight tracking-wide transition-colors",
                    isActive ? "text-brand-700" : "text-slate-600 group-hover:text-slate-800"
                  )}
                >
                  <span className="hidden xl:inline">{chapter.label}</span>
                  <span className="xl:hidden">{chapter.shortLabel}</span>
                </span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Mobil — alt nokta menüsü */}
      <nav
        className="fixed bottom-6 left-1/2 z-40 flex -translate-x-1/2 items-center gap-2 rounded-full border border-slate-200/80 bg-white/95 px-3 py-2 shadow-lg shadow-slate-900/10 backdrop-blur-xl lg:hidden"
        aria-label="Bölüm navigasyonu"
      >
        {chapters.map((chapter) => {
          const isActive = chapter.id === activeId;
          return (
            <button
              key={chapter.id}
              type="button"
              onClick={() => onNavigate(chapter.id)}
              className={cn(
                "rounded-full transition-all duration-300",
                isActive ? "h-2.5 w-6 bg-brand-500" : "h-2 w-2 bg-slate-300 hover:bg-slate-400"
              )}
              aria-label={chapter.label}
              aria-current={isActive ? "true" : undefined}
            />
          );
        })}
      </nav>
    </>
  );
}
