"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/ui/logo";
import {
  getPanelNavLinks,
  isPanelNavLinkActive,
} from "@/lib/panel-nav-links";
import { useI18n } from "@/components/i18n/i18n-provider";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import type { UserRole } from "@/types";

interface SidebarProps {
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

export function Sidebar({ role, userName, userEmail, companyName }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useI18n();
  const links = getPanelNavLinks(role);

  async function handleLogout() {
    await fetch("/api/demo/logout", { method: "POST" });
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-60 shrink-0 flex-col border-r border-white/10 bg-black lg:flex">
      <div className="flex h-14 items-center border-b border-white/10 px-4">
        <Logo size="sm" showText={false} />
        <span className="ml-2 text-sm font-medium text-neutral-300">{t("common.panel")}</span>
      </div>

      <div className="px-3 pt-3">
        <LanguageSwitcher transparent />
      </div>

      {userName && (
        <Link
          href={role === "admin" ? "/admin" : "/dashboard/firma"}
          className="mx-3 mt-3 flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.03] p-3 transition-colors hover:border-white/20 hover:bg-white/[0.06]"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-white/15 bg-white text-xs font-semibold text-black">
            {getInitials(userName)}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-white">{userName}</p>
            {companyName ? (
              <p className="truncate text-xs text-neutral-500">{companyName}</p>
            ) : (
              <p className="truncate text-xs text-neutral-500">{userEmail}</p>
            )}
          </div>
        </Link>
      )}

      <nav className="flex-1 space-y-0.5 p-3">
        {links.map((link) => {
          const isActive = isPanelNavLinkActive(pathname, link.href);

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
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

      <div className="border-t border-white/10 p-3">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-neutral-400 transition-colors hover:bg-white/5 hover:text-white"
        >
          <LogOut className="h-4 w-4" />
          {t("common.logout")}
        </button>
      </div>
    </aside>
  );
}
