"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { Building2, Factory, Shield } from "lucide-react";

const DEMO_ACCOUNTS = {
  demand: { email: "demo@talep.com", password: "Talep2026!" },
  producer: { email: "demo@uretici.com", password: "Uretici2026!" },
  admin: { email: "demo@admin.com", password: "Admin2026!" },
};

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
      setError(data.error || "Giriş başarısız.");
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
      return;
    }

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError("E-posta veya şifre hatalı.");
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border border-primary-200 bg-primary-50/50 p-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-primary-800">
            <Building2 className="h-4 w-4 text-primary-600" />
            Talep Sahibi
          </div>
          <p className="text-xs leading-relaxed text-slate-600">
            <strong className="text-slate-800">{DEMO_ACCOUNTS.demand.email}</strong>
            <br />
            Şifre: <strong className="text-slate-800">{DEMO_ACCOUNTS.demand.password}</strong>
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-3 w-full"
            onClick={() => loginWithDemo(DEMO_ACCOUNTS.demand)}
            disabled={loading}
          >
            Talep Sahibi Giriş
          </Button>
        </div>

        <div className="rounded-xl border border-brand-200 bg-brand-50/50 p-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-brand-800">
            <Factory className="h-4 w-4 text-brand-600" />
            Üretici Firma
          </div>
          <p className="text-xs leading-relaxed text-slate-600">
            <strong className="text-slate-800">{DEMO_ACCOUNTS.producer.email}</strong>
            <br />
            Şifre: <strong className="text-slate-800">{DEMO_ACCOUNTS.producer.password}</strong>
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-3 w-full border-brand-200 hover:border-brand-300 hover:bg-brand-50"
            onClick={() => loginWithDemo(DEMO_ACCOUNTS.producer)}
            disabled={loading}
          >
            Üretici Giriş
          </Button>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 sm:col-span-2 lg:col-span-1">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-800">
            <Shield className="h-4 w-4 text-slate-600" />
            Admin
          </div>
          <p className="text-xs leading-relaxed text-slate-600">
            <strong className="text-slate-800">{DEMO_ACCOUNTS.admin.email}</strong>
            <br />
            Şifre: <strong className="text-slate-800">{DEMO_ACCOUNTS.admin.password}</strong>
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-3 w-full"
            onClick={() => loginWithDemo(DEMO_ACCOUNTS.admin)}
            disabled={loading}
          >
            Admin Giriş
          </Button>
        </div>
      </div>

      <Input
        id="email"
        label="E-posta"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="demo@talep.com veya demo@uretici.com"
        required
      />
      <Input
        id="password"
        label="Şifre"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="••••••••"
        required
      />

      {error && (
        <p className="rounded-xl bg-red-50 p-3 text-sm text-red-600">{error}</p>
      )}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
      </Button>

      <p className="text-center text-sm text-slate-500">
        Hesabınız yok mu?{" "}
        <Link href="/kayit" className="font-semibold text-brand-600 hover:text-brand-700">
          Kayıt olun
        </Link>
      </p>
    </form>
  );
}
