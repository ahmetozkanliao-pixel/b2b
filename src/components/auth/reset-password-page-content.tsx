"use client";

import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { useI18n } from "@/components/i18n/i18n-provider";

export function ResetPasswordPageContent() {
  const { t } = useI18n();

  return (
    <div className="auth-card">
      <h1 className="text-2xl font-semibold text-slate-900">{t("auth.resetPasswordTitle")}</h1>
      <p className="mt-2 text-sm text-slate-600">{t("auth.resetPasswordSubtitle")}</p>
      <ResetPasswordForm />
    </div>
  );
}
