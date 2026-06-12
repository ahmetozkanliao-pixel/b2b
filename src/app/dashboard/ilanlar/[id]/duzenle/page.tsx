import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getSession } from "@/lib/auth/get-session";
import { getAppCategories } from "@/lib/get-categories";
import { getDemoListingForOwner } from "@/lib/demo/store";
import { ListingForm } from "@/components/listings/listing-form";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { Category, Listing } from "@/types";

export default async function EditListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getSession();
  if (!session) redirect("/giris");

  let listing: Listing | null = null;
  const categories: Category[] = await getAppCategories();
  const isDemo = session.isDemo;

  if (session.isDemo && session.companyId) {
    listing = getDemoListingForOwner(id, session.companyId);
  } else {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const { data: company } = await supabase
      .from("companies")
      .select("id")
      .eq("owner_id", session.id)
      .single();

    const { data } = await supabase
      .from("listings")
      .select("*")
      .eq("id", id)
      .eq("company_id", company?.id || "")
      .single();

    listing = data;
  }

  if (!listing) notFound();

  if (listing.status === "cancelled" || listing.status === "closed") {
    redirect("/dashboard/ilanlar");
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        href="/dashboard/ilanlar"
        className="mb-4 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
      >
        <ArrowLeft className="h-4 w-4" />
        İlanlarıma Dön
      </Link>
      <Card>
        <CardHeader>
          <h1 className="text-2xl font-bold text-gray-900">İlanı Düzenle</h1>
          <p className="text-sm text-gray-500">{listing.title}</p>
        </CardHeader>
        <CardContent>
          <ListingForm
            categories={categories}
            companyId={session.companyId!}
            userId={session.id}
            isDemo={isDemo}
            listingId={listing.id}
            initialListing={listing}
          />
        </CardContent>
      </Card>
    </div>
  );
}
