"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { Building2, Factory, Shield } from "lucide-react";
import { useI18n } from "@/components/i18n/i18n-provider";

const DEMO_ACCOUNTS = {
  demand: { email: "demo@talep.com", password: "Talep2026!" },
  producer: { email: "demo@uretici.com", password: "Uretici2026!" },
  admin: { email: "demo@admin.com", password: "Admin2026!" },
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
  }, [searchParams]);

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
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <div className="gradient-box rounded-lg p-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-white">
            <Building2 className="h-4 w-4 text-neutral-400" />
            {t("auth.demoDemand")}
          </div>
          <p className="text-xs leading-relaxed text-neutral-400">
            <strong className="text-neutral-200">{DEMO_ACCOUNTS.demand.email}</strong>
            <br />
            {t("auth.password")}: <strong className="text-neutral-200">{DEMO_ACCOUNTS.demand.password}</strong>
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-3 w-full"
            onClick={() => loginWithDemo(DEMO_ACCOUNTS.demand)}
            disabled={loading}
          >
            {t("auth.demoLoginDemand")}
          </Button>
        </div>

        <div className="gradient-box rounded-lg p-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-white">
            <Factory className="h-4 w-4 text-neutral-400" />
            {t("auth.demoProducerCompany")}
          </div>
          <p className="text-xs leading-relaxed text-neutral-400">
            <strong className="text-neutral-200">{DEMO_ACCOUNTS.producer.email}</strong>
            <br />
            {t("auth.password")}: <strong className="text-neutral-200">{DEMO_ACCOUNTS.producer.password}</strong>
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-3 w-full"
            onClick={() => loginWithDemo(DEMO_ACCOUNTS.producer)}
            disabled={loading}
          >
            {t("auth.demoLoginProducer")}
          </Button>
        </div>

        <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4 sm:col-span-2 lg:col-span-1">
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-white">
            <Shield className="h-4 w-4 text-neutral-400" />
            {t("auth.demoAdmin")}
          </div>
          <p className="text-xs leading-relaxed text-neutral-400">
            <strong className="text-neutral-200">{DEMO_ACCOUNTS.admin.email}</strong>
            <br />
            {t("auth.password")}: <strong className="text-neutral-200">{DEMO_ACCOUNTS.admin.password}</strong>
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-3 w-full"
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
        placeholder="demo@talep.com veya demo@uretici.com"
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

      {info && (
        <p className="rounded-lg border border-white/10 bg-white/5 p-3 text-sm text-neutral-300">{info}</p>
      )}

      {error && (
        <p className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300">{error}</p>
      )}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? t("auth.signingIn") : t("auth.loginButton")}
      </Button>

      <p className="text-center text-sm text-neutral-500">
        {t("auth.noAccount")}{" "}
        <Link href="/kayit" className="font-medium text-white hover:text-neutral-300">
          {t("auth.registerLink")}
        </Link>
      </p>
    </form>
  );
}
