import Link from "next/link";
import { getSession } from "@/lib/auth/get-session";
import { getDemoAdminStats } from "@/lib/demo/store";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  Building2,
  FileText,
  Send,
  Newspaper,
  MessageCircle,
  AlertCircle,
} from "lucide-react";

export default async function AdminDashboardPage() {
  const session = await getSession();

  let stats = {
    totalCompanies: 0,
    pendingCompanies: 0,
    approvedCompanies: 0,
    demandOwners: 0,
    producers: 0,
    totalListings: 0,
    activeListings: 0,
    closedListings: 0,
    totalApplications: 0,
    pendingApplications: 0,
    totalNews: 0,
    publishedNews: 0,
    totalMessages: 0,
    activeChats: 0,
  };

  if (session?.isDemo) {
    stats = getDemoAdminStats();
  } else {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const [
      { count: companyCount },
      { count: pendingCompanies },
      { count: listingCount },
      { count: activeListings },
      { count: applicationCount },
      { count: pendingApplications },
    ] = await Promise.all([
      supabase.from("companies").select("*", { count: "exact", head: true }),
      supabase.from("companies").select("*", { count: "exact", head: true }).eq("status", "pending"),
      supabase.from("listings").select("*", { count: "exact", head: true }),
      supabase.from("listings").select("*", { count: "exact", head: true }).eq("status", "active"),
      supabase.from("applications").select("*", { count: "exact", head: true }),
      supabase.from("applications").select("*", { count: "exact", head: true }).eq("status", "pending"),
    ]);

    stats = {
      ...stats,
      totalCompanies: companyCount || 0,
      pendingCompanies: pendingCompanies || 0,
      approvedCompanies: (companyCount || 0) - (pendingCompanies || 0),
      totalListings: listingCount || 0,
      activeListings: activeListings || 0,
      totalApplications: applicationCount || 0,
      pendingApplications: pendingApplications || 0,
    };
  }

  const statCards = [
    { label: "Toplam Firma", value: stats.totalCompanies, icon: Building2, href: "/admin/firmalar" },
    { label: "Onay Bekleyen", value: stats.pendingCompanies, icon: AlertCircle, href: "/admin/firmalar" },
    { label: "Aktif İlan", value: stats.activeListings, icon: FileText, href: "/admin/ilanlar" },
    { label: "Bekleyen Başvuru", value: stats.pendingApplications, icon: Send, href: "/admin/raporlar" },
    { label: "Yayınlanan Haber", value: stats.publishedNews, icon: Newspaper, href: "/admin/haberler" },
    { label: "Aktif Mesaj Odası", value: stats.activeChats, icon: MessageCircle, href: "/admin/raporlar" },
  ];

  const quickLinks = [
    { href: "/admin/firmalar", label: "Firma Onayları", desc: `${stats.pendingCompanies} firma bekliyor` },
    { href: "/admin/haberler", label: "Haber Yayınla", desc: `${stats.totalNews} haber kayıtlı` },
    { href: "/admin/ilanlar", label: "İlanları İncele", desc: `${stats.totalListings} toplam ilan` },
    { href: "/admin/kullanicilar", label: "Kullanıcılar", desc: "Platform hesapları" },
  ];

  return (
    <div>
      {session?.isDemo && (
        <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Demo admin modundasınız. Tüm yönetim işlemleri yerel veri üzerinde çalışır.
        </div>
      )}

      <h1 className="text-2xl font-bold text-gray-900">Admin Paneli</h1>
      <p className="mt-1 text-gray-500">Platform yönetim merkezi</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <Card hover>
              <CardContent className="flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-100">
                  <stat.icon className="h-5 w-5 text-primary-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-10">
        <h2 className="text-lg font-semibold text-gray-900">Hızlı İşlemler</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {quickLinks.map((link) => (
            <Card key={link.href}>
              <CardContent className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-gray-900">{link.label}</h3>
                  <p className="text-sm text-gray-500">{link.desc}</p>
                </div>
                <Link href={link.href}>
                  <Button size="sm" variant="outline">
                    Git
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <Card>
          <CardContent>
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Talep Sahibi / Üretici</p>
                <p className="font-semibold text-gray-900">
                  {stats.demandOwners} talep · {stats.producers} üretici
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">İlan Durumu</p>
                <p className="font-semibold text-gray-900">
                  {stats.activeListings} aktif · {stats.closedListings} kapalı
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
