import type { Metadata } from "next";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = {
  title: "Kayıt Ol",
};

export default function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ tip?: string }>;
}) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-8 shadow-card">
      <h1 className="text-2xl font-bold text-slate-900">Kayıt Ol</h1>
      <p className="mt-2 text-sm text-slate-500">
        Platforma katılarak üretim süreçlerinizi yönetin
      </p>
      <RegisterForm searchParams={searchParams} />
    </div>
  );
}
