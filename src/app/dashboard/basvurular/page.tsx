import { getSession } from "@/lib/auth/get-session";
import { getCategoriesByIds } from "@/lib/categories";
import { DEMO_CATEGORIES } from "@/lib/demo/config";
import { getDemoApplications, getDemoCompany } from "@/lib/demo/store";
import type { DemoApplication } from "@/lib/demo/types";
import { canUsePublicProfile, isProducerPro } from "@/lib/membership";
import { CategoryBadges } from "@/components/ui/category-badges";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ApplicationActions } from "@/components/applications/application-actions";
import Link from "next/link";
import { formatDate, formatCurrency, getCompanyProfilePath } from "@/lib/utils";

const statusMap: Record<string, { label: string; variant: "default" | "success" | "warning" | "danger" }> = {
  pending: { label: "Bekliyor", variant: "warning" },
  approved: { label: "Onaylandı", variant: "success" },
  rejected: { label: "Reddedildi", variant: "danger" },
  withdrawn: { label: "Geri Çekildi", variant: "default" },
};

export default async function ApplicationsPage() {
  const session = await getSession();

  let applications: DemoApplication[] | Array<{
    id: string;
    status: string;
    cover_letter: string | null;
    proposed_budget: number | null;
    proposed_delivery: string | null;
    created_at: string;
    applicant_id: string;
    listing_title?: string;
    producer_name?: string;
    producer_city?: string;
    producer_company_id?: string;
    listing?: { title: string };
    producer_company?: { name: string; city: string | null; category_ids?: string[] };
  }> = [];

  if (session?.isDemo && session.companyId) {
    applications = getDemoApplications(session.companyId);
  } else {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const { data: company } = await supabase
      .from("companies")
      .select("id")
      .eq("owner_id", user!.id)
      .single();

    const { data: listings } = await supabase
      .from("listings")
      .select("id")
      .eq("company_id", company?.id || "");

    const listingIds = listings?.map((l) => l.id) || [];

    const { data } = await supabase
      .from("applications")
      .select("*, listing:listings(title), producer_company:companies!applications_producer_company_id_fkey(name, city)")
      .in("listing_id", listingIds.length ? listingIds : ["none"])
      .order("created_at", { ascending: false });

    applications = data || [];
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Başvurular</h1>
      <p className="mt-1 text-gray-500">İlanlarınıza gelen üretici başvuruları</p>

      <div className="mt-6 space-y-4">
        {applications.length > 0 ? (
          applications.map((app) => {
            const status = statusMap[app.status] || statusMap.pending;
            const listingTitle = app.listing_title || app.listing?.title;
            const producerCompany =
              session?.isDemo && app.producer_company_id
                ? getDemoCompany(app.producer_company_id)
                : null;
            const producerName =
              app.producer_name || producerCompany?.name || app.producer_company?.name;
            const producerCity =
              app.producer_city || producerCompany?.city || app.producer_company?.city;
            const producerCategories = getCategoriesByIds(
              producerCompany?.category_ids ?? app.producer_company?.category_ids,
              DEMO_CATEGORIES
            );

            return (
              <Card key={app.id}>
                <CardContent>
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold text-gray-900">
                          {producerCompany && canUsePublicProfile(producerCompany) ? (
                            <Link
                              href={getCompanyProfilePath(producerCompany)}
                              className="text-brand-600 hover:text-brand-700"
                              target="_blank"
                            >
                              {producerName || "Üretici Firma"}
                            </Link>
                          ) : (
                            producerName || "Üretici Firma"
                          )}
                        </h3>
                        {producerCompany && isProducerPro(producerCompany) && (
                          <Badge variant="brand">Öne Çıkan</Badge>
                        )}
                        <Badge variant={status.variant}>{status.label}</Badge>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">
                        İlan: {listingTitle} &middot; {producerCity} &middot; {formatDate(app.created_at)}
                      </p>
                      {producerCategories.length > 0 && (
                        <div className="mt-2">
                          <p className="mb-1 text-xs text-gray-400">Üretim alanları:</p>
                          <CategoryBadges categories={producerCategories} />
                        </div>
                      )}
                      {app.cover_letter && (
                        <p className="mt-3 text-sm text-gray-600">{app.cover_letter}</p>
                      )}
                      {app.proposed_budget && (
                        <p className="mt-2 text-sm font-medium text-gray-700">
                          Teklif: {formatCurrency(app.proposed_budget)}
                          {app.proposed_delivery && ` · Teslim: ${app.proposed_delivery}`}
                        </p>
                      )}
                    </div>
                    {app.status === "pending" && (
                      <ApplicationActions
                        applicationId={app.id}
                        listingOwnerId={session!.id}
                        applicantUserId={app.applicant_id}
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
              Henüz başvuru bulunmuyor.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
