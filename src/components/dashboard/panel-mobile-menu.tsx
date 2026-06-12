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
  const [open, setOpen] = useState(false);
  const links = getPanelNavLinks(role);

  const activeLink =
    links.find((link) => isPanelNavLinkActive(pathname, link.href)) ?? links[0];

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
      <div className="sticky top-[4.25rem] z-40 flex items-center justify-between border-b border-slate-200/80 bg-white px-4 py-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Panel
          </p>
          <p className="truncate text-sm font-semibold text-slate-900">
            {activeLink.label}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100"
          aria-label="Panel menüsünü aç"
        >
          <Menu className="h-4 w-4" />
          Menü
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]"
            onClick={() => setOpen(false)}
            aria-label="Menüyü kapat"
          />
          <div className="absolute inset-y-0 left-0 flex w-[min(20rem,88vw)] flex-col bg-white shadow-2xl">
            <div className="flex h-[4.25rem] items-center justify-between border-b border-slate-200/80 px-4">
              <span className="font-semibold text-slate-900">Panel Menüsü</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                aria-label="Menüyü kapat"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {userName && (
              <Link
                href={role === "admin" ? "/admin" : "/dashboard/firma"}
                onClick={() => setOpen(false)}
                className="mx-4 mt-4 flex items-center gap-3 rounded-xl border border-slate-200/80 bg-slate-50/80 p-3 transition-colors hover:border-brand-200 hover:bg-brand-50/50"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full gradient-brand text-sm font-bold text-white">
                  {getInitials(userName)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-900">
                    {userName}
                  </p>
                  {companyName ? (
                    <p className="truncate text-xs text-brand-600">{companyName}</p>
                  ) : (
                    <p className="truncate text-xs text-slate-500">{userEmail}</p>
                  )}
                </div>
              </Link>
            )}

            <nav className="flex-1 space-y-1 overflow-y-auto p-4">
              {links.map((link) => {
                const isActive = isPanelNavLinkActive(pathname, link.href);

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-brand-50 text-brand-700"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    )}
                  >
                    <link.icon
                      className={cn("h-5 w-5", isActive && "text-brand-600")}
                    />
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            <div className="border-t border-slate-200/80 p-4">
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
              >
                <LogOut className="h-5 w-5" />
                Çıkış Yap
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
