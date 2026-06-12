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
  const links = getPanelNavLinks(role);

  async function handleLogout() {
    await fetch("/api/demo/logout", { method: "POST" });
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <aside className="sticky top-[4.25rem] hidden h-[calc(100vh-4.25rem)] w-64 shrink-0 flex-col border-r border-slate-200/80 bg-white lg:flex">
      <div className="flex h-[4.25rem] items-center border-b border-slate-200/80 px-5">
        <Logo size="sm" showText={false} />
        <span className="ml-2 font-semibold text-slate-900">Panel</span>
      </div>

      {userName && (
        <Link
          href={role === "admin" ? "/admin" : "/dashboard/firma"}
          className="mx-4 mt-4 flex items-center gap-3 rounded-xl border border-slate-200/80 bg-slate-50/80 p-3 transition-colors hover:border-brand-200 hover:bg-brand-50/50"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full gradient-brand text-sm font-bold text-white">
            {getInitials(userName)}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-slate-900">{userName}</p>
            {companyName ? (
              <p className="truncate text-xs text-brand-600">{companyName}</p>
            ) : (
              <p className="truncate text-xs text-slate-500">{userEmail}</p>
            )}
          </div>
        </Link>
      )}

      <nav className="flex-1 space-y-1 p-4">
        {links.map((link) => {
          const isActive = isPanelNavLinkActive(pathname, link.href);

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-brand-50 text-brand-700"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <link.icon className={cn("h-5 w-5", isActive && "text-brand-600")} />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-slate-200/80 p-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
        >
          <LogOut className="h-5 w-5" />
          Çıkış Yap
        </button>
      </div>
    </aside>
  );
}
