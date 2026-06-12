"use client";

import { cn } from "@/lib/utils";
import { type Locale } from "@/lib/i18n/config";
import { useI18n } from "./i18n-provider";

interface LanguageSwitcherProps {
  className?: string;
  compact?: boolean;
  transparent?: boolean;
}

export function LanguageSwitcher({
  className,
  compact = false,
  transparent = false,
}: LanguageSwitcherProps) {
  const { locale, setLocale, t } = useI18n();

  function switchTo(nextLocale: Locale) {
    if (nextLocale !== locale) setLocale(nextLocale);
  }

  return (
    <div
      className={cn("flex items-center gap-1", className)}
      role="group"
      aria-label={t("language.switchLabel")}
    >
      {!compact && (
        <span
          className={cn(
            "mr-1 text-xs font-medium uppercase tracking-wider",
            transparent ? "text-white/50" : "text-slate-400"
          )}
        >
          {t("language.switchLabel")}
        </span>
      )}
      {(["tr", "en"] as const).map((code) => {
        const active = locale === code;
        return (
          <button
            key={code}
            type="button"
            onClick={() => switchTo(code)}
            className={cn(
              "rounded-lg px-2.5 py-1.5 text-xs font-semibold uppercase tracking-wide transition-colors",
              active
                ? transparent
                  ? "bg-white/15 text-white"
                  : "bg-brand-50 text-brand-700"
                : transparent
                  ? "text-white/60 hover:bg-white/10 hover:text-white"
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
            )}
            aria-pressed={active}
          >
            {code}
          </button>
        );
      })}
    </div>
  );
}
