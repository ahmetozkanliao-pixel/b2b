"use client";

import { useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Building2, Factory } from "lucide-react";

type UserType = "demand_owner" | "producer";

export function RegisterForm({
  searchParams,
}: {
  searchParams: Promise<{ tip?: string }>;
}) {
  const params = use(searchParams);
  const router = useRouter();
  const initialType = params.tip === "uretici" ? "producer" : "demand_owner";

  const [userType, setUserType] = useState<UserType>(initialType);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: userType,
        },
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      await supabase.from("companies").insert({
        owner_id: data.user.id,
        name: companyName,
        type: userType,
        email,
      });
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => setUserType("demand_owner")}
          className={cn(
            "flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all",
            userType === "demand_owner"
              ? "border-primary-500 bg-primary-50 shadow-soft"
              : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
          )}
        >
          <Building2 className={cn("h-6 w-6", userType === "demand_owner" ? "text-primary-600" : "text-slate-400")} />
          <span className="text-sm font-semibold text-slate-800">Talep Sahibi</span>
        </button>
        <button
          type="button"
          onClick={() => setUserType("producer")}
          className={cn(
            "flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all",
            userType === "producer"
              ? "border-brand-500 bg-brand-50 shadow-soft"
              : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
          )}
        >
          <Factory className={cn("h-6 w-6", userType === "producer" ? "text-brand-600" : "text-slate-400")} />
          <span className="text-sm font-semibold text-slate-800">Üretici Firma</span>
        </button>
      </div>

      <Input
        id="fullName"
        label="Ad Soyad"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        placeholder="Adınız Soyadınız"
        required
      />
      <Input
        id="companyName"
        label="Firma Adı"
        value={companyName}
        onChange={(e) => setCompanyName(e.target.value)}
        placeholder="Firma adınız"
        required
      />
      <Input
        id="email"
        label="E-posta"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="ornek@sirket.com"
        required
      />
      <Input
        id="password"
        label="Şifre"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="En az 6 karakter"
        minLength={6}
        required
      />

      {error && (
        <p className="rounded-xl bg-red-50 p-3 text-sm text-red-600">{error}</p>
      )}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Kayıt yapılıyor..." : "Kayıt Ol"}
      </Button>

      <p className="text-center text-sm text-slate-500">
        Zaten hesabınız var mı?{" "}
        <Link href="/giris" className="font-semibold text-brand-600 hover:text-brand-700">
          Giriş yapın
        </Link>
      </p>
    </form>
  );
}
