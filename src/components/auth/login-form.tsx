"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { Building2, Factory, Shield, Crown } from "lucide-react";
import { useI18n } from "@/components/i18n/i18n-provider";
import {
  DEMO_ADMIN_USER,
  DEMO_DEMAND_USER,
  DEMO_PRODUCER_FREE_USER,
  DEMO_PRODUCER_USER,
} from "@/lib/demo/config";

const DEMO_ACCOUNTS = {
  demand: { email: DEMO_DEMAND_USER.email, password: DEMO_DEMAND_USER.password },
  producerFree: {
    email: DEMO_PRODUCER_FREE_USER.email,
    password: DEMO_PRODUCER_FREE_USER.password,
  },
  producerPro: { email: DEMO_PRODUCER_USER.email, password: DEMO_PRODUCER_USER.password },
  admin: { email: DEMO_ADMIN_USER.email, password: DEMO_ADMIN_USER.password },
};

export function LoginForm() {
  const { t } = useI18n();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [info, setInfo] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (searchParams.get("verified") === "1") {
      setInfo("E-posta adresiniz doğrulandı. Artık giriş yapabilirsiniz.");
    }
    if (searchParams.get("reset") === "1") {
      setInfo(t("auth.resetPasswordSuccess"));
    }
  }, [searchParams, t]);

  async function loginWithDemo(credentials: { email: string; password: string }) {
    setError("");
    setLoading(true);

    const res = await fetch("/api/demo/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || t("auth.loginFailed"));
      setInfo("");
      setLoading(false);
      return;
    }

    router.push(credentials.email === DEMO_ACCOUNTS.admin.email ? "/admin" : "/dashboard");
    router.refresh();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const demoRes = await fetch("/api/demo/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (demoRes.ok) {
      router.push(email === DEMO_ACCOUNTS.admin.email ? "/admin" : "/dashboard");
      router.refresh();
      setLoading(false);
      return;
    }

    const demoData = await demoRes.json().catch(() => ({}));
    if (demoRes.status !== 400 || demoData.error !== "Demo modu aktif değil.") {
      setError(demoData.error || t("auth.invalidCredentials"));
      setLoading(false);
      return;
    }

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(t("auth.invalidCredentials"));
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      <div className="grid grid-cols-2 gap-2 sm:gap-3">
        <div className="rounded-lg border border-primary-100 bg-slate-50 p-2.5 sm:p-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-900">
            <Building2 className="h-4 w-4 text-brand-600" />
            <span className="text-xs sm:text-sm">{t("auth.demoDemand")}</span>
          </div>
          <p className="hidden text-xs leading-relaxed text-slate-600 sm:block">
            <strong className="text-slate-800">{DEMO_ACCOUNTS.demand.email}</strong>
            <br />
            {t("auth.password")}: <strong className="text-slate-800">{DEMO_ACCOUNTS.demand.password}</strong>
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-2 w-full text-xs sm:mt-3 sm:text-sm"
            onClick={() => loginWithDemo(DEMO_ACCOUNTS.demand)}
            disabled={loading}
          >
            {t("auth.demoLoginDemand")}
          </Button>
        </div>

        <div className="rounded-lg border border-brand-200 bg-brand-50/50 p-2.5 sm:p-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-900">
            <Factory className="h-4 w-4 text-brand-600" />
            <span className="text-xs sm:text-sm">Tedarikçi (Ücretsiz)</span>
          </div>
          <p className="hidden text-xs leading-relaxed text-slate-600 sm:block">
            Ayarlardan Pro&apos;ya yükseltmeyi deneyin.
            <br />
            <strong className="text-slate-800">{DEMO_ACCOUNTS.producerFree.email}</strong>
            <br />
            {t("auth.password")}:{" "}
            <strong className="text-slate-800">{DEMO_ACCOUNTS.producerFree.password}</strong>
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-2 w-full border-brand-200 bg-white text-xs sm:mt-3 sm:text-sm"
            onClick={() => loginWithDemo(DEMO_ACCOUNTS.producerFree)}
            disabled={loading}
          >
            Ücretsiz Tedarikçi Giriş
          </Button>
        </div>

        <div className="rounded-lg border border-primary-100 bg-slate-50 p-2.5 sm:p-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-900">
            <Crown className="h-4 w-4 text-brand-600" />
            <span className="text-xs sm:text-sm">Tedarikçi (Pro)</span>
          </div>
          <p className="hidden text-xs leading-relaxed text-slate-600 sm:block">
            <strong className="text-slate-800">{DEMO_ACCOUNTS.producerPro.email}</strong>
            <br />
            {t("auth.password")}:{" "}
            <strong className="text-slate-800">{DEMO_ACCOUNTS.producerPro.password}</strong>
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-2 w-full text-xs sm:mt-3 sm:text-sm"
            onClick={() => loginWithDemo(DEMO_ACCOUNTS.producerPro)}
            disabled={loading}
          >
            Pro Tedarikçi Giriş
          </Button>
        </div>

        <div className="rounded-lg border border-primary-100 bg-slate-50 p-2.5 sm:p-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-900">
            <Shield className="h-4 w-4 text-brand-600" />
            <span className="text-xs sm:text-sm">{t("auth.demoAdmin")}</span>
          </div>
          <p className="hidden text-xs leading-relaxed text-slate-600 sm:block">
            <strong className="text-slate-800">{DEMO_ACCOUNTS.admin.email}</strong>
            <br />
            {t("auth.password")}: <strong className="text-slate-800">{DEMO_ACCOUNTS.admin.password}</strong>
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-2 w-full text-xs sm:mt-3 sm:text-sm"
            onClick={() => loginWithDemo(DEMO_ACCOUNTS.admin)}
            disabled={loading}
          >
            {t("auth.demoLoginAdmin")}
          </Button>
        </div>
      </div>

      <Input
        id="email"
        label={t("auth.email")}
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="demo@tedarikci.com"
        required
      />
      <Input
        id="password"
        label={t("auth.passwordField")}
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="••••••••"
        required
      />
      <div className="-mt-1 flex justify-end">
        <Link href="/sifremi-unuttum" className="text-sm font-medium text-brand-600 hover:text-brand-700">
          {t("auth.forgotPassword")}
        </Link>
      </div>

      {info && (
        <p className="rounded-lg border border-brand-200 bg-brand-50 p-3 text-sm text-brand-800">{info}</p>
      )}

      {error && (
        <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>
      )}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? t("auth.signingIn") : t("auth.loginButton")}
      </Button>

      <p className="text-center text-sm text-slate-600">
        {t("auth.noAccount")}{" "}
        <Link href="/kayit" className="font-medium text-brand-600 hover:text-brand-700">
          {t("auth.registerLink")}
        </Link>
      </p>
    </form>
  );
}
