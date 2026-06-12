"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageCircle } from "lucide-react";
import type { UserRole } from "@/types";

interface SessionUser {
  full_name: string;
  role: UserRole;
  dashboardPath: string;
}

const roleLabels: Record<UserRole, string> = {
  demand_owner: "Talep Sahibi",
  producer: "Üretici",
  admin: "Admin",
};

export function UserMenuMobile({ transparent }: { transparent: boolean }) {
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
          Giriş Yap
        </Link>
        <Link href="/kayit" className="rounded-xl px-4 py-2.5 text-sm font-semibold text-brand-400">
          Kayıt Ol
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
          {roleLabels[user.role]}
        </p>
      </div>
      <Link
        href={user.dashboardPath}
        className={`rounded-xl px-4 py-2.5 text-sm font-medium ${
          transparent ? "text-slate-300 hover:bg-white/5" : "text-slate-600 hover:bg-slate-50"
        }`}
      >
        Panele Git
      </Link>
      <Link
        href="/dashboard/firma"
        className={`rounded-xl px-4 py-2.5 text-sm font-medium ${
          transparent ? "text-slate-300 hover:bg-white/5" : "text-slate-600 hover:bg-slate-50"
        }`}
      >
        Firma Profili
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
            Mesajlar
          </span>
          {totalUnread > 0 && (
            <span className="rounded-full bg-brand-500 px-2 py-0.5 text-[10px] font-bold text-white">
              {totalUnread}
            </span>
          )}
        </Link>
      )}
    </>
  );
}
