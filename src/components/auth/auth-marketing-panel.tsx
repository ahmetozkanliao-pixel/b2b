"use client";

import { Logo } from "@/components/ui/logo";
import { ResendCube } from "@/components/ui/resend-cube";
import { Shield } from "lucide-react";
import { useI18n } from "@/components/i18n/i18n-provider";

export function AuthMarketingPanel() {
  const { t } = useI18n();

  return (
    <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden border-r border-white/10 bg-black p-12 lg:flex">
      <div className="resend-grid pointer-events-none absolute inset-0 opacity-50" aria-hidden />
      <div className="relative">
        <Logo size="lg" variant="light" href="/" />
      </div>
      <div className="relative flex items-center justify-center py-8">
        <ResendCube size="md" />
      </div>
      <div className="relative">
        <h2 className="text-2xl font-semibold leading-tight tracking-tight text-white">
          {t("auth.layoutTitle")}
        </h2>
        <p className="mt-4 max-w-md text-base leading-relaxed text-neutral-400">
          {t("auth.layoutSubtitle")}
        </p>
        <div className="mt-8 flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3">
          <Shield className="h-4 w-4 text-neutral-300" />
          <span className="text-sm text-neutral-400">{t("auth.layoutSecurity")}</span>
        </div>
      </div>
      <p className="relative font-mono text-xs text-neutral-600">
        &copy; {new Date().getFullYear()} {t("meta.siteTitle")}
      </p>
    </div>
  );
}
