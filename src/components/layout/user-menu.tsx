"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  ChevronDown,
  LayoutDashboard,
  Building2,
  Settings,
  LogOut,
  User,
  MessageCircle,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/types";

interface SessionUser {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  companyName: string | null;
  companySlug: string | null;
  dashboardPath: string;
}

const roleLabels: Record<UserRole, string> = {
  demand_owner: "Talep Sahibi",
  producer: "Üretici",
  admin: "Admin",
};

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

interface UserMenuProps {
  transparent?: boolean;
}

export function UserMenu({ transparent = false }: UserMenuProps) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [totalUnread, setTotalUnread] = useState(0);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    let cancelled = false;

    async function loadSession() {
      try {
        const res = await fetch("/api/auth/session", { cache: "no-store" });
        if (!res.ok) {
          if (!cancelled) setUser(null);
          return;
        }
        const data = await res.json();
        if (!cancelled) setUser(data.user ?? null);
      } catch {
        if (!cancelled) setUser(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    async function loadChatPreview() {
      try {
        const res = await fetch("/api/auth/chat-preview", { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled) setTotalUnread(data.totalUnread ?? 0);
      } catch {
        if (!cancelled) setTotalUnread(0);
      }
    }

    setLoading(true);
    loadSession();
    loadChatPreview();
    return () => {
      cancelled = true;
    };
  }, [pathname]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleLogout() {
    await fetch("/api/demo/logout", { method: "POST" });
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    setOpen(false);
    router.push("/");
    router.refresh();
  }

  if (loading) {
    return (
      <div
        className={cn(
          "h-9 w-24 animate-pulse rounded-full",
          transparent ? "bg-white/10" : "bg-slate-100"
        )}
      />
    );
  }

  if (!user) {
    return (
      <>
        <Link
          href="/giris"
          className={cn(
            "px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors",
            transparent
              ? "text-white/80 hover:text-white"
              : "text-slate-600 hover:text-primary-800"
          )}
        >
          Giriş
        </Link>
        <Link href="/kayit">
          <span
            className={cn(
              "inline-flex h-9 items-center rounded-full px-4 text-xs font-semibold uppercase tracking-wider transition-colors",
              transparent
                ? "border border-white/30 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20"
                : "gradient-brand text-white shadow-soft hover:opacity-90"
            )}
          >
            Kayıt Ol
          </span>
        </Link>
      </>
    );
  }

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          "flex items-center gap-2 rounded-full py-1.5 pl-1.5 pr-3 transition-colors",
          transparent
            ? "bg-white/10 text-white hover:bg-white/15"
            : "bg-slate-100 text-slate-900 hover:bg-slate-200/80"
        )}
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <span
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold",
            transparent ? "bg-brand-500 text-white" : "gradient-brand text-white"
          )}
        >
          {getInitials(user.full_name) || <User className="h-4 w-4" />}
        </span>
        <span className="hidden max-w-[8rem] truncate text-left sm:block">
          <span className="block text-xs font-semibold leading-tight">{user.full_name}</span>
          <span
            className={cn(
              "block text-[10px] font-medium",
              transparent ? "text-white/60" : "text-slate-500"
            )}
          >
            {roleLabels[user.role]}
          </span>
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 transition-transform",
            open && "rotate-180",
            transparent ? "text-white/70" : "text-slate-500"
          )}
        />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xl shadow-slate-900/10">
          <div className="border-b border-slate-100 bg-slate-50/80 px-4 py-3">
            <p className="truncate text-sm font-semibold text-slate-900">{user.full_name}</p>
            <p className="truncate text-xs text-slate-500">{user.email}</p>
            {user.companyName && (
              <p className="mt-1 truncate text-xs font-medium text-brand-600">{user.companyName}</p>
            )}
          </div>
          <div className="p-2">
            <MenuLink
              href={user.dashboardPath}
              icon={LayoutDashboard}
              label="Panele Git"
              onClick={() => setOpen(false)}
            />
            {user.role !== "admin" && (
              <MenuLink
                href="/dashboard/mesajlar"
                icon={MessageCircle}
                label="Mesajlar"
                badge={totalUnread > 0 ? totalUnread : undefined}
                onClick={() => setOpen(false)}
              />
            )}
            <MenuLink
              href="/dashboard/firma"
              icon={Building2}
              label="Firma Profili"
              onClick={() => setOpen(false)}
            />
            {user.companySlug && (
              <MenuLink
                href={`/firma/${user.companySlug}`}
                icon={User}
                label="Profili Görüntüle"
                onClick={() => setOpen(false)}
              />
            )}
            <MenuLink
              href="/dashboard/ayarlar"
              icon={Settings}
              label="Ayarlar"
              onClick={() => setOpen(false)}
            />
          </div>
          <div className="border-t border-slate-100 p-2">
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
            >
              <LogOut className="h-4 w-4" />
              Çıkış Yap
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function MenuLink({
  href,
  icon: Icon,
  label,
  badge,
  onClick,
}: {
  href: string;
  icon: typeof LayoutDashboard;
  label: string;
  badge?: number;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
    >
      <Icon className="h-4 w-4 text-slate-400" />
      <span className="flex-1">{label}</span>
      {badge !== undefined && (
        <span className="rounded-full bg-brand-500 px-2 py-0.5 text-[10px] font-bold text-white">
          {badge}
        </span>
      )}
    </Link>
  );
}
