"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Send,
  MessageCircle,
  Bell,
  Building2,
  Settings,
  LogOut,
  Users,
  Newspaper,
  CreditCard,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/ui/logo";
import type { UserRole } from "@/types";

const demandLinks = [
  { href: "/dashboard", label: "Genel Bakış", icon: LayoutDashboard },
  { href: "/dashboard/ilanlar", label: "İlanlarım", icon: FileText },
  { href: "/dashboard/basvurular", label: "Başvurular", icon: Send },
  { href: "/dashboard/mesajlar", label: "Mesajlar", icon: MessageCircle },
  { href: "/dashboard/bildirimler", label: "Bildirimler", icon: Bell },
  { href: "/dashboard/firma", label: "Firma Profili", icon: Building2 },
  { href: "/dashboard/ayarlar", label: "Ayarlar", icon: Settings },
];

const producerLinks = [
  { href: "/dashboard", label: "Genel Bakış", icon: LayoutDashboard },
  { href: "/dashboard/ilanlar", label: "İlanları Keşfet", icon: FileText },
  { href: "/dashboard/basvurularim", label: "Başvurularım", icon: Send },
  { href: "/dashboard/mesajlar", label: "Mesajlar", icon: MessageCircle },
  { href: "/dashboard/bildirimler", label: "Bildirimler", icon: Bell },
  { href: "/dashboard/firma", label: "Firma Profili", icon: Building2 },
  { href: "/dashboard/katalog", label: "Katalog", icon: FileText },
  { href: "/dashboard/raporlar", label: "Raporlar", icon: BarChart3 },
  { href: "/dashboard/ayarlar", label: "Ayarlar", icon: Settings },
];

const adminLinks = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/kullanicilar", label: "Kullanıcılar", icon: Users },
  { href: "/admin/firmalar", label: "Firma Onayı", icon: Building2 },
  { href: "/admin/ilanlar", label: "İlan Yönetimi", icon: FileText },
  { href: "/admin/haberler", label: "Haberler", icon: Newspaper },
  { href: "/admin/uyelik", label: "Üyelik Paketleri", icon: CreditCard },
  { href: "/admin/raporlar", label: "Raporlar", icon: BarChart3 },
  { href: "/admin/ayarlar", label: "Site Ayarları", icon: Settings },
];

export function Sidebar({ role }: { role: UserRole }) {
  const pathname = usePathname();
  const router = useRouter();

  const links =
    role === "admin"
      ? adminLinks
      : role === "producer"
        ? producerLinks
        : demandLinks;

  async function handleLogout() {
    await fetch("/api/demo/logout", { method: "POST" });
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <aside className="flex w-64 flex-col border-r border-slate-200/80 bg-white">
      <div className="flex h-[4.25rem] items-center border-b border-slate-200/80 px-5">
        <Logo size="sm" showText={false} />
        <span className="ml-2 font-semibold text-slate-900">Panel</span>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {links.map((link) => {
          const isActive =
            pathname === link.href ||
            (link.href !== "/dashboard" &&
              link.href !== "/admin" &&
              pathname.startsWith(link.href));

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
