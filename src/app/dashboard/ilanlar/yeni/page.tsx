import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/get-session";
import { DEMO_CATEGORIES } from "@/lib/demo/config";
import { createClient } from "@/lib/supabase/server";
import { ListingForm } from "@/components/listings/listing-form";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { Category } from "@/types";

export default async function NewListingPage() {
  const session = await getSession();
  if (!session) redirect("/giris");

  let companyId = session.companyId;
  let categories: Category[] = DEMO_CATEGORIES;
  const userId = session.id;
  let isDemo = session.isDemo;

  if (!session.isDemo) {
    const supabase = await createClient();
    const { data: company } = await supabase
      .from("companies")
      .select("id")
      .eq("owner_id", session.id)
      .eq("type", "demand_owner")
      .single();

    if (!company) redirect("/dashboard/firma");
    companyId = company.id;

    const { data: dbCategories } = await supabase
      .from("categories")
      .select("*")
      .eq("is_active", true)
      .order("sort_order");

    categories = dbCategories || [];
    isDemo = false;
  }

  if (!companyId) redirect("/dashboard/firma");

  return (
    <div className="mx-auto max-w-2xl">
      <Card>
        <CardHeader>
          <h1 className="text-2xl font-bold text-gray-900">Yeni İlan Oluştur</h1>
          <p className="text-sm text-gray-500">
            Üretim ihtiyacınızı detaylı olarak tanımlayın
          </p>
        </CardHeader>
        <CardContent>
          <ListingForm
            categories={categories}
            companyId={companyId}
            userId={userId}
            isDemo={isDemo}
          />
        </CardContent>
      </Card>
    </div>
  );
}
