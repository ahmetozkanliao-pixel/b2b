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
    <div className="auth-card">
      <h1 className="text-2xl font-semibold text-white">Kayıt Ol</h1>
      <p className="mt-2 text-sm text-neutral-400">
        Platforma katılarak üretim süreçlerinizi yönetin
      </p>
      <RegisterForm searchParams={searchParams} />
    </div>
  );
}
