"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageCircle } from "lucide-react";
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

  if (!user) {
    return (
      <>
        <Link
          href="/giris"
          className={`rounded-xl px-4 py-2.5 text-sm font-semibold ${
            transparent ? "text-slate-300" : "text-slate-600"
          }`}
        >
          {t("nav.login")}
        </Link>
        <Link href="/kayit" className="rounded-lg px-4 py-2.5 text-sm font-medium text-white">
          {t("nav.register")}
        </Link>
      </>
    );
  }

  return (
    <>
      <div
        className={`rounded-xl px-4 py-3 ${
          transparent ? "bg-white/5" : "bg-slate-50"
        }`}
      >
        <p className={`text-sm font-semibold ${transparent ? "text-white" : "text-slate-900"}`}>
          {user.full_name}
        </p>
        <p className={`text-xs ${transparent ? "text-slate-400" : "text-slate-500"}`}>
          {t(`roles.${user.role}`)}
        </p>
      </div>
      <Link
        href={user.dashboardPath}
        className={`rounded-xl px-4 py-2.5 text-sm font-medium ${
          transparent ? "text-slate-300 hover:bg-white/5" : "text-slate-600 hover:bg-slate-50"
        }`}
      >
        {t("nav.goToPanel")}
      </Link>
      <Link
        href="/dashboard/firma"
        className={`rounded-xl px-4 py-2.5 text-sm font-medium ${
          transparent ? "text-slate-300 hover:bg-white/5" : "text-slate-600 hover:bg-slate-50"
        }`}
      >
        {t("nav.companyProfile")}
      </Link>
      {user.role !== "admin" && (
        <Link
          href="/dashboard/mesajlar"
          className={`flex items-center justify-between rounded-xl px-4 py-2.5 text-sm font-medium ${
            transparent ? "text-slate-300 hover:bg-white/5" : "text-slate-600 hover:bg-slate-50"
          }`}
        >
          <span className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            {t("nav.messages")}
          </span>
          {totalUnread > 0 && (
            <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-bold text-white">
              {totalUnread}
            </span>
          )}
        </Link>
      )}
    </>
  );
}
