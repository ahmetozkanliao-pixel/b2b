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
          ? "border-transparent bg-[linear-gradient(180deg,rgba(12,12,18,0.92),rgba(8,8,12,0.88))] [border-image:linear-gradient(90deg,transparent,rgba(255,255,255,0.08),transparent)_1]"
          : "border-transparent bg-[linear-gradient(180deg,rgba(10,10,16,0.85),rgba(6,6,10,0.75))] [border-image:linear-gradient(90deg,transparent,rgba(255,255,255,0.06),transparent)_1]"
      )}
    >
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo size="md" variant="light" />

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-neutral-400 transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <LanguageSwitcher transparent />
          <UserMenu transparent />
        </div>

        {!isDashboard && (
          <button
            className="rounded-lg p-2 text-neutral-300 hover:bg-white/5 md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={t("common.openMenu")}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        )}
      </div>

      <div
        className={cn(
          "border-t border-white/10 bg-black md:hidden",
          !isDashboard && mobileOpen ? "block" : "hidden"
        )}
      >
        <nav className="flex flex-col gap-1 p-4">
          <div className="mb-2 px-2">
            <LanguageSwitcher transparent />
          </div>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2.5 text-sm text-neutral-300 hover:bg-white/5 hover:text-white"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <hr className="my-2 border-white/10" />
          <UserMenuMobile transparent />
        </nav>
      </div>
    </header>
  );
}
