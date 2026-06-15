import type { Metadata } from "next";
import { RegisterForm } from "@/components/auth/register-form";
import { getAppCategories } from "@/lib/get-categories";

export const metadata: Metadata = {
  title: "Kayıt Ol",
};

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ tip?: string }>;
}) {
  const categories = await getAppCategories();

  return (
    <div className="auth-card w-full max-w-2xl">
      <h1 className="text-2xl font-semibold text-slate-900">Kayıt Ol</h1>
      <p className="mt-2 text-sm text-slate-600">
        Platforma katılarak üretim süreçlerinizi yönetin
      </p>
      <RegisterForm searchParams={searchParams} categories={categories} />
    </div>
  );
}
