import {
  LayoutDashboard,
  FileText,
  Send,
  MessageCircle,
  Bell,
  Building2,
  Settings,
  Users,
  Newspaper,
  CreditCard,
  BarChart3,
  Tags,
  type LucideIcon,
} from "lucide-react";
import type { UserRole } from "@/types";

export interface PanelNavLink {
  href: string;
  label: string;
  icon: LucideIcon;
}

const demandLinks: PanelNavLink[] = [
  { href: "/dashboard", label: "Genel Bakış", icon: LayoutDashboard },
  { href: "/dashboard/ilanlar", label: "İlanlarım", icon: FileText },
  { href: "/dashboard/basvurular", label: "Başvurular", icon: Send },
  { href: "/dashboard/mesajlar", label: "Mesajlar", icon: MessageCircle },
  { href: "/dashboard/bildirimler", label: "Bildirimler", icon: Bell },
  { href: "/dashboard/firma", label: "Firma Profili", icon: Building2 },
  { href: "/dashboard/ayarlar", label: "Ayarlar", icon: Settings },
];

const producerLinks: PanelNavLink[] = [
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

const adminLinks: PanelNavLink[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/kullanicilar", label: "Kullanıcılar", icon: Users },
  { href: "/admin/firmalar", label: "Firma Onayı", icon: Building2 },
  { href: "/admin/ilanlar", label: "İlan Yönetimi", icon: FileText },
  { href: "/admin/kategoriler", label: "Kategoriler", icon: Tags },
  { href: "/admin/haberler", label: "Haberler", icon: Newspaper },
  { href: "/admin/uyelik", label: "Üyelik Paketleri", icon: CreditCard },
  { href: "/admin/raporlar", label: "Raporlar", icon: BarChart3 },
  { href: "/admin/ayarlar", label: "Site Ayarları", icon: Settings },
];

export function getPanelNavLinks(role: UserRole): PanelNavLink[] {
  if (role === "admin") return adminLinks;
  if (role === "producer") return producerLinks;
  return demandLinks;
}

export function isPanelNavLinkActive(pathname: string, href: string): boolean {
  return (
    pathname === href ||
    (href !== "/dashboard" && href !== "/admin" && pathname.startsWith(href))
  );
}
