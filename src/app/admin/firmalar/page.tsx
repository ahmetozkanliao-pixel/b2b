import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CompanyApprovalActions } from "@/components/admin/company-approval-actions";
import { formatDate } from "@/lib/utils";

const statusMap: Record<string, { label: string; variant: "default" | "success" | "warning" | "danger" }> = {
  pending: { label: "Bekliyor", variant: "warning" },
  approved: { label: "Onaylı", variant: "success" },
  rejected: { label: "Reddedildi", variant: "danger" },
  suspended: { label: "Askıya Alındı", variant: "danger" },
};

export default async function AdminCompaniesPage() {
  const supabase = await createClient();

  const { data: companies } = await supabase
    .from("companies")
    .select("*, owner:profiles(full_name, email)")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Firma Yönetimi</h1>
      <p className="mt-1 text-gray-500">Firma onayları ve yönetimi</p>

      <div className="mt-6 space-y-3">
        {companies?.map((company) => {
          const status = statusMap[company.status] || statusMap.pending;
          const owner = (company as Record<string, unknown>).owner as { full_name: string; email: string } | undefined;

          return (
            <Card key={company.id}>
              <CardContent className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900">{company.name}</h3>
                    <Badge variant={status.variant}>{status.label}</Badge>
                    <Badge variant="info">
                      {company.type === "demand_owner" ? "Talep Sahibi" : "Üretici"}
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    {owner?.full_name} &middot; {owner?.email} &middot; {company.city} &middot; {formatDate(company.created_at)}
                  </p>
                </div>
                {company.status === "pending" && (
                  <CompanyApprovalActions companyId={company.id} ownerId={company.owner_id} />
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
