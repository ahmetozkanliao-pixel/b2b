"use client";

import { cn } from "@/lib/utils";
import { type Locale } from "@/lib/i18n/config";
import { useI18n } from "./i18n-provider";

interface LanguageSwitcherProps {
  className?: string;
  compact?: boolean;
  transparent?: boolean;
  onDark?: boolean;
}

export function LanguageSwitcher({
  className,
  compact = false,
  transparent = false,
  onDark = false,
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
            onDark
              ? "text-slate-400"
              : transparent
                ? "text-neutral-500"
                : "text-slate-400"
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
                ? onDark
                  ? "bg-brand-500/25 text-brand-100 ring-1 ring-brand-400/30"
                  : transparent
                    ? "bg-neutral-900/10 text-neutral-900"
                    : "bg-brand-50 text-brand-700"
                : onDark
                  ? "text-slate-400 hover:bg-white/5 hover:text-white"
                  : transparent
                    ? "text-neutral-500 hover:bg-neutral-900/5 hover:text-neutral-900"
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
