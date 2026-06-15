"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/types";
import { useI18n } from "@/components/i18n/i18n-provider";

interface SessionUser {
  full_name: string;
  role: UserRole;
  dashboardPath: string;
}

interface UserMenuMobileProps {
  transparent?: boolean;
  compact?: boolean;
  onNavigate?: () => void;
}

export function UserMenuMobile({
  transparent,
  compact = false,
  onNavigate,
}: UserMenuMobileProps) {
  const { t } = useI18n();
  const [user, setUser] = useState<SessionUser | null>(null);
  const [totalUnread, setTotalUnread] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    fetch("/api/auth/session", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => setUser(data.user ?? null))
      .catch(() => setUser(null));

    fetch("/api/auth/chat-preview", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => setTotalUnread(data.totalUnread ?? 0))
      .catch(() => setTotalUnread(0));
  }, [pathname]);

  const linkClass = cn(
    "block rounded-xl px-4 py-2.5 text-sm font-medium",
    transparent
      ? "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
      : "text-slate-600 hover:bg-slate-50"
  );

  if (!user) {
    if (compact) {
      return (
        <div className="flex items-center gap-2">
          <Link
            href="/giris"
            className="px-2 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-700 hover:text-brand-600"
          >
            {t("nav.login")}
          </Link>
          <Link
            href="/kayit"
            className="inline-flex h-8 items-center rounded-full gradient-brand px-3 text-[10px] font-semibold uppercase tracking-wider text-white shadow-soft hover:opacity-90"
          >
            {t("nav.register")}
          </Link>
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-2">
        <Link
          href="/giris"
          onClick={onNavigate}
          className={cn(
            linkClass,
            "border border-primary-100 bg-white text-center font-semibold text-slate-800"
          )}
        >
          {t("nav.login")}
        </Link>
        <Link
          href="/kayit"
          onClick={onNavigate}
          className="block rounded-xl gradient-brand px-4 py-2.5 text-center text-sm font-semibold text-white shadow-soft hover:opacity-90"
        >
          {t("nav.register")}
        </Link>
      </div>
    );
  }

  if (compact) {
    return (
      <Link
        href={user.dashboardPath}
        className="inline-flex h-8 items-center rounded-full bg-brand-50 px-3 text-[10px] font-semibold uppercase tracking-wider text-brand-700"
      >
        {t("nav.goToPanel")}
      </Link>
    );
  }

  return (
    <>
      <div className="rounded-xl bg-slate-50 px-4 py-3">
        <p className="text-sm font-semibold text-slate-900">{user.full_name}</p>
        <p className="text-xs text-slate-500">{t(`roles.${user.role}`)}</p>
      </div>
      <Link href={user.dashboardPath} onClick={onNavigate} className={linkClass}>
        {t("nav.goToPanel")}
      </Link>
      <Link href="/dashboard/firma" onClick={onNavigate} className={linkClass}>
        {t("nav.companyProfile")}
      </Link>
      {user.role !== "admin" && (
        <Link
          href="/dashboard/mesajlar"
          onClick={onNavigate}
          className={cn(linkClass, "flex items-center justify-between")}
        >
          <span className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            {t("nav.messages")}
          </span>
          {totalUnread > 0 && (
            <span className="rounded-full bg-brand-100 px-2 py-0.5 text-[10px] font-bold text-brand-700">
              {totalUnread}
            </span>
          )}
        </Link>
      )}
    </>
  );
}
