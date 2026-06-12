"use client";

import { useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { useI18n } from "@/components/i18n/i18n-provider";
import { Building2, Factory, Mail } from "lucide-react";

type UserType = "demand_owner" | "producer";

export function RegisterForm({
  searchParams,
}: {
  searchParams: Promise<{ tip?: string }>;
}) {
  const params = use(searchParams);
  const router = useRouter();
  const { t } = useI18n();
  const initialType = params.tip === "uretici" ? "producer" : "demand_owner";

  const [userType, setUserType] = useState<UserType>(initialType);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<{
    message: string;
    devVerifyUrl?: string;
  } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    setSuccess(null);

    const demoRes = await fetch("/api/demo/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password,
        full_name: fullName,
        company_name: companyName,
        role: userType,
      }),
    });

    const demoData = await demoRes.json();

    if (demoRes.ok) {
      setSuccess({
        message: demoData.message,
        devVerifyUrl: demoData.devVerifyUrl,
      });
      setLoading(false);
      return;
    }

    if (demoRes.status !== 400 || demoData.error !== "Demo modu aktif değil.") {
      setError(demoData.error || "Kayıt başarısız.");
      setLoading(false);
      return;
    }

    const supabase = createClient();
    const origin = window.location.origin;
    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${origin}/auth/callback`,
        data: {
          full_name: fullName,
          role: userType,
          company_name: companyName,
        },
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    if (data.user && data.session) {
      await supabase.from("companies").insert({
        owner_id: data.user.id,
        name: companyName,
        type: userType,
        email,
      });
      router.push("/dashboard");
      router.refresh();
      return;
    }

    setSuccess({
      message:
        "Kayıt başarılı. E-posta adresinize doğrulama bağlantısı gönderildi. Lütfen gelen kutunuzu kontrol edin.",
    });
    setLoading(false);
  }

  if (success) {
    return (
      <div className="gradient-box mt-6 rounded-xl p-6 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5">
          <Mail className="h-6 w-6 text-neutral-300" />
        </div>
        <h2 className="text-lg font-medium text-white">E-postanızı doğrulayın</h2>
        <p className="mt-2 text-sm leading-relaxed text-neutral-400">{success.message}</p>
        {success.devVerifyUrl && (
          <p className="mt-4 rounded-lg border border-white/10 bg-white/[0.02] p-3 text-left text-xs text-neutral-500">
            Demo modunda e-posta servisi yapılandırılmadı. Doğrulama bağlantısı:
            <Link
              href={success.devVerifyUrl}
              className="mt-2 block break-all font-medium text-white hover:text-neutral-300"
            >
              {success.devVerifyUrl}
            </Link>
          </p>
        )}
        <Link
          href="/giris"
          className="mt-6 inline-flex text-sm font-medium text-white hover:text-neutral-300"
        >
          Giriş sayfasına dön
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => setUserType("demand_owner")}
          className={cn(
            "flex flex-col items-center gap-2 rounded-lg p-4 transition-all",
            userType === "demand_owner"
              ? "gradient-box [background:linear-gradient(165deg,rgba(255,255,255,0.1),rgba(255,255,255,0.03))_padding-box,linear-gradient(135deg,rgba(255,255,255,0.35),rgba(255,255,255,0.08),rgba(255,255,255,0.25))_border-box]"
              : "gradient-box gradient-box-hover"
          )}
        >
          <Building2 className={cn("h-6 w-6", userType === "demand_owner" ? "text-white" : "text-neutral-500")} />
          <span className="text-sm font-medium text-neutral-200">{t("auth.roleDemand")}</span>
        </button>
        <button
          type="button"
          onClick={() => setUserType("producer")}
          className={cn(
            "flex flex-col items-center gap-2 rounded-lg p-4 transition-all",
            userType === "producer"
              ? "gradient-box [background:linear-gradient(165deg,rgba(255,255,255,0.1),rgba(255,255,255,0.03))_padding-box,linear-gradient(135deg,rgba(255,255,255,0.35),rgba(255,255,255,0.08),rgba(255,255,255,0.25))_border-box]"
              : "gradient-box gradient-box-hover"
          )}
        >
          <Factory className={cn("h-6 w-6", userType === "producer" ? "text-white" : "text-neutral-500")} />
          <span className="text-sm font-medium text-neutral-200">{t("auth.demoProducerCompany")}</span>
        </button>
      </div>

      <Input
        id="fullName"
        label={t("auth.fullName")}
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        placeholder={t("auth.fullName")}
        required
      />
      <Input
        id="companyName"
        label={t("auth.companyName")}
        value={companyName}
        onChange={(e) => setCompanyName(e.target.value)}
        placeholder={t("auth.companyName")}
        required
      />
      <Input
        id="email"
        label={t("auth.email")}
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="ornek@sirket.com"
        required
      />
      <Input
        id="password"
        label={t("auth.passwordField")}
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="En az 6 karakter"
        minLength={6}
        required
      />

      {error && (
        <p className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300">{error}</p>
      )}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? t("auth.creating") : t("auth.registerButton")}
      </Button>

      <p className="text-center text-sm text-neutral-500">
        {t("auth.hasAccount")}{" "}
        <Link href="/giris" className="font-medium text-white hover:text-neutral-300">
          {t("auth.loginButton")}
        </Link>
      </p>
    </form>
  );
}
