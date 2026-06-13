"use client";

import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/components/i18n/i18n-provider";
import { useTheme } from "@/components/theme/theme-provider";

interface ThemeSwitcherProps {
  className?: string;
  compact?: boolean;
  transparent?: boolean;
}

export function ThemeSwitcher({
  className,
  compact = false,
  transparent = false,
}: ThemeSwitcherProps) {
  const { theme, setTheme } = useTheme();
  const { t } = useI18n();

  return (
    <div
      className={cn("flex items-center gap-1", className)}
      role="group"
      aria-label={t("theme.switchLabel")}
    >
      {!compact && (
        <span
          className={cn(
            "mr-1 text-xs font-medium uppercase tracking-wider",
            transparent
              ? "text-neutral-500 dark:text-white/50"
              : "text-neutral-500 dark:text-slate-400"
          )}
        >
          {t("theme.switchLabel")}
        </span>
      )}
      <button
        type="button"
        onClick={() => setTheme("light")}
        className={cn(
          "rounded-lg p-1.5 transition-colors",
          theme === "light"
            ? transparent
              ? "bg-neutral-900/10 text-neutral-900 dark:bg-white/15 dark:text-white"
              : "bg-neutral-900 text-white dark:bg-white/15 dark:text-white"
            : transparent
              ? "text-neutral-500 hover:bg-neutral-900/5 hover:text-neutral-900 dark:text-white/60 dark:hover:bg-white/10 dark:hover:text-white"
              : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 dark:text-white/60 dark:hover:bg-white/10 dark:hover:text-white"
        )}
        aria-pressed={theme === "light"}
        aria-label={t("theme.light")}
        title={t("theme.light")}
      >
        <Sun className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => setTheme("dark")}
        className={cn(
          "rounded-lg p-1.5 transition-colors",
          theme === "dark"
            ? transparent
              ? "bg-neutral-900/10 text-neutral-900 dark:bg-white/15 dark:text-white"
              : "bg-neutral-900 text-white"
            : transparent
              ? "text-neutral-500 hover:bg-neutral-900/5 hover:text-neutral-900 dark:text-white/60 dark:hover:bg-white/10 dark:hover:text-white"
              : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 dark:text-white/60 dark:hover:bg-white/10 dark:hover:text-white"
        )}
        aria-pressed={theme === "dark"}
        aria-label={t("theme.dark")}
        title={t("theme.dark")}
      >
        <Moon className="h-4 w-4" />
      </button>
    </div>
  );
}
