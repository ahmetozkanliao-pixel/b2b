"use client";

import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { useI18n } from "@/components/i18n/i18n-provider";

export function ForgotPasswordPageContent() {
  const { t } = useI18n();

  return (
    <div className="auth-card">
      <h1 className="text-2xl font-semibold text-slate-900">{t("auth.forgotPasswordTitle")}</h1>
      <p className="mt-2 text-sm text-slate-600">{t("auth.forgotPasswordSubtitle")}</p>
      <ForgotPasswordForm />
    </div>
  );
}
