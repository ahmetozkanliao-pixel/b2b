import { getSession } from "@/lib/auth/get-session";
import { getDemoUserById } from "@/lib/demo/session";
import { getDemoCompany, getDemoDashboardStats } from "@/lib/demo/store";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { FileText, Send, MessageCircle, Bell, CheckCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function DashboardPage() {
  const session = await getSession();
  const isProducer = session!.role === "producer";

  let companyName = "Firma profilinizi tamamlayın";
  let stats = {
    activeListings: 0,
    pendingApplications: 0,
    approvedApplications: 0,
    activeChats: 0,
    unreadNotifications: 0,
  };

  if (session!.isDemo && session!.companyId) {
    const demoUser = getDemoUserById(session!.id);
    companyName = getDemoCompany(session!.companyId)?.name ?? demoUser?.company.name ?? companyName;
    stats = getDemoDashboardStats(
      session!.companyId,
      session!.id,
      isProducer ? "producer" : "demand_owner"
    );
  }

  const demandStats = [
    { label: "Aktif İlanlar", value: String(stats.activeListings), icon: FileText, href: "/dashboard/ilanlar" },
    { label: "Bekleyen Teklifler", value: String(stats.pendingApplications), icon: Send, href: "/dashboard/basvurular" },
    { label: "Aktif Mesajlar", value: String(stats.activeChats), icon: MessageCircle, href: "/dashboard/mesajlar" },
    { label: "Okunmamış Bildirim", value: String(stats.unreadNotifications), icon: Bell, href: "/dashboard/bildirimler" },
  ];

  const producerStats = [
    { label: "Tekliflerim", value: String(stats.pendingApplications + stats.approvedApplications), icon: Send, href: "/dashboard/basvurularim" },
    { label: "Onaylanan", value: String(stats.approvedApplications), icon: CheckCircle, href: "/dashboard/basvurularim" },
    { label: "Aktif Mesajlar", value: String(stats.activeChats), icon: MessageCircle, href: "/dashboard/mesajlar" },
    { label: "Açık İlanlar", value: String(stats.activeListings), icon: FileText, href: "/dashboard/ilanlar" },
  ];

  const displayStats = isProducer ? producerStats : demandStats;

  return (
    <div>
      {session!.isDemo && (
        <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Demo modundasınız ({isProducer ? "Tedarikçi" : "Müşteri"}). Tüm panel özellikleri aktiftir.
        </div>
      )}

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Hoş geldiniz, {session!.full_name || "Kullanıcı"}
        </h1>
        <p className="mt-1 text-gray-500">{companyName}</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {displayStats.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <Card hover>
              <CardContent className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100">
                  <stat.icon className="h-6 w-6 text-primary-600" />
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

      <Card className="mt-8">
        <CardHeader>
          <h2 className="text-lg font-semibold">Hızlı İşlemler</h2>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          {isProducer ? (
            <>
              <Link href="/dashboard/ilanlar">
                <Button>İlanları Keşfet</Button>
              </Link>
              <Link href="/dashboard/basvurularim">
                <Button variant="outline">Tekliflerim</Button>
              </Link>
              <Link href="/dashboard/mesajlar">
                <Button variant="outline">Mesajlar</Button>
              </Link>
              <Link href="/dashboard/katalog">
                <Button variant="outline">Katalog</Button>
              </Link>
            </>
          ) : (
            <>
              <Link href="/dashboard/ilanlar/yeni">
                <Button>Yeni İlan Oluştur</Button>
              </Link>
              <Link href="/dashboard/basvurular">
                <Button variant="outline">Teklifleri İncele</Button>
              </Link>
              <Link href="/dashboard/mesajlar">
                <Button variant="outline">Mesajlara Git</Button>
              </Link>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
