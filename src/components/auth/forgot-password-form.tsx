"use client";

import { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { isDemoMode } from "@/lib/demo/config";
import { useI18n } from "@/components/i18n/i18n-provider";

export function ForgotPasswordForm() {
  const { t } = useI18n();
  const [email, setEmail] = useState("");
  const [info, setInfo] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setInfo("");
    setLoading(true);

    if (isDemoMode()) {
      setInfo(t("auth.forgotPasswordDemoHint"));
      setLoading(false);
      return;
    }

    const supabase = createClient();
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/sifre-yenile`,
    });

    if (resetError) {
      setError(t("auth.forgotPasswordError"));
      setLoading(false);
      return;
    }

    setInfo(t("auth.forgotPasswordSent"));
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      <Input
        id="email"
        label={t("auth.email")}
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="ornek@sirket.com"
        required
      />

      {info && (
        <p className="rounded-lg border border-brand-200 bg-brand-50 p-3 text-sm text-brand-800">{info}</p>
      )}

      {error && (
        <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>
      )}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? t("auth.sending") : t("auth.forgotPasswordSubmit")}
      </Button>

      <p className="text-center text-sm text-slate-600">
        <Link href="/giris" className="font-medium text-brand-600 hover:text-brand-700">
          {t("auth.backToLogin")}
        </Link>
      </p>
    </form>
  );
}
