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

export function UserMenuMobile({ transparent }: { transparent: boolean }) {
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
    "rounded-xl px-4 py-2.5 text-sm font-medium",
    transparent
      ? "text-neutral-600 hover:bg-neutral-900/5 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-white/5 dark:hover:text-white"
      : "text-slate-600 hover:bg-slate-50"
  );

  if (!user) {
    return (
      <>
        <Link
          href="/giris"
          className={cn(
            "rounded-xl px-4 py-2.5 text-sm font-semibold",
            transparent
              ? "text-neutral-700 dark:text-neutral-300"
              : "text-slate-600"
          )}
        >
          {t("nav.login")}
        </Link>
        <Link
          href="/kayit"
          className="rounded-lg bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white dark:bg-white/10 dark:hover:bg-white/20"
        >
          {t("nav.register")}
        </Link>
      </>
    );
  }

  return (
    <>
      <div
        className={cn(
          "rounded-xl px-4 py-3",
          transparent ? "bg-neutral-900/5 dark:bg-white/5" : "bg-slate-50"
        )}
      >
        <p
          className={cn(
            "text-sm font-semibold",
            transparent ? "text-neutral-900 dark:text-white" : "text-slate-900"
          )}
        >
          {user.full_name}
        </p>
        <p
          className={cn(
            "text-xs",
            transparent ? "text-neutral-500 dark:text-neutral-400" : "text-slate-500"
          )}
        >
          {t(`roles.${user.role}`)}
        </p>
      </div>
      <Link href={user.dashboardPath} className={linkClass}>
        {t("nav.goToPanel")}
      </Link>
      <Link href="/dashboard/firma" className={linkClass}>
        {t("nav.companyProfile")}
      </Link>
      {user.role !== "admin" && (
        <Link href="/dashboard/mesajlar" className={cn(linkClass, "flex items-center justify-between")}>
          <span className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            {t("nav.messages")}
          </span>
          {totalUnread > 0 && (
            <span className="rounded-full bg-neutral-900/10 px-2 py-0.5 text-[10px] font-bold text-neutral-900 dark:bg-white/20 dark:text-white">
              {totalUnread}
            </span>
          )}
        </Link>
      )}
    </>
  );
}
