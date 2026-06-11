import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Giriş Yap",
};

export default function LoginPage() {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-8 shadow-card">
      <h1 className="text-2xl font-bold text-slate-900">Giriş Yap</h1>
      <p className="mt-2 text-sm text-slate-500">
        Hesabınıza giriş yaparak devam edin
      </p>
      <LoginForm />
    </div>
  );
}
