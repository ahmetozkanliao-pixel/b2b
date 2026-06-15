"use client";

import { Logo } from "@/components/ui/logo";
import { HeroVisual } from "@/components/home/hero-visual";
import { Shield } from "lucide-react";
import { useI18n } from "@/components/i18n/i18n-provider";

export function AuthMarketingPanel() {
  const { t } = useI18n();

  return (
    <div className="surface-dark relative hidden w-1/2 flex-col justify-between overflow-hidden border-r border-white/10 p-12 lg:flex">
      <div className="resend-grid pointer-events-none absolute inset-0 opacity-40" aria-hidden />
      <div className="relative">
        <Logo size="lg" variant="light" href="/" />
      </div>
      <div className="relative flex items-center justify-center py-8">
        <HeroVisual className="mx-auto w-full max-w-[420px]" />
      </div>
      <div className="relative">
        <h2 className="text-2xl font-semibold leading-tight tracking-tight text-white">
          {t("auth.layoutTitle")}
        </h2>
        <p className="mt-4 max-w-md text-base leading-relaxed text-slate-300">
          {t("auth.layoutSubtitle")}
        </p>
        <div className="mt-8 flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3">
          <Shield className="h-4 w-4 text-brand-300" />
          <span className="text-sm text-slate-300">{t("auth.layoutSecurity")}</span>
        </div>
      </div>
      <p className="relative font-mono text-xs text-slate-500">
        &copy; {new Date().getFullYear()} {t("meta.siteTitle")}
      </p>
    </div>
  );
}
