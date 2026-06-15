"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { useI18n } from "@/components/i18n/i18n-provider";

export function ResetPasswordForm() {
  const { t } = useI18n();
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError(t("auth.passwordMinHint"));
      return;
    }

    if (password !== confirmPassword) {
      setError(t("auth.resetPasswordMismatch"));
      return;
    }

    setLoading(true);

    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({ password });

    if (updateError) {
      setError(t("auth.resetPasswordError"));
      setLoading(false);
      return;
    }

    await supabase.auth.signOut();
    router.push("/giris?reset=1");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      <Input
        id="password"
        label={t("auth.resetPasswordField")}
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="••••••••"
        required
        minLength={6}
      />
      <Input
        id="confirmPassword"
        label={t("auth.resetPasswordConfirm")}
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder="••••••••"
        required
        minLength={6}
      />

      {error && (
        <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>
      )}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? t("auth.updating") : t("auth.resetPasswordSubmit")}
      </Button>

      <p className="text-center text-sm text-slate-600">
        <Link href="/giris" className="font-medium text-brand-600 hover:text-brand-700">
          {t("auth.backToLogin")}
        </Link>
      </p>
    </form>
  );
}
