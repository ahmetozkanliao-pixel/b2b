import { getSession } from "@/lib/auth/get-session";
import { getAllDemoCompaniesAdmin, getAllDemoListingsAdmin } from "@/lib/demo/store";
import { listingStatusMap } from "@/lib/admin";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatBudget } from "@/lib/utils";
import Link from "next/link";

export default async function AdminListingsPage() {
  const session = await getSession();

  let listings: Array<{
    id: string;
    title: string;
    status: string;
    city: string | null;
    budget_min: number | null;
    budget_max: number | null;
    created_at: string;
    companyName: string;
  }> = [];

  if (session?.isDemo) {
    const companies = getAllDemoCompaniesAdmin();
    listings = getAllDemoListingsAdmin().map((l) => ({
      id: l.id,
      title: l.title,
      status: l.status,
      city: l.city,
      budget_min: l.budget_min,
      budget_max: l.budget_max,
      created_at: l.created_at,
      companyName: companies.find((c) => c.id === l.company_id)?.name || "—",
    }));
  } else {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const { data } = await supabase
      .from("listings")
      .select("*, company:companies(name)")
      .order("created_at", { ascending: false });

    listings = (data || []).map((l) => {
      const typed = l as {
        id: string;
        title: string;
        status: string;
        city: string | null;
        budget_min: number | null;
        budget_max: number | null;
        created_at: string;
        company?: { name: string } | { name: string }[];
      };
      const company = Array.isArray(typed.company) ? typed.company[0] : typed.company;
      return {
        id: typed.id,
        title: typed.title,
        status: typed.status,
        city: typed.city,
        budget_min: typed.budget_min,
        budget_max: typed.budget_max,
        created_at: typed.created_at,
        companyName: company?.name || "—",
      };
    });
  }

  const activeCount = listings.filter((l) => l.status === "active").length;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">İlan Yönetimi</h1>
      <p className="mt-1 text-gray-500">
        {listings.length} ilan · {activeCount} aktif
      </p>

      <div className="mt-6 space-y-3">
        {listings.map((listing) => {
          const status = listingStatusMap[listing.status] || listingStatusMap.draft;
          return (
            <Card key={listing.id}>
              <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-gray-900">{listing.title}</h3>
                    <Badge variant={status.variant}>{status.label}</Badge>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    {listing.companyName} &middot; {listing.city || "—"} &middot;{" "}
                    {formatBudget(listing.budget_min, listing.budget_max)} &middot;{" "}
                    {formatDate(listing.created_at)}
                  </p>
                </div>
                {listing.status === "active" && (
                  <Link
                    href={`/ilanlar/${listing.id}`}
                    className="text-sm font-medium text-primary-600 hover:text-primary-700"
                    target="_blank"
                  >
                    Görüntüle →
                  </Link>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
