"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { UserMenu } from "@/components/layout/user-menu";
import { UserMenuMobile } from "@/components/layout/user-menu-mobile";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { useI18n } from "@/components/i18n/i18n-provider";
import { cn } from "@/lib/utils";

export function Header() {
  const { t } = useI18n();
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const isDashboard =
    pathname.startsWith("/dashboard") || pathname.startsWith("/admin");

  const navLinks = [
    { href: "/ilanlar", label: t("nav.listings") },
    { href: "/nasil-calisir", label: t("nav.howItWorks") },
    { href: "/haberler", label: t("nav.news") },
    { href: "/iletisim", label: t("nav.contact") },
  ];

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full border-b backdrop-blur-xl transition-all duration-300",
        isDashboard
          ? "panel-header-bar border-white/10"
          : "border-transparent bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(248,250,252,0.88))] [border-image:linear-gradient(90deg,transparent,rgba(15,23,42,0.08),transparent)_1]"
      )}
    >
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo size="md" variant={isDashboard ? "light" : "dark"} />

        <nav className="hidden items-center gap-8 md:flex">
          {!isDashboard &&
            navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-slate-600 transition-colors hover:text-brand-600"
              >
                {link.label}
              </Link>
            ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <LanguageSwitcher transparent={isDashboard} onDark={isDashboard} />
          <UserMenu transparent={isDashboard} onDark={isDashboard} />
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <LanguageSwitcher transparent={isDashboard} onDark={isDashboard} />
          {isDashboard ? (
            <UserMenu transparent={isDashboard} onDark={isDashboard} />
          ) : (
            <>
              <UserMenuMobile transparent compact />
              <button
                className="rounded-lg p-2 text-neutral-600 hover:bg-neutral-900/5"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label={t("common.openMenu")}
              >
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </>
          )}
        </div>
      </div>

      <div
        className={cn(
          "relative z-[60] border-t border-neutral-200 bg-white shadow-lg md:hidden",
          !isDashboard && mobileOpen ? "block" : "hidden"
        )}
      >
        <nav className="flex flex-col gap-1 p-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <hr className="my-2 border-neutral-200" />
          <UserMenuMobile transparent onNavigate={() => setMobileOpen(false)} />
        </nav>
      </div>
    </header>
  );
}
