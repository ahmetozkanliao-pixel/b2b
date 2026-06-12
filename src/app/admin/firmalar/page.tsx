import { getSession } from "@/lib/auth/get-session";
import { getAllDemoCompaniesAdmin } from "@/lib/demo/store";
import { companyStatusMap, getCompanyOwnerInfo } from "@/lib/admin";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CompanyApprovalActions } from "@/components/admin/company-approval-actions";
import { CompanyVerificationActions } from "@/components/admin/company-verification-actions";
import { VerifiedBadge } from "@/components/ui/verified-badge";
import { formatDate } from "@/lib/utils";

export default async function AdminCompaniesPage() {
  const session = await getSession();

  let companies: Array<{
    id: string;
    name: string;
    type: string;
    status: string;
    verified?: boolean;
    city: string | null;
    created_at: string;
    owner_id: string;
    owner?: { full_name: string; email: string };
  }> = [];

  if (session?.isDemo) {
    companies = getAllDemoCompaniesAdmin().map((c) => ({
      ...c,
      owner: getCompanyOwnerInfo(c),
    }));
  } else {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const { data } = await supabase
      .from("companies")
      .select("*, owner:profiles(full_name, email)")
      .neq("id", "admin-company-001")
      .order("created_at", { ascending: false });
    companies = data || [];
  }

  const pendingCount = companies.filter((c) => c.status === "pending").length;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Firma Yönetimi</h1>
      <p className="mt-1 text-gray-500">
        {pendingCount > 0
          ? `${pendingCount} firma onay bekliyor`
          : "Tüm firmalar incelendi"}
      </p>

      <div className="mt-6 space-y-3">
        {companies.length > 0 ? (
          companies.map((company) => {
            const status = companyStatusMap[company.status] || companyStatusMap.pending;
            const owner = company.owner;

            return (
              <Card
                key={company.id}
                className={company.status === "pending" ? "border-amber-200 bg-amber-50/30" : ""}
              >
                <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-gray-900">{company.name}</h3>
                      <Badge variant={status.variant}>{status.label}</Badge>
                      <Badge variant="info">
                        {company.type === "demand_owner" ? "Talep Sahibi" : "Üretici"}
                      </Badge>
                      <VerifiedBadge
                        verified={company.verified}
                        type={company.type === "producer" ? "producer" : "demand"}
                      />
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      {owner?.full_name} &middot; {owner?.email} &middot; {company.city || "—"} &middot;{" "}
                      {formatDate(company.created_at)}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {company.status === "pending" && (
                      <CompanyApprovalActions
                        companyId={company.id}
                        ownerId={company.owner_id}
                        isDemo={session?.isDemo}
                      />
                    )}
                    {company.status === "approved" && company.type === "producer" && (
                      <CompanyVerificationActions
                        companyId={company.id}
                        verified={Boolean(company.verified)}
                        isDemo={session?.isDemo}
                      />
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <Card>
            <CardContent className="py-12 text-center text-gray-500">
              Kayıtlı firma bulunmuyor.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
