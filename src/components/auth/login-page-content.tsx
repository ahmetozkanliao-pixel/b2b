"use client";

import { LoginForm } from "@/components/auth/login-form";
import { useI18n } from "@/components/i18n/i18n-provider";

export function LoginPageContent() {
  const { t } = useI18n();

  return (
    <div className="auth-card">
      <h1 className="text-2xl font-semibold text-slate-900">{t("auth.loginTitle")}</h1>
      <p className="mt-2 text-sm text-slate-600">{t("auth.loginSubtitle2")}</p>
      <LoginForm />
    </div>
  );
}
