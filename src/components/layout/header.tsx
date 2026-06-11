"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/ilanlar", label: "İlanlar" },
  { href: "/nasil-calisir", label: "Nasıl Çalışır" },
  { href: "/haberler", label: "Haberler" },
  { href: "/iletisim", label: "İletişim" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex h-[4.25rem] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo size="md" />

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-3.5 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-primary-800"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/giris"
            className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-600 transition-colors hover:text-primary-800"
          >
            Giriş Yap
          </Link>
          <Link href="/kayit">
            <Button size="sm">Kayıt Ol</Button>
          </Link>
        </div>

        <button
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menü"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <div
        className={cn(
          "border-t border-slate-100 bg-white md:hidden",
          mobileOpen ? "block" : "hidden"
        )}
      >
        <nav className="flex flex-col gap-1 p-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-xl px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <hr className="my-2 border-slate-100" />
          <Link href="/giris" className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600">
            Giriş Yap
          </Link>
          <Link href="/kayit" className="rounded-xl px-4 py-2.5 text-sm font-semibold text-brand-600">
            Kayıt Ol
          </Link>
        </nav>
      </div>
    </header>
  );
}
