import { getSession } from "@/lib/auth/get-session";
import { getDemoAdminStats } from "@/lib/demo/store";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default async function AdminReportsPage() {
  const session = await getSession();

  let stats = getDemoAdminStats();

  if (!session?.isDemo) {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const [
      { count: companies },
      { count: listings },
      { count: applications },
      { count: pendingApps },
    ] = await Promise.all([
      supabase.from("companies").select("*", { count: "exact", head: true }),
      supabase.from("listings").select("*", { count: "exact", head: true }),
      supabase.from("applications").select("*", { count: "exact", head: true }),
      supabase.from("applications").select("*", { count: "exact", head: true }).eq("status", "pending"),
    ]);
    stats = {
      ...stats,
      totalCompanies: companies || 0,
      totalListings: listings || 0,
      totalApplications: applications || 0,
      pendingApplications: pendingApps || 0,
    };
  }

  const sections = [
    {
      title: "Firmalar",
      rows: [
        { label: "Toplam firma", value: stats.totalCompanies },
        { label: "Onay bekleyen", value: stats.pendingCompanies },
        { label: "Onaylı", value: stats.approvedCompanies },
        { label: "Talep sahibi", value: stats.demandOwners },
        { label: "Üretici", value: stats.producers },
      ],
    },
    {
      title: "İlanlar",
      rows: [
        { label: "Toplam ilan", value: stats.totalListings },
        { label: "Aktif", value: stats.activeListings },
        { label: "Kapalı", value: stats.closedListings },
      ],
    },
    {
      title: "Başvurular & İletişim",
      rows: [
        { label: "Toplam başvuru", value: stats.totalApplications },
        { label: "Bekleyen başvuru", value: stats.pendingApplications },
        { label: "Mesaj odası", value: stats.activeChats },
        { label: "Toplam mesaj", value: stats.totalMessages },
      ],
    },
    {
      title: "İçerik",
      rows: [
        { label: "Toplam haber", value: stats.totalNews },
        { label: "Yayında", value: stats.publishedNews },
      ],
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Raporlar</h1>
      <p className="mt-1 text-gray-500">Platform özet istatistikleri</p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        {sections.map((section) => (
          <Card key={section.title}>
            <CardHeader>
              <h2 className="font-semibold text-gray-900">{section.title}</h2>
            </CardHeader>
            <CardContent className="space-y-3">
              {section.rows.map((row) => (
                <div key={row.label} className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">{row.label}</span>
                  <span className="font-semibold text-gray-900">{row.value}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
