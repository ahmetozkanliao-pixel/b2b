"use client";

import { useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CategorySelect } from "@/components/ui/category-select";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { useI18n } from "@/components/i18n/i18n-provider";
import { validateRegistrationPayload } from "@/lib/auth/registration";
import { Building2, Factory, Mail } from "lucide-react";
import type { Category } from "@/types";

type UserType = "demand_owner" | "producer";

export function RegisterForm({
  searchParams,
  categories,
}: {
  searchParams: Promise<{ tip?: string }>;
  categories: Category[];
}) {
  const params = use(searchParams);
  const router = useRouter();
  const { t } = useI18n();
  const initialType = params.tip === "uretici" ? "producer" : "demand_owner";

  const [userType, setUserType] = useState<UserType>(initialType);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [address, setAddress] = useState("");
  const [country, setCountry] = useState("Türkiye");
  const [city, setCity] = useState("");
  const [taxNumber, setTaxNumber] = useState("");
  const [categoryIds, setCategoryIds] = useState<string[]>([]);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedKvkk, setAcceptedKvkk] = useState(false);
  const [acceptedEmailNotifications, setAcceptedEmailNotifications] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<{
    message: string;
    devVerifyUrl?: string;
  } | null>(null);

  function buildPayload() {
    const tax_number = taxNumber.replace(/\s/g, "");
    return {
      email,
      password,
      full_name: companyName.trim(),
      role: userType,
      company_name: companyName,
      phone,
      website,
      address,
      country,
      city,
      tax_number,
      national_id: tax_number,
      category_ids: userType === "producer" ? categoryIds : [],
      accepted_terms: acceptedTerms,
    accepted_kvkk: acceptedKvkk,
    accepted_email_notifications: acceptedEmailNotifications,
  };
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    setSuccess(null);

    const payload = buildPayload();
    const validationError = validateRegistrationPayload(payload);
    if (validationError) {
      setError(validationError);
      setLoading(false);
      return;
    }

    const demoRes = await fetch("/api/demo/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
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
      setError(demoData.error || t("auth.registerFailed"));
      setLoading(false);
      return;
    }

    const supabase = createClient();
    const origin = window.location.origin;
    const { data, error: authError } = await supabase.auth.signUp({
      email: payload.email,
      password: payload.password,
      options: {
        emailRedirectTo: `${origin}/auth/callback`,
        data: {
          full_name: payload.full_name,
          role: payload.role,
          company_name: payload.company_name,
          phone: payload.phone,
          website: payload.website,
          address: payload.address,
          country: payload.country,
          city: payload.city,
          tax_number: payload.tax_number,
          national_id: payload.national_id,
          category_ids: payload.category_ids,
          accepted_terms: payload.accepted_terms,
          accepted_kvkk: payload.accepted_kvkk,
          accepted_email_notifications: payload.accepted_email_notifications,
        },
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    if (data.user && data.session) {
      await supabase
        .from("profiles")
        .update({
          phone: payload.phone,
          national_id: payload.national_id,
        })
        .eq("id", data.user.id);

      await supabase.from("companies").insert({
        owner_id: data.user.id,
        name: payload.company_name,
        type: payload.role,
        email: payload.email,
        phone: payload.phone,
        website: payload.website,
        address: payload.address,
        country: payload.country,
        city: payload.city,
        tax_number: payload.tax_number,
        category_ids: payload.category_ids,
      });
      router.push("/dashboard");
      router.refresh();
      return;
    }

    setSuccess({
      message: t("auth.verifyEmailMessage"),
    });
    setLoading(false);
  }

  if (success) {
    return (
      <div className="mt-6 rounded-xl border border-primary-100 bg-slate-50 p-6 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-brand-200 bg-brand-50">
          <Mail className="h-6 w-6 text-brand-600" />
        </div>
        <h2 className="text-lg font-medium text-slate-900">{t("auth.verifyEmailTitle")}</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">{success.message}</p>
        {success.devVerifyUrl && (
          <p className="mt-4 rounded-lg border border-primary-100 bg-white p-3 text-left text-xs text-slate-600">
            Demo modunda e-posta servisi yapılandırılmadı. Doğrulama bağlantısı:
            <Link
              href={success.devVerifyUrl}
              className="mt-2 block break-all font-medium text-brand-600 hover:text-brand-700"
            >
              {success.devVerifyUrl}
            </Link>
          </p>
        )}
        <Link
          href="/giris"
          className="mt-6 inline-flex text-sm font-medium text-brand-600 hover:text-brand-700"
        >
          {t("auth.backToLogin")}
        </Link>
      </div>
    );
  }

  const canSubmit =
    (userType === "producer" ? categoryIds.length > 0 : true) &&
    acceptedTerms &&
    acceptedKvkk &&
    acceptedEmailNotifications;

  const checkboxClass =
    "mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 text-brand-600 focus:ring-brand-500";

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-5">
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => {
            setUserType("demand_owner");
            setCategoryIds([]);
          }}
          className={cn(
            "flex flex-col items-center gap-2 rounded-lg border p-4 text-center transition-all",
            userType === "demand_owner"
              ? "border-brand-400 bg-brand-50 ring-1 ring-brand-200"
              : "border-primary-100 bg-white hover:border-primary-200"
          )}
        >
          <Building2 className={cn("h-6 w-6", userType === "demand_owner" ? "text-brand-600" : "text-slate-400")} />
          <span className={cn("text-sm font-medium", userType === "demand_owner" ? "text-slate-900" : "text-slate-600")}>
            {t("auth.roleDemand")}
          </span>
          <span className="text-xs leading-snug text-slate-500">{t("auth.roleDemandDesc")}</span>
        </button>
        <button
          type="button"
          onClick={() => setUserType("producer")}
          className={cn(
            "flex flex-col items-center gap-2 rounded-lg border p-4 text-center transition-all",
            userType === "producer"
              ? "border-brand-400 bg-brand-50 ring-1 ring-brand-200"
              : "border-primary-100 bg-white hover:border-primary-200"
          )}
        >
          <Factory className={cn("h-6 w-6", userType === "producer" ? "text-brand-600" : "text-slate-400")} />
          <span className={cn("text-sm font-medium", userType === "producer" ? "text-slate-900" : "text-slate-600")}>
            {t("auth.roleProducer")}
          </span>
          <span className="text-xs leading-snug text-slate-500">{t("auth.roleProducerDesc")}</span>
        </button>
      </div>

      <div className="space-y-4 rounded-xl border border-primary-100 bg-slate-50/60 p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          {t("auth.personalInfo")}
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            id="email"
            label={`${t("auth.email")} *`}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ornek@sirket.com"
            required
          />
          <Input
            id="password"
            label={`${t("auth.passwordField")} *`}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t("auth.passwordMinHint")}
            minLength={6}
            required
          />
        </div>
      </div>

      <div className="space-y-4 rounded-xl border border-primary-100 bg-slate-50/60 p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          {t("auth.companyInfo")}
        </p>
        <Input
          id="companyName"
          label={`${t("auth.companyName")} *`}
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          required
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            id="phone"
            label={`${t("auth.phone")} *`}
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+90 5XX XXX XX XX"
            required
          />
          <Input
            id="website"
            label={`${t("auth.website")} *`}
            type="url"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            placeholder="https://ornek.com"
            required
          />
        </div>
        {userType === "producer" && categories.length > 0 && (
          <CategorySelect
            categories={categories}
            selected={categoryIds}
            onChange={setCategoryIds}
            label={t("auth.categories")}
            hint={t("auth.categoriesHint")}
            placeholder={t("auth.categoryPlaceholder")}
            searchPlaceholder={t("auth.categorySearchPlaceholder")}
            required
          />
        )}
        <Textarea
          id="address"
          label={`${t("auth.address")} *`}
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          rows={2}
          required
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            id="country"
            label={`${t("auth.country")} *`}
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            required
          />
          <Input
            id="city"
            label={`${t("auth.city")} *`}
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          />
        </div>
        <div>
          <Input
            id="taxNumber"
            label={`${t("auth.taxNumber")} *`}
            value={taxNumber}
            onChange={(e) => setTaxNumber(e.target.value.replace(/\D/g, "").slice(0, 11))}
            placeholder="12345678901"
            inputMode="numeric"
            required
          />
          <p className="mt-1 text-xs text-slate-500">{t("auth.taxNumberHint")}</p>
        </div>
      </div>

      <div className="space-y-3 rounded-xl border border-primary-100 bg-slate-50/60 p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          {t("auth.consentTitle")}
        </p>

        <label className="flex items-start gap-3 rounded-lg border border-primary-100 bg-white p-3">
          <input
            type="checkbox"
            checked={acceptedTerms}
            onChange={(e) => setAcceptedTerms(e.target.checked)}
            className={checkboxClass}
            required
          />
          <span className="text-sm leading-relaxed text-slate-600">
            <Link
              href="/kullanim-sartlari"
              target="_blank"
              className="font-medium text-brand-600 hover:text-brand-700"
            >
              {t("auth.consentTermsLink")}
            </Link>{" "}
            {t("auth.consentReadUnderstood")}
          </span>
        </label>

        <label className="flex items-start gap-3 rounded-lg border border-primary-100 bg-white p-3">
          <input
            type="checkbox"
            checked={acceptedKvkk}
            onChange={(e) => setAcceptedKvkk(e.target.checked)}
            className={checkboxClass}
            required
          />
          <span className="text-sm leading-relaxed text-slate-600">
            <Link
              href="/kvkk"
              target="_blank"
              className="font-medium text-brand-600 hover:text-brand-700"
            >
              {t("auth.consentKvkkLink")}
            </Link>{" "}
            {t("auth.consentReadUnderstood")}
          </span>
        </label>

        <label className="flex items-start gap-3 rounded-lg border border-primary-100 bg-white p-3">
          <input
            type="checkbox"
            checked={acceptedEmailNotifications}
            onChange={(e) => setAcceptedEmailNotifications(e.target.checked)}
            className={checkboxClass}
            required
          />
          <span className="text-sm leading-relaxed text-slate-600">
            {t("auth.consentEmailNotifications")}
          </span>
        </label>
      </div>

      {error && (
        <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>
      )}

      <Button type="submit" className="w-full" disabled={loading || !canSubmit}>
        {loading ? t("auth.creating") : t("auth.registerButton")}
      </Button>

      <p className="text-center text-sm text-slate-600">
        {t("auth.hasAccount")}{" "}
        <Link href="/giris" className="font-medium text-brand-600 hover:text-brand-700">
          {t("auth.loginButton")}
        </Link>
      </p>
    </form>
  );
}
