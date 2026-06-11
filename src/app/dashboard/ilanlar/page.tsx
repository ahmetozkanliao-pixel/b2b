import Link from "next/link";
import { getSession } from "@/lib/auth/get-session";
import { getCategoriesByIds } from "@/lib/categories";
import { DEMO_CATEGORIES } from "@/lib/demo/config";
import { getDemoCompany, getDemoListings, getDemoListingsForProducer } from "@/lib/demo/store";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CategoryBadges } from "@/components/ui/category-badges";
import { Plus, Filter } from "lucide-react";
import { formatDate, formatBudget } from "@/lib/utils";

const statusLabels: Record<string, { label: string; variant: "default" | "success" | "warning" | "danger" }> = {
  draft: { label: "Taslak", variant: "default" },
  active: { label: "Aktif", variant: "success" },
  closed: { label: "Kapalı", variant: "warning" },
  cancelled: { label: "İptal", variant: "danger" },
};

export default async function MyListingsPage() {
  const session = await getSession();
  const isProducer = session?.role === "producer";

  if (isProducer) {
    let listings = session?.isDemo && session.companyId
      ? getDemoListingsForProducer(session.companyId)
      : [];

    const producerCategories = DEMO_CATEGORIES;
    let producerCompany = session?.companyId && session.isDemo
      ? getDemoCompany(session.companyId)
      : null;

    if (!session?.isDemo) {
      const supabase = await createClient();
      const { data: company } = await supabase
        .from("companies")
        .select("*")
        .eq("owner_id", session!.id)
        .single();
      producerCompany = company;

      if (company?.category_ids?.length) {
        const { data } = await supabase
          .from("listings")
          .select("*, category:categories(name)")
          .eq("status", "active")
          .in("category_id", company.category_ids)
          .order("created_at", { ascending: false });
        listings = data || [];
      }
    }

    const matchedCategories = getCategoriesByIds(
      producerCompany?.category_ids,
      producerCategories
    );

    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-900">İlanları Keşfet</h1>
        <p className="mt-1 text-gray-500">
          Sadece üretim kategorilerinize uygun ilanlar gösterilir
        </p>

        {matchedCategories.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-2 rounded-lg border border-primary-100 bg-primary-50 px-4 py-3">
            <Filter className="h-4 w-4 text-primary-600" />
            <span className="text-sm text-primary-800">Eşleşen kategoriler:</span>
            <CategoryBadges categories={matchedCategories} />
          </div>
        )}

        {!producerCompany?.category_ids?.length && (
          <Card className="mt-6">
            <CardContent className="py-8 text-center">
              <p className="text-gray-600">
                İlanları görebilmek için firma profilinizde üretim kategorilerini seçmelisiniz.
              </p>
              <Link href="/dashboard/firma" className="mt-4 inline-block">
                <Button>Firma Profilini Tamamla</Button>
              </Link>
            </CardContent>
          </Card>
        )}

        <div className="mt-6 grid gap-4">
          {listings.length > 0 ? (
            listings.map((listing) => (
              <Card key={listing.id} hover>
                <CardContent className="flex items-center justify-between gap-4">
                  <div>
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                      {listing.category && (
                        <Badge variant="info">{listing.category.name}</Badge>
                      )}
                    </div>
                    <h3 className="font-semibold text-gray-900">{listing.title}</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {listing.city} &middot; {formatBudget(listing.budget_min, listing.budget_max)}
                    </p>
                  </div>
                  <Link href={`/ilanlar/${listing.id}`}>
                    <Button size="sm">Detay & Başvur</Button>
                  </Link>
                </CardContent>
              </Card>
            ))
          ) : producerCompany?.category_ids?.length ? (
            <Card>
              <CardContent className="py-12 text-center text-gray-500">
                Seçtiğiniz kategorilerde şu an aktif ilan bulunmuyor.
              </CardContent>
            </Card>
          ) : null}
        </div>
      </div>
    );
  }

  let listings = session?.isDemo && session.companyId
    ? getDemoListings(session.companyId)
    : [];

  if (!session?.isDemo) {
    const supabase = await createClient();
    const { data: company } = await supabase
      .from("companies")
      .select("id")
      .eq("owner_id", session!.id)
      .single();

    const { data } = await supabase
      .from("listings")
      .select("*, category:categories(name)")
      .eq("company_id", company?.id || "")
      .order("created_at", { ascending: false });

    listings = data || [];
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">İlanlarım</h1>
          <p className="mt-1 text-gray-500">Oluşturduğunuz ilanları yönetin</p>
        </div>
        <Link href="/dashboard/ilanlar/yeni">
          <Button>
            <Plus className="h-4 w-4" />
            Yeni İlan
          </Button>
        </Link>
      </div>

      <div className="mt-6 grid gap-4">
        {listings.length > 0 ? (
          listings.map((listing) => {
            const status = statusLabels[listing.status] || statusLabels.draft;
            return (
              <Card key={listing.id} hover>
                <CardContent className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900">{listing.title}</h3>
                      <Badge variant={status.variant}>{status.label}</Badge>
                      {listing.category && (
                        <Badge variant="info">{listing.category.name}</Badge>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      {formatDate(listing.created_at)} &middot;{" "}
                      {formatBudget(listing.budget_min, listing.budget_max)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-500">Henüz ilan oluşturmadınız.</p>
              <Link href="/dashboard/ilanlar/yeni" className="mt-4 inline-block">
                <Button>İlk İlanınızı Oluşturun</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
