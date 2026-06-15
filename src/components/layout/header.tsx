"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { UserMenu } from "@/components/layout/user-menu";
import { UserMenuMobile } from "@/components/layout/user-menu-mobile";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { useI18n } from "@/components/i18n/i18n-provider";
import { cn } from "@/lib/utils";

const HEADER_HEIGHT = "3.5rem";

export function Header() {
  const { t } = useI18n();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
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
    setMounted(true);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (isDashboard || !mobileOpen) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen, isDashboard]);

  const mobileMenu =
    mounted && !isDashboard && mobileOpen
      ? createPortal(
          <>
            <button
              type="button"
              className="fixed inset-0 z-[90] bg-slate-900/30 backdrop-blur-[1px] lg:hidden"
              style={{ top: HEADER_HEIGHT }}
              onClick={() => setMobileOpen(false)}
              aria-label={t("common.closeMenu")}
            />
            <div
              className="fixed inset-x-0 z-[91] max-h-[calc(100dvh-3.5rem)] overflow-y-auto border-t border-neutral-200 bg-white shadow-xl lg:hidden"
              style={{ top: HEADER_HEIGHT }}
            >
              <nav className="flex flex-col gap-1 p-4 pb-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="rounded-lg px-3 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}

                <div className="mt-1 flex items-center justify-between rounded-lg px-3 py-3 hover:bg-slate-50">
                  <span className="text-sm font-medium text-slate-700">
                    {t("language.switchLabel")}
                  </span>
                  <LanguageSwitcher transparent compact />
                </div>

                <hr className="my-2 border-neutral-200" />

                <UserMenuMobile transparent onNavigate={() => setMobileOpen(false)} />
              </nav>
            </div>
          </>,
          document.body
        )
      : null;

  return (
    <>
      <header
        className={cn(
          "fixed top-0 z-50 w-full border-b transition-all duration-300",
          isDashboard
            ? "panel-header-bar border-white/10"
            : "border-transparent bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(248,250,252,0.88))] [border-image:linear-gradient(90deg,transparent,rgba(15,23,42,0.08),transparent)_1]"
        )}
      >
        <div className="pointer-events-none absolute inset-0 backdrop-blur-xl" aria-hidden />
        <div className="relative z-10 mx-auto flex h-14 max-w-7xl items-center justify-between gap-2 px-4 sm:px-6 lg:gap-3 lg:px-8">
          <div className="min-w-0 flex-1 overflow-hidden pr-2 lg:flex-none">
            <Logo
              size="sm"
              variant={isDashboard ? "light" : "dark"}
              className="max-w-full lg:hidden"
            />
            <Logo
              size="md"
              variant={isDashboard ? "light" : "dark"}
              className="hidden max-w-full lg:flex"
            />
          </div>

          <nav className="hidden items-center gap-8 lg:flex">
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

          <div className="hidden items-center gap-3 lg:flex">
            <LanguageSwitcher transparent={isDashboard} onDark={isDashboard} />
            <UserMenu transparent={isDashboard} onDark={isDashboard} />
          </div>

          <div className="flex shrink-0 items-center lg:hidden">
            {isDashboard ? (
              <UserMenu transparent={isDashboard} onDark={isDashboard} />
            ) : (
              <button
                type="button"
                className="inline-flex min-h-10 min-w-10 touch-manipulation items-center gap-1.5 rounded-lg px-2 py-2 text-neutral-700 transition-colors hover:bg-neutral-900/5 sm:gap-2"
                onClick={() => setMobileOpen((open) => !open)}
                aria-label={mobileOpen ? t("common.closeMenu") : t("common.openMenu")}
                aria-expanded={mobileOpen}
              >
                <span className="text-sm font-semibold text-slate-700">{t("common.menu")}</span>
                {mobileOpen ? (
                  <X className="h-5 w-5 shrink-0" />
                ) : (
                  <Menu className="h-5 w-5 shrink-0" />
                )}
              </button>
            )}
          </div>
        </div>
      </header>
      {mobileMenu}
    </>
  );
}
