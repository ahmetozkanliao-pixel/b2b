import { getSession } from "@/lib/auth/get-session";
import { DEMO_USERS } from "@/lib/demo/config";
import { getAllDemoCompaniesAdmin } from "@/lib/demo/store";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

const roleLabels = {
  demand_owner: "Talep Sahibi",
  producer: "Üretici",
  admin: "Admin",
} as const;

export default async function AdminUsersPage() {
  const session = await getSession();

  let users: Array<{
    id: string;
    full_name: string;
    email: string;
    role: keyof typeof roleLabels;
    companyName: string;
    companyStatus: string;
    created_at: string;
  }> = [];

  if (session?.isDemo) {
    const companies = getAllDemoCompaniesAdmin();
    users = DEMO_USERS.filter((u) => u.role !== "admin").map((u) => {
      const company = companies.find((c) => c.owner_id === u.id) ?? u.company;
      return {
        id: u.id,
        full_name: u.full_name,
        email: u.email,
        role: u.role,
        companyName: company.name,
        companyStatus: company.status,
        created_at: company.created_at,
      };
    });
  } else {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const { data } = await supabase
      .from("profiles")
      .select("id, full_name, email, role, created_at, companies(name, status)")
      .neq("role", "admin")
      .order("created_at", { ascending: false });

    users = (data || []).map((p) => {
      const typed = p as {
        id: string;
        full_name: string | null;
        email: string;
        role: keyof typeof roleLabels;
        created_at: string;
        companies?: { name: string; status: string } | { name: string; status: string }[];
      };
      const company = Array.isArray(typed.companies) ? typed.companies[0] : typed.companies;
      return {
        id: typed.id,
        full_name: typed.full_name || "—",
        email: typed.email,
        role: typed.role,
        companyName: company?.name || "—",
        companyStatus: company?.status || "—",
        created_at: typed.created_at,
      };
    });
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Kullanıcılar</h1>
      <p className="mt-1 text-gray-500">Platforma kayıtlı kullanıcı hesapları</p>

      <div className="mt-6 space-y-3">
        {users.map((user) => (
          <Card key={user.id}>
            <CardContent className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold text-gray-900">{user.full_name}</h3>
                  <Badge variant={user.role === "producer" ? "brand" : "info"}>
                    {roleLabels[user.role]}
                  </Badge>
                  <Badge variant={user.companyStatus === "approved" ? "success" : "warning"}>
                    {user.companyStatus === "approved" ? "Onaylı Firma" : user.companyStatus}
                  </Badge>
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  {user.email} &middot; {user.companyName} &middot; {formatDate(user.created_at)}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
