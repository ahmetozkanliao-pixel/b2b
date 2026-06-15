import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/get-session";
import { getAppCategories } from "@/lib/get-categories";
import { createClient } from "@/lib/supabase/server";
import { ListingForm } from "@/components/listings/listing-form";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { Category } from "@/types";

export default async function NewListingPage() {
  const session = await getSession();
  if (!session) redirect("/giris");

  let companyId = session.companyId;
  const categories: Category[] = await getAppCategories();
  const userId = session.id;
  const isDemo = session.isDemo;

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
  }

  if (!companyId) redirect("/dashboard/firma");

  return (
    <div className="mx-auto max-w-3xl">
      <Card>
        <CardHeader>
          <h1 className="text-2xl font-bold text-gray-900">Yeni İlan Oluştur</h1>
          <p className="text-sm text-gray-500">
            Adım adım ilerleyerek ihtiyacınızı tanımlayın — fiyat bilgisi tedarikçilerden gelecek
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
