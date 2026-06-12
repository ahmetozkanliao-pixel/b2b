"use client";

import { cn } from "@/lib/utils";
import type { HomeChapter } from "@/lib/home-chapters";
import { useI18n } from "@/components/i18n/i18n-provider";

interface ChapterNavProps {
  chapters: HomeChapter[];
  activeId: string;
  onNavigate: (id: string) => void;
}

export function ChapterNav({ chapters, activeId, onNavigate }: ChapterNavProps) {
  const { t } = useI18n();

  return (
    <>
      <aside
        className="fixed right-0 top-1/2 z-40 hidden -translate-y-1/2 lg:block"
        aria-label={t("home.chapters.sections")}
      >
        <nav className="chapter-nav-rail flex flex-col gap-0.5 rounded-l-xl border border-r-0 border-white/10 bg-black/90 py-3 pl-2 pr-3 backdrop-blur-xl">
          <p className="mb-2 px-2 font-mono text-[9px] uppercase tracking-[0.2em] text-neutral-500">
            {t("home.chapters.sections")}
          </p>
          {chapters.map((chapter) => {
            const isActive = chapter.id === activeId;
            const label = t(chapter.labelKey);
            const shortLabel = t(chapter.shortLabelKey);
            return (
              <button
                key={chapter.id}
                type="button"
                onClick={() => onNavigate(chapter.id)}
                title={label}
                className={cn(
                  "group flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-left transition-all duration-300",
                  isActive ? "bg-white/10" : "hover:bg-white/5"
                )}
                aria-current={isActive ? "true" : undefined}
              >
                <span
                  className={cn(
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-md font-mono text-[10px] tabular-nums transition-colors",
                    isActive
                      ? "bg-white text-black"
                      : "bg-white/5 text-neutral-500 group-hover:bg-white/10"
                  )}
                >
                  {chapter.number}
                </span>
                <span
                  className={cn(
                    "min-w-0 text-[10px] font-medium uppercase leading-tight tracking-wide transition-colors",
                    isActive ? "text-white" : "text-neutral-500 group-hover:text-neutral-300"
                  )}
                >
                  <span className="hidden xl:inline">{label}</span>
                  <span className="xl:hidden">{shortLabel}</span>
                </span>
              </button>
            );
          })}
        </nav>
      </aside>

      <nav
        className="fixed bottom-6 left-1/2 z-40 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/10 bg-black/90 px-3 py-2 backdrop-blur-xl lg:hidden"
        aria-label={t("home.chapters.sections")}
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
                isActive ? "h-2.5 w-6 bg-white" : "h-2 w-2 bg-neutral-600 hover:bg-neutral-400"
              )}
              aria-label={t(chapter.labelKey)}
              aria-current={isActive ? "true" : undefined}
            />
          );
        })}
      </nav>
    </>
  );
}
