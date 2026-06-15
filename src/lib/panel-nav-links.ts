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
  labelKey: string;
  icon: LucideIcon;
}

const demandLinks: PanelNavLink[] = [
  { href: "/dashboard", labelKey: "panel.nav.overview", icon: LayoutDashboard },
  { href: "/dashboard/ilanlar", labelKey: "panel.nav.myListings", icon: FileText },
  { href: "/dashboard/basvurular", labelKey: "panel.nav.applications", icon: Send },
  { href: "/dashboard/mesajlar", labelKey: "panel.nav.messages", icon: MessageCircle },
  { href: "/dashboard/bildirimler", labelKey: "panel.nav.notifications", icon: Bell },
  { href: "/dashboard/firma", labelKey: "panel.nav.companyProfile", icon: Building2 },
  { href: "/dashboard/ayarlar", labelKey: "panel.nav.settings", icon: Settings },
];

const producerLinks: PanelNavLink[] = [
  { href: "/dashboard", labelKey: "panel.nav.overview", icon: LayoutDashboard },
  { href: "/dashboard/ilanlar", labelKey: "panel.nav.exploreListings", icon: FileText },
  { href: "/dashboard/basvurularim", labelKey: "panel.nav.myApplications", icon: Send },
  { href: "/dashboard/mesajlar", labelKey: "panel.nav.messages", icon: MessageCircle },
  { href: "/dashboard/bildirimler", labelKey: "panel.nav.notifications", icon: Bell },
  { href: "/dashboard/firma", labelKey: "panel.nav.companyProfile", icon: Building2 },
  { href: "/dashboard/katalog", labelKey: "panel.nav.catalog", icon: FileText },
  { href: "/dashboard/raporlar", labelKey: "panel.nav.reports", icon: BarChart3 },
  { href: "/dashboard/ayarlar", labelKey: "panel.nav.settings", icon: Settings },
];

const adminLinks: PanelNavLink[] = [
  { href: "/admin", labelKey: "panel.nav.dashboard", icon: LayoutDashboard },
  { href: "/admin/kullanicilar", labelKey: "panel.nav.users", icon: Users },
  { href: "/admin/firmalar", labelKey: "panel.nav.companyApproval", icon: Building2 },
  { href: "/admin/ilanlar", labelKey: "panel.nav.listingManagement", icon: FileText },
  { href: "/admin/kategoriler", labelKey: "panel.nav.categories", icon: Tags },
  { href: "/admin/haberler", labelKey: "panel.nav.news", icon: Newspaper },
  { href: "/admin/uyelik", labelKey: "panel.nav.membership", icon: CreditCard },
  { href: "/admin/raporlar", labelKey: "panel.nav.reports", icon: BarChart3 },
  { href: "/admin/ayarlar", labelKey: "panel.nav.siteSettings", icon: Settings },
];

export function getPanelNavLinks(role: UserRole): PanelNavLink[] {
  if (role === "admin") return adminLinks;
  if (role === "producer") return producerLinks;
  return demandLinks;
}

const bottomNavHrefs: Record<UserRole, string[]> = {
  demand_owner: [
    "/dashboard",
    "/dashboard/ilanlar",
    "/dashboard/basvurular",
    "/dashboard/mesajlar",
    "/dashboard/firma",
    "/dashboard/bildirimler",
  ],
  producer: [
    "/dashboard",
    "/dashboard/ilanlar",
    "/dashboard/basvurularim",
    "/dashboard/mesajlar",
    "/dashboard/firma",
    "/dashboard/bildirimler",
  ],
  admin: ["/admin", "/admin/kullanicilar", "/admin/firmalar", "/admin/ilanlar"],
};

const bottomNavShortLabels: Partial<Record<string, string>> = {
  "panel.nav.overview": "panel.nav.overviewShort",
  "panel.nav.companyProfile": "panel.nav.companyShort",
  "panel.nav.myListings": "panel.nav.listingsShort",
  "panel.nav.exploreListings": "panel.nav.listingsShort",
  "panel.nav.applications": "panel.nav.offersShort",
  "panel.nav.myApplications": "panel.nav.offersShort",
  "panel.nav.messages": "panel.nav.messagesShort",
  "panel.nav.notifications": "panel.nav.notificationsShort",
};

export function getPanelBottomNavLinks(role: UserRole): PanelNavLink[] {
  const hrefs = bottomNavHrefs[role];
  const all = getPanelNavLinks(role);
  return hrefs
    .map((href) => all.find((link) => link.href === href))
    .filter((link): link is PanelNavLink => Boolean(link));
}

export function getPanelMoreNavLinks(role: UserRole): PanelNavLink[] {
  const bottomHrefs = new Set(bottomNavHrefs[role]);
  return getPanelNavLinks(role).filter((link) => !bottomHrefs.has(link.href));
}

export function getPanelBottomNavLabelKey(labelKey: string): string {
  return bottomNavShortLabels[labelKey] ?? labelKey;
}

export function isPanelNavLinkActive(pathname: string, href: string): boolean {
  return (
    pathname === href ||
    (href !== "/dashboard" && href !== "/admin" && pathname.startsWith(href))
  );
}
