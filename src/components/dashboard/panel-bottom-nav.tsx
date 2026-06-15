"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutGrid, LogOut, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import {
  getPanelBottomNavLabelKey,
  getPanelBottomNavLinks,
  getPanelMoreNavLinks,
  isPanelNavLinkActive,
} from "@/lib/panel-nav-links";
import { useI18n } from "@/components/i18n/i18n-provider";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import type { UserRole } from "@/types";

interface PanelBottomNavProps {
  role: UserRole;
  userName?: string;
  userEmail?: string;
  companyName?: string;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function PanelBottomNav({
  role,
  userName,
  userEmail,
  companyName,
}: PanelBottomNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useI18n();
  const [moreOpen, setMoreOpen] = useState(false);

  const bottomLinks = getPanelBottomNavLinks(role);
  const moreLinks = getPanelMoreNavLinks(role);
  const moreActive = moreLinks.some((link) => isPanelNavLinkActive(pathname, link.href));

  useEffect(() => {
    setMoreOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = moreOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [moreOpen]);

  async function handleLogout() {
    await fetch("/api/demo/logout", { method: "POST" });
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <>
      <nav
        className="panel-bottom-nav fixed bottom-0 left-0 right-0 z-40 border-t pb-[env(safe-area-inset-bottom)]"
        aria-label={t("common.panelMenu")}
      >
        <div className="mx-auto flex h-[3.25rem] w-full max-w-6xl items-stretch justify-around px-0 sm:h-[3.75rem] sm:px-1">
          {bottomLinks.map((link) => {
            const isActive = isPanelNavLinkActive(pathname, link.href);
            const Icon = link.icon;
            const label = t(getPanelBottomNavLabelKey(link.labelKey));

            return (
              <Link
                key={link.href}
                href={link.href}
                aria-label={label}
                title={label}
                className={cn(
                  "flex min-w-0 flex-1 flex-col items-center justify-center gap-0 px-0 py-1 transition-colors sm:gap-0.5 sm:px-0.5 sm:py-1.5",
                  isActive ? "text-brand-300" : "text-slate-500 hover:text-slate-300"
                )}
              >
                <span
                  className={cn(
                    "flex h-6 w-6 items-center justify-center rounded-lg transition-colors sm:h-8 sm:w-8 sm:rounded-xl",
                    isActive && "bg-brand-500/20 ring-1 ring-brand-400/30"
                  )}
                >
                  <Icon className={cn("h-4 w-4 sm:h-5 sm:w-5", isActive && "stroke-[2.25]")} />
                </span>
                <span
                  className={cn(
                    "hidden max-w-full truncate text-[10px] font-medium leading-tight sm:block",
                    isActive && "text-brand-200"
                  )}
                >
                  {label}
                </span>
              </Link>
            );
          })}

          <button
            type="button"
            onClick={() => setMoreOpen(true)}
            className={cn(
              "flex min-w-0 flex-1 flex-col items-center justify-center gap-0 px-0 py-1 transition-colors sm:gap-0.5 sm:px-0.5 sm:py-1.5",
              moreActive || moreOpen
                ? "text-brand-300"
                : "text-slate-500 hover:text-slate-300"
            )}
            aria-label={t("common.more")}
            title={t("common.more")}
            aria-expanded={moreOpen}
          >
            <span
              className={cn(
                "flex h-6 w-6 items-center justify-center rounded-lg transition-colors sm:h-8 sm:w-8 sm:rounded-xl",
                (moreActive || moreOpen) && "bg-brand-500/20 ring-1 ring-brand-400/30"
              )}
            >
              <LayoutGrid className={cn("h-4 w-4 sm:h-5 sm:w-5", (moreActive || moreOpen) && "stroke-[2.25]")} />
            </span>
            <span
              className={cn(
                "hidden max-w-full truncate text-[10px] font-medium leading-tight sm:block",
                (moreActive || moreOpen) && "text-brand-200"
              )}
            >
              {t("common.more")}
            </span>
          </button>
        </div>
      </nav>

      {moreOpen && (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            className="absolute inset-0 bg-primary-950/60 backdrop-blur-[2px]"
            onClick={() => setMoreOpen(false)}
            aria-label={t("common.closeMenu")}
          />
          <div className="panel-bottom-sheet absolute inset-x-0 bottom-0 flex max-h-[min(85vh,32rem)] flex-col rounded-t-2xl border-t shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <span className="font-medium text-white">{t("common.panelMenu")}</span>
              <button
                type="button"
                onClick={() => setMoreOpen(false)}
                className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
                aria-label={t("common.closeMenu")}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {userName && (
              <Link
                href={role === "admin" ? "/admin" : "/dashboard/firma"}
                onClick={() => setMoreOpen(false)}
                className="mx-4 mt-4 flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3 transition-colors hover:border-brand-400/30 hover:bg-brand-500/10"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg gradient-brand text-sm font-semibold text-white shadow-soft">
                  {getInitials(userName)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-white">{userName}</p>
                  {companyName ? (
                    <p className="truncate text-xs text-slate-400">{companyName}</p>
                  ) : (
                    <p className="truncate text-xs text-slate-400">{userEmail}</p>
                  )}
                </div>
              </Link>
            )}

            <div className="px-4 pt-3">
              <LanguageSwitcher transparent onDark />
            </div>

            <nav className="flex-1 space-y-1 overflow-y-auto p-4">
              {moreLinks.map((link) => {
                const isActive = isPanelNavLinkActive(pathname, link.href);
                const Icon = link.icon;

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMoreOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition-colors",
                      isActive
                        ? "bg-brand-500/20 text-brand-100 ring-1 ring-brand-400/25"
                        : "text-slate-300 hover:bg-white/5 hover:text-white"
                    )}
                  >
                    <Icon className="h-5 w-5 shrink-0" />
                    {t(link.labelKey)}
                  </Link>
                );
              })}
            </nav>

            <div className="border-t border-white/10 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
              >
                <LogOut className="h-5 w-5" />
                {t("common.logout")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
