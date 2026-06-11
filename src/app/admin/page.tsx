import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Building2, FileText, CreditCard } from "lucide-react";

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const [
    { count: userCount },
    { count: companyCount },
    { count: listingCount },
    { count: pendingCompanies },
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("companies").select("*", { count: "exact", head: true }),
    supabase.from("listings").select("*", { count: "exact", head: true }),
    supabase.from("companies").select("*", { count: "exact", head: true }).eq("status", "pending"),
  ]);

  const stats = [
    { label: "Toplam Kullanıcı", value: userCount || 0, icon: Users },
    { label: "Toplam Firma", value: companyCount || 0, icon: Building2 },
    { label: "Toplam İlan", value: listingCount || 0, icon: FileText },
    { label: "Onay Bekleyen Firma", value: pendingCompanies || 0, icon: CreditCard },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Admin Paneli</h1>
      <p className="mt-1 text-gray-500">Platform yönetim merkezi</p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
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
        ))}
      </div>
    </div>
  );
}
