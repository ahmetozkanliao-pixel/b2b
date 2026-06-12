"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import {
  getPanelNavLinks,
  isPanelNavLinkActive,
} from "@/lib/panel-nav-links";
import { useI18n } from "@/components/i18n/i18n-provider";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import type { UserRole } from "@/types";

interface PanelMobileMenuProps {
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

export function PanelMobileMenu({
  role,
  userName,
  userEmail,
  companyName,
}: PanelMobileMenuProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const links = getPanelNavLinks(role);

  const activeLink =
    links.find((link) => isPanelNavLinkActive(pathname, link.href)) ?? links[0];
  const activeLabel = t(activeLink.labelKey);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  async function handleLogout() {
    await fetch("/api/demo/logout", { method: "POST" });
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <div className="lg:hidden">
      <div className="sticky top-14 z-40 flex items-center justify-between border-b border-white/10 bg-black px-4 py-3">
        <div className="min-w-0">
          <p className="font-mono text-[10px] uppercase tracking-wider text-neutral-500">
            {t("common.panel")}
          </p>
          <p className="truncate text-sm font-medium text-white">
            {activeLabel}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm font-medium text-neutral-300 transition-colors hover:bg-white/10"
          aria-label={t("common.openPanelMenu")}
        >
          <Menu className="h-4 w-4" />
          {t("common.menu")}
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
            onClick={() => setOpen(false)}
            aria-label={t("common.closeMenu")}
          />
          <div className="absolute inset-y-0 left-0 flex w-[min(20rem,88vw)] flex-col border-r border-white/10 bg-black shadow-2xl">
            <div className="flex h-14 items-center justify-between border-b border-white/10 px-4">
              <span className="font-medium text-white">{t("common.panelMenu")}</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg p-2 text-neutral-400 hover:bg-white/5"
                aria-label={t("common.closeMenu")}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {userName && (
              <Link
                href={role === "admin" ? "/admin" : "/dashboard/firma"}
                onClick={() => setOpen(false)}
                className="mx-4 mt-4 flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.03] p-3 transition-colors hover:border-white/20"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-white/15 bg-white text-sm font-semibold text-black">
                  {getInitials(userName)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-white">
                    {userName}
                  </p>
                  {companyName ? (
                    <p className="truncate text-xs text-neutral-500">{companyName}</p>
                  ) : (
                    <p className="truncate text-xs text-neutral-500">{userEmail}</p>
                  )}
                </div>
              </Link>
            )}

            <div className="px-4 pt-2">
              <LanguageSwitcher transparent />
            </div>

            <nav className="flex-1 space-y-1 overflow-y-auto p-4">
              {links.map((link) => {
                const isActive = isPanelNavLinkActive(pathname, link.href);

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                      isActive
                        ? "bg-white/10 text-white"
                        : "text-neutral-400 hover:bg-white/5 hover:text-white"
                    )}
                  >
                    <link.icon className="h-4 w-4 shrink-0" />
                    {t(link.labelKey)}
                  </Link>
                );
              })}
            </nav>

            <div className="border-t border-white/10 p-4">
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-neutral-400 transition-colors hover:bg-white/5 hover:text-white"
              >
                <LogOut className="h-5 w-5" />
                {t("common.logout")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
