import { Logo } from "@/components/ui/logo";
import { Shield } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <div className="hidden w-1/2 flex-col justify-between gradient-hero p-12 lg:flex">
        <Logo size="lg" variant="light" href="/" />
        <div>
          <h2 className="text-3xl font-bold leading-tight text-white">
            Türkiye&apos;nin güvenilir B2B üretim ağına katılın
          </h2>
          <p className="mt-4 max-w-md text-lg leading-relaxed text-slate-300">
            Doğrulanmış üreticiler, şeffaf süreçler ve güvenli mesajlaşma ile işinizi büyütün.
          </p>
          <div className="mt-8 flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm">
            <Shield className="h-5 w-5 text-brand-400" />
            <span className="text-sm text-slate-300">256-bit şifreleme · KVKK uyumlu</span>
          </div>
        </div>
        <p className="text-sm text-slate-500">&copy; {new Date().getFullYear()} B2B Üretim Platformu</p>
      </div>

      <div className="flex w-full flex-col items-center justify-center bg-slate-50 px-4 py-12 lg:w-1/2">
        <div className="mb-8 lg:hidden">
          <Logo size="md" href="/" />
        </div>
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
