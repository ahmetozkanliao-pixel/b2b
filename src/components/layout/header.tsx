"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { UserMenu } from "@/components/layout/user-menu";
import { UserMenuMobile } from "@/components/layout/user-menu-mobile";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/ilanlar", label: "İlanlar" },
  { href: "/nasil-calisir", label: "Nasıl Çalışır" },
  { href: "/haberler", label: "Haberler" },
  { href: "/iletisim", label: "İletişim" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isDashboard =
    pathname.startsWith("/dashboard") || pathname.startsWith("/admin");
  const transparent = isHome && !scrolled && !isDashboard;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-500",
        transparent
          ? "border-b border-transparent bg-transparent"
          : "border-b border-slate-200/80 bg-white/90 shadow-sm shadow-slate-900/5 backdrop-blur-xl"
      )}
    >
      <div className="mx-auto flex h-[4.25rem] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo size="md" variant={transparent ? "light" : "dark"} />

        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors",
                transparent
                  ? "text-white/70 hover:text-white"
                  : "text-slate-500 hover:text-primary-800"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <UserMenu transparent={transparent} />
        </div>

        {!isDashboard && (
          <button
            className={cn(
              "rounded-lg p-2 md:hidden",
              transparent
                ? "text-white hover:bg-white/10"
                : "text-slate-600 hover:bg-slate-100"
            )}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menü"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        )}
      </div>

      <div
        className={cn(
          "border-t md:hidden",
          transparent ? "border-white/10 bg-primary-950/95" : "border-slate-100 bg-white",
          !isDashboard && mobileOpen ? "block" : "hidden"
        )}
      >
        <nav className="flex flex-col gap-1 p-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-xl px-4 py-2.5 text-sm font-medium",
                transparent
                  ? "text-slate-300 hover:bg-white/5"
                  : "text-slate-600 hover:bg-slate-50"
              )}
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <hr className={cn("my-2", transparent ? "border-white/10" : "border-slate-100")} />
          <UserMenuMobile transparent={transparent} />
        </nav>
      </div>
    </header>
  );
}
